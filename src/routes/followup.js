const express = require('express');
const router = express.Router();
const followupService = require('../services/followup');
const db = require('../services/db');
const { logSecurity, logError, logAudit } = require('../utils/secure-logger');
const { sanitizeInput } = require('../utils/sanitizer');

// Apply rate limiting
const { rateLimit } = require('../middleware/rateLimiter');
router.use(rateLimit({ windowMs: 60000, maxRequests: 50 })); // 50 requests/minute

// Auth middleware (reuse from scribe routes)
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.LINE_CHANNEL_SECRET || 'scribe-dev-secret';

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.clinicianId = decoded.id;
        req.clinician = decoded;
        next();
    } catch (err) {
        logSecurity('AUTH_FAILED', { ip: req.ip });
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// ═════════════════════════════════════════════════════════════
// ENROLLMENT ROUTES
// ═════════════════════════════════════════════════════════════

/**
 * POST /api/followup/enroll
 * Enroll a patient from Scribe into LINE follow-up
 */
router.post('/enroll', authMiddleware, async (req, res) => {
    try {
        const {
            scribeNoteId,
            patientName,
            patientHn,
            patientPhone,
            patientAge,
            patientCondition,
            lineUserId,
            followupProgram
        } = req.body;

        // Validate required fields
        if (!scribeNoteId || !patientName) {
            return res.status(400).json({
                error: 'Missing required fields: scribeNoteId, patientName'
            });
        }

        // Enroll patient
        const enrollment = await followupService.enrollPatient({
            scribeNoteId,
            clinicianId: req.clinicianId,
            patientName,
            patientHn,
            patientPhone,
            patientAge,
            patientCondition,
            lineUserId,
            followupProgram: followupProgram || 'chronic_care'
        });

        logAudit('FOLLOWUP_ENROLL', req.clinicianId, {
            enrollmentId: enrollment.id,
            patientName
        });

        res.json({
            success: true,
            enrollment: {
                id: enrollment.id,
                patientName: enrollment.patient_name,
                status: enrollment.status,
                currentDay: enrollment.current_day,
                enrolledAt: enrollment.enrolled_at
            }
        });
    } catch (err) {
        logError('Follow-up enrollment failed', err);

        if (err.message.includes('already enrolled')) {
            return res.status(409).json({ error: err.message });
        }

        res.status(500).json({ error: 'Enrollment failed' });
    }
});

/**
 * POST /api/followup/enrollments/:id/link-line
 * Link a LINE user to an existing enrollment
 */
router.post('/enrollments/:id/link-line', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { lineUserId } = req.body;

        if (!lineUserId) {
            return res.status(400).json({ error: 'lineUserId required' });
        }

        // Verify enrollment belongs to clinician
        const enrollment = await followupService.getEnrollment(id);
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        if (enrollment.clinician_id !== req.clinicianId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await followupService.linkLINEUser(id, lineUserId);

        res.json({ success: true, message: 'LINE user linked successfully' });
    } catch (err) {
        logError('LINE linkage failed', err);
        res.status(500).json({ error: 'LINE linkage failed' });
    }
});

/**
 * GET /api/followup/enrollments
 * Get all enrollments for current clinician
 */
router.get('/enrollments', authMiddleware, async (req, res) => {
    try {
        const { status } = req.query; // 'active', 'completed', 'opted_out'

        const enrollments = await followupService.getClinicianEnrollments(
            req.clinicianId,
            status || 'active'
        );

        res.json({
            success: true,
            enrollments: enrollments.map(e => ({
                id: e.id,
                patientName: e.patient_name,
                patientHn: e.patient_hn,
                status: e.status,
                currentDay: e.current_day,
                lineLinked: e.line_linked,
                messagesSent: e.messages_sent,
                messagesResponded: e.messages_responded,
                enrolledAt: e.enrolled_at
            }))
        });
    } catch (err) {
        logError('Get enrollments failed', err);
        res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
});

/**
 * GET /api/followup/enrollments/:id
 * Get single enrollment details
 */
router.get('/enrollments/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await followupService.getEnrollment(id);
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        if (enrollment.clinician_id !== req.clinicianId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Get messages for this enrollment
        const messagesResult = await db.query(
            `SELECT * FROM followup_messages 
             WHERE enrollment_id = $1 
             ORDER BY message_day ASC`,
            [id]
        );

        // Get responses for this enrollment
        const responsesResult = await db.query(
            `SELECT * FROM patient_responses 
             WHERE enrollment_id = $1 
             ORDER BY responded_at DESC`,
            [id]
        );

        res.json({
            success: true,
            enrollment: {
                id: enrollment.id,
                patientName: enrollment.patient_name,
                patientHn: enrollment.patient_hn,
                patientPhone: enrollment.patient_phone,
                status: enrollment.status,
                currentDay: enrollment.current_day,
                lineLinked: enrollment.line_linked,
                lineDisplayName: enrollment.line_display_name,
                messagesSent: enrollment.messages_sent,
                messagesResponded: enrollment.messages_responded,
                enrolledAt: enrollment.enrolled_at,
                completedAt: enrollment.completed_at
            },
            messages: messagesResult.rows,
            responses: responsesResult.rows
        });
    } catch (err) {
        logError('Get enrollment details failed', err);
        res.status(500).json({ error: 'Failed to fetch enrollment details' });
    }
});

/**
 * POST /api/followup/enrollments/:id/complete
 * Mark enrollment as completed
 */
router.post('/enrollments/:id/complete', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await followupService.getEnrollment(id);
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        if (enrollment.clinician_id !== req.clinicianId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await followupService.completeEnrollment(id);

        logAudit('FOLLOWUP_COMPLETE', req.clinicianId, { enrollmentId: id });

        res.json({ success: true, message: 'Enrollment completed' });
    } catch (err) {
        logError('Complete enrollment failed', err);
        res.status(500).json({ error: 'Failed to complete enrollment' });
    }
});

/**
 * POST /api/followup/enrollments/:id/opt-out
 * Opt-out patient from follow-up
 */
router.post('/enrollments/:id/opt-out', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const enrollment = await followupService.getEnrollment(id);
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        if (enrollment.clinician_id !== req.clinicianId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await followupService.optOut(id, reason || 'Patient requested');

        logAudit('FOLLOWUP_OPT_OUT', req.clinicianId, { enrollmentId: id, reason });

        res.json({ success: true, message: 'Patient opted out' });
    } catch (err) {
        logError('Opt-out failed', err);
        res.status(500).json({ error: 'Failed to opt-out patient' });
    }
});

// ═════════════════════════════════════════════════════════════
// STATS & ANALYTICS
// ═════════════════════════════════════════════════════════════

/**
 * GET /api/followup/stats
 * Get follow-up statistics for current clinician
 */
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const stats = await followupService.getClinicianStats(req.clinicianId);

        res.json({
            success: true,
            stats: {
                totalEnrollments: parseInt(stats.total_enrollments) || 0,
                activeEnrollments: parseInt(stats.active_enrollments) || 0,
                completedEnrollments: parseInt(stats.completed_enrollments) || 0,
                lineLinked: parseInt(stats.line_linked) || 0,
                avgMessagesSent: parseFloat(stats.avg_messages_sent) || 0,
                avgMessagesResponded: parseFloat(stats.avg_messages_responded) || 0,
                responseRate: parseFloat(stats.response_rate) || 0
            }
        });
    } catch (err) {
        logError('Get stats failed', err);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// ═════════════════════════════════════════════════════════════
// WEBHOOK HANDLER (LINE responses)
// ═════════════════════════════════════════════════════════════

/**
 * POST /api/followup/webhook/line
 * Handle patient responses from LINE
 */
router.post('/webhook/line', async (req, res) => {
    try {
        const { lineUserId, messageContent, originalMessageId } = req.body;

        if (!lineUserId || !messageContent) {
            return res.status(400).json({ error: 'lineUserId and messageContent required' });
        }

        const response = await followupService.processResponse(
            lineUserId,
            messageContent,
            originalMessageId
        );

        res.json({ success: true, response });
    } catch (err) {
        logError('Process LINE response failed', err);
        res.status(500).json({ error: 'Failed to process response' });
    }
});

// ═════════════════════════════════════════════════════════════
// TEMPLATES MANAGEMENT
// ═════════════════════════════════════════════════════════════

/**
 * GET /api/followup/templates
 * Get all active follow-up templates
 */
router.get('/templates', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM followup_templates 
             WHERE is_active = TRUE 
             ORDER BY day_number ASC, language ASC`
        );

        res.json({
            success: true,
            templates: result.rows
        });
    } catch (err) {
        logError('Get templates failed', err);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

/**
 * GET /api/followup/templates/:dayNumber
 * Get template for specific day
 */
router.get('/templates/:dayNumber', authMiddleware, async (req, res) => {
    try {
        const { dayNumber } = req.params;
        const { language } = req.query;

        const template = await followupService.getTemplate(
            parseInt(dayNumber),
            language || 'th'
        );

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json({ success: true, template });
    } catch (err) {
        logError('Get template failed', err);
        res.status(500).json({ error: 'Failed to fetch template' });
    }
});

module.exports = router;
