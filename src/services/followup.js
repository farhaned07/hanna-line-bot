const db = require('./db');
const line = require('./line');

// Simple translation helper (backend doesn't need full i18n)
const t = (key) => key;

/**
 * FollowUp Service
 * 
 * Manages automated patient follow-up via LINE
 * - Day 1/3/7/14 automated messaging
 * - Patient-LINE linkage
 * - Response tracking and sentiment analysis
 * - Nurse escalation for concerning responses
 */

class FollowUpService {
    /**
     * Enroll a patient from Scribe into LINE follow-up
     * @param {Object} enrollmentData - { scribeNoteId, clinicianId, patientName, patientHn, patientPhone, lineUserId }
     * @returns {Object} Created enrollment
     */
    async enrollPatient(enrollmentData) {
        const {
            scribeNoteId,
            clinicianId,
            patientName,
            patientHn,
            patientPhone,
            patientAge,
            patientCondition,
            lineUserId,
            followupProgram = 'chronic_care'
        } = enrollmentData;

        // Check if patient already enrolled
        const existingEnrollment = await db.query(
            `SELECT id FROM followup_enrollments 
             WHERE (scribe_note_id = $1 OR patient_hn = $2) 
             AND status = 'active'`,
            [scribeNoteId, patientHn]
        );

        if (existingEnrollment.rows.length > 0) {
            throw new Error('Patient already enrolled in follow-up program');
        }

        // Create enrollment record
        const result = await db.query(
            `INSERT INTO followup_enrollments (
                scribe_note_id, clinician_id, patient_name, patient_hn, 
                patient_phone, patient_age, patient_condition, line_user_id,
                followup_program, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active')
            RETURNING *`,
            [
                scribeNoteId,
                clinicianId,
                patientName,
                patientHn,
                patientPhone,
                patientAge,
                patientCondition,
                lineUserId,
                followupProgram
            ]
        );

        const enrollment = result.rows[0];

        // Link LINE user if provided
        if (lineUserId) {
            await this.linkLINEUser(enrollment.id, lineUserId);
        }

        // Schedule Day 1 message (send immediately)
        await this.scheduleMessage(enrollment.id, 1);

        // Schedule future messages (Days 3, 7, 14)
        await this.scheduleMessage(enrollment.id, 3);
        await this.scheduleMessage(enrollment.id, 7);
        await this.scheduleMessage(enrollment.id, 14);

        // Log enrollment
        await db.query(
            `INSERT INTO audit_log (actor, action, patient_id, details)
             VALUES ($1, $2, $3, $4)`,
            ['FollowUpService', 'PATIENT_ENROLLED', null, JSON.stringify({
                enrollmentId: enrollment.id,
                scribeNoteId,
                clinicianId,
                patientName
            })]
        );

        console.log(`✅ [FollowUp] Patient enrolled: ${patientName} (${enrollment.id})`);
        return enrollment;
    }

    /**
     * Link a follow-up enrollment to a LINE user
     * @param {string} enrollmentId - Follow-up enrollment UUID
     * @param {string} lineUserId - LINE user ID
     */
    async linkLINEUser(enrollmentId, lineUserId) {
        // Get LINE profile
        let lineDisplayName = null;
        try {
            const profile = await line.getProfile(lineUserId);
            lineDisplayName = profile.displayName;
        } catch (err) {
            console.warn(`⚠️ [FollowUp] Could not get LINE profile: ${err.message}`);
        }

        // Update enrollment with LINE linkage
        await db.query(
            `UPDATE followup_enrollments 
             SET line_user_id = $1, 
                 line_display_name = $2,
                 line_linked = TRUE,
                 line_linked_at = NOW()
             WHERE id = $3`,
            [lineUserId, lineDisplayName, enrollmentId]
        );

        // Also link to chronic_patients table if exists
        await db.query(
            `UPDATE chronic_patients 
             SET line_user_id = $1
             WHERE phone_number IN (
                 SELECT patient_phone FROM followup_enrollments WHERE id = $2
             )`,
            [lineUserId, enrollmentId]
        );

        console.log(`✅ [FollowUp] LINE user linked: ${lineDisplayName || lineUserId}`);
    }

    /**
     * Schedule a follow-up message for a specific day
     * @param {string} enrollmentId - Enrollment UUID
     * @param {number} dayNumber - 1, 3, 7, or 14
     */
    async scheduleMessage(enrollmentId, dayNumber) {
        const enrollment = await this.getEnrollment(enrollmentId);
        if (!enrollment) {
            throw new Error('Enrollment not found');
        }

        // Calculate scheduled date based on day number
        const scheduledFor = new Date(enrollment.enrolled_at);
        if (dayNumber === 1) {
            // Day 1: Send immediately
        } else if (dayNumber === 3) {
            scheduledFor.setDate(scheduledFor.getDate() + 2); // Day 3 = 2 days after Day 1
            scheduledFor.setHours(10, 0, 0, 0); // 10 AM
        } else if (dayNumber === 7) {
            scheduledFor.setDate(scheduledFor.getDate() + 6); // Day 7 = 6 days after Day 1
            scheduledFor.setHours(10, 0, 0, 0);
        } else if (dayNumber === 14) {
            scheduledFor.setDate(scheduledFor.getDate() + 13); // Day 14 = 13 days after Day 1
            scheduledFor.setHours(10, 0, 0, 0);
        }

        // Get template for this day
        const template = await this.getTemplate(dayNumber, 'th'); // Default to Thai

        if (!template) {
            console.error(`❌ [FollowUp] No template found for day ${dayNumber}`);
            return null;
        }

        // Personalize message content
        const messageContent = this.personalizeMessage(template.message_body, enrollment);

        // Create message record
        const result = await db.query(
            `INSERT INTO followup_messages (
                enrollment_id, message_day, message_template, message_content,
                message_language, scheduled_for, delivery_status
            ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING *`,
            [
                enrollmentId,
                dayNumber,
                template.template_name,
                messageContent,
                template.language,
                scheduledFor
            ]
        );

        console.log(`📅 [FollowUp] Message scheduled: Day ${dayNumber} for ${scheduledFor.toISOString()}`);
        return result.rows[0];
    }

    /**
     * Send pending messages (called by scheduler)
     */
    async sendPendingMessages() {
        const now = new Date();

        // Get all pending messages that should be sent now
        const result = await db.query(
            `SELECT fm.*, fe.line_user_id, fe.patient_name, fe.clinician_id
             FROM followup_messages fm
             JOIN followup_enrollments fe ON fm.enrollment_id = fe.id
             WHERE fm.delivery_status = 'pending'
             AND fm.scheduled_for <= NOW()
             AND fe.status = 'active'
             ORDER BY fm.scheduled_for ASC`,
            []
        );

        let sentCount = 0;
        let failedCount = 0;

        for (const message of result.rows) {
            try {
                if (!message.line_user_id) {
                    // Patient not linked to LINE yet - skip or send SMS fallback
                    console.warn(`⚠️ [FollowUp] No LINE user ID for message ${message.id}`);
                    await this.updateMessageStatus(message.id, 'failed', 'No LINE user ID');
                    failedCount++;
                    continue;
                }

                // Send LINE message
                await line.pushMessage(message.line_user_id, {
                    type: 'text',
                    text: message.message_content
                });

                // Update message status
                await this.updateMessageStatus(message.id, 'sent', null, message.id);
                sentCount++;

                // Update enrollment stats
                await db.query(
                    `UPDATE followup_enrollments 
                     SET messages_sent = messages_sent + 1,
                         current_day = $2
                     WHERE id = $1`,
                    [message.enrollment_id, message.message_day]
                );

                console.log(`✅ [FollowUp] Message sent to ${message.patient_name} (Day ${message.message_day})`);
            } catch (err) {
                console.error(`❌ [FollowUp] Failed to send message ${message.id}:`, err.message);
                await this.updateMessageStatus(message.id, 'failed', err.message);
                failedCount++;
            }
        }

        console.log(`📊 [FollowUp] Messages processed: ${sentCount} sent, ${failedCount} failed`);
        return { sentCount, failedCount };
    }

    /**
     * Update message delivery status
     */
    async updateMessageStatus(messageId, status, error = null, lineMessageId = null) {
        const updates = ['delivery_status = $1'];
        const values = [status];
        let paramCount = 1;

        if (error) {
            paramCount++;
            updates.push(`line_delivery_error = $${paramCount}`);
            values.push(error);
        }

        if (lineMessageId) {
            paramCount++;
            updates.push(`line_message_id = $${paramCount}`);
            values.push(lineMessageId);
        }

        if (status === 'sent') {
            paramCount++;
            updates.push(`sent_at = $${paramCount}`);
            values.push(new Date());
        }

        await db.query(
            `UPDATE followup_messages 
             SET ${updates.join(', ')}, updated_at = NOW()
             WHERE id = $${paramCount + 1}`,
            [...values, messageId]
        );
    }

    /**
     * Process patient response to follow-up message
     * @param {string} lineUserId - LINE user ID
     * @param {string} messageContent - Patient's response
     * @param {string} originalMessageId - ID of the message being responded to
     */
    async processResponse(lineUserId, messageContent, originalMessageId = null) {
        // Find enrollment by LINE user ID
        const enrollmentResult = await db.query(
            `SELECT id FROM followup_enrollments WHERE line_user_id = $1 AND status = 'active'`,
            [lineUserId]
        );

        if (enrollmentResult.rows.length === 0) {
            console.warn(`⚠️ [FollowUp] Response from non-enrolled user: ${lineUserId}`);
            return null;
        }

        const enrollmentId = enrollmentResult.rows[0].id;

        // Simple sentiment analysis (can be enhanced with AI)
        const sentiment = this.analyzeSentiment(messageContent);

        // Check for concerning keywords
        const concerningKeywords = ['เจ็บหน้าอก', 'หายใจไม่ออก', 'เป็นลม', 'chest pain', 'breathe', 'faint'];
        const requiresAttention = concerningKeywords.some(keyword => 
            messageContent.toLowerCase().includes(keyword)
        );

        // Create response record
        const result = await db.query(
            `INSERT INTO patient_responses (
                enrollment_id, message_id, response_content, response_type,
                sentiment_score, sentiment_label, requires_attention, attention_reason
            ) VALUES ($1, $2, $3, 'text', $4, $5, $6, $7)
            RETURNING *`,
            [
                enrollmentId,
                originalMessageId,
                messageContent,
                sentiment.score,
                sentiment.label,
                requiresAttention,
                requiresAttention ? 'Concerning keywords detected' : null
            ]
        );

        // Update enrollment with response stats
        await db.query(
            `UPDATE followup_enrollments 
             SET messages_responded = messages_responded + 1,
                 last_response_at = NOW()
             WHERE id = $1`,
            [enrollmentId]
        );

        // Escalate to nurse if requires attention
        if (requiresAttention) {
            await this.escalateToNurse(enrollmentId, result.rows[0], messageContent);
        }

        // Send appropriate auto-response
        await this.sendAutoResponse(lineUserId, messageContent, sentiment);

        console.log(`✅ [FollowUp] Response processed from ${lineUserId}`);
        return result.rows[0];
    }

    /**
     * Simple sentiment analysis (can be replaced with AI service)
     */
    analyzeSentiment(text) {
        const positiveWords = ['ดี', 'สบายดี', 'ดีขึ้น', 'good', 'great', 'better', '😊', '😄', '👍'];
        const negativeWords = ['แย่', 'ไม่สบาย', 'ปวด', 'bad', 'worst', 'pain', '😔', '😢', '😟'];

        let score = 0;
        const lowerText = text.toLowerCase();

        positiveWords.forEach(word => {
            if (lowerText.includes(word)) score += 0.2;
        });

        negativeWords.forEach(word => {
            if (lowerText.includes(word)) score -= 0.2;
        });

        // Clamp to -1 to 1
        score = Math.max(-1, Math.min(1, score));

        let label = 'neutral';
        if (score > 0.3) label = 'positive';
        if (score < -0.3) label = 'negative';

        return { score, label };
    }

    /**
     * Send automated response based on patient message
     */
    async sendAutoResponse(lineUserId, messageContent, sentiment) {
        let responseText = '';

        // Check for button responses
        if (messageContent.includes('mood_good') || messageContent.includes('สบายดี')) {
            responseText = 'ดีใจด้วยนะคะ! ขอให้สุขภาพแข็งแรงทุกวันค่ะ 💚';
        } else if (messageContent.includes('mood_bad') || messageContent.includes('ไม่สบาย')) {
            responseText = 'เสียใจด้วยนะคะ มีอะไรให้ฮันนาช่วยบอกได้เลยนะคะ 🩺';
        } else if (messageContent.includes('meds_taken') || messageContent.includes('กินแล้ว')) {
            responseText = 'เก่งมากค่ะ! การกินยาสม่ำเสมอสำคัญมากนะคะ ✅';
        } else if (messageContent.includes('meds_missed') || messageContent.includes('ลืม')) {
            responseText = 'ไม่เป็นไรค่ะ อย่าลืมกินยานะคะ การกินยาตรงเวลาช่วยให้อาการดีขึ้นค่ะ 💊';
        } else if (messageContent.includes('side_effects') || messageContent.includes('ผลข้างเคียง')) {
            responseText = 'เข้าใจแล้วค่ะ ฮันนาจะแจ้งพยาบาลให้ติดต่อคุณนะคะ รอสักครู่นะคะ ⚠️';
            // Trigger nurse escalation
            await this.escalateToNurse(null, null, messageContent, lineUserId);
        } else if (sentiment.label === 'negative') {
            responseText = 'ฮันนาเป็นห่วงคุณนะคะ หากอาการไม่ดีขึ้น ควรพบแพทย์นะคะ 🏥';
        } else {
            responseText = 'ขอบคุณที่แจ้งนะคะ ฮันนาจะติดตามอาการต่อไปค่ะ 💚';
        }

        if (responseText) {
            await line.pushMessage(lineUserId, {
                type: 'text',
                text: responseText
            });
        }
    }

    /**
     * Escalate concerning response to nurse
     */
    async escalateToNurse(enrollmentId, response, messageContent, lineUserId = null) {
        // Get enrollment details if not provided
        let enrollment;
        if (enrollmentId) {
            enrollment = await this.getEnrollment(enrollmentId);
        } else if (lineUserId) {
            const result = await db.query(
                `SELECT id FROM followup_enrollments WHERE line_user_id = $1`,
                [lineUserId]
            );
            if (result.rows.length > 0) {
                enrollment = await this.getEnrollment(result.rows[0].id);
            }
        }

        if (!enrollment) {
            console.warn('⚠️ [FollowUp] Cannot escalate - enrollment not found');
            return;
        }

        // Create nurse task
        await db.query(
            `INSERT INTO nurse_tasks (
                patient_id, task_type, priority, reason, title, description, status
            ) VALUES (
                (SELECT id FROM chronic_patients WHERE line_user_id = $1),
                'followup_escalation',
                'high',
                $2,
                $3,
                $4,
                'pending'
            )`,
            [
                enrollment.line_user_id,
                `Patient response requires attention: ${messageContent}`,
                `Follow-up: ${enrollment.patient_name}`,
                `Patient (${enrollment.patient_name}) responded with concerning message: "${messageContent}"\n\nEnrollment ID: ${enrollment.id}\nDay: ${enrollment.current_day}`
            ]
        );

        // Update response record
        if (response && response.id) {
            await db.query(
                `UPDATE patient_responses 
                 SET escalated_to_nurse = TRUE, escalated_at = NOW()
                 WHERE id = $1`,
                [response.id]
            );
        }

        console.log(`🚨 [FollowUp] Escalated to nurse: ${enrollment.patient_name}`);
    }

    /**
     * Get enrollment by ID
     */
    async getEnrollment(enrollmentId) {
        const result = await db.query(
            `SELECT * FROM followup_enrollments WHERE id = $1`,
            [enrollmentId]
        );
        return result.rows[0];
    }

    /**
     * Get message template for a specific day and language
     */
    async getTemplate(dayNumber, language = 'th') {
        const result = await db.query(
            `SELECT * FROM followup_templates 
             WHERE day_number = $1 AND language = $2 AND is_active = TRUE
             ORDER BY is_default DESC
             LIMIT 1`,
            [dayNumber, language]
        );
        return result.rows[0];
    }

    /**
     * Personalize message template with patient data
     */
    personalizeMessage(template, enrollment) {
        let message = template;

        const replacements = {
            '{{patient_name}}': enrollment.patient_name || 'คุณ',
            '{{clinician_name}}': enrollment.clinician_id || 'หมอ',
            '{{patient_hn}}': enrollment.patient_hn || '',
            '{{day_number}}': enrollment.current_day?.toString() || '1'
        };

        Object.entries(replacements).forEach(([placeholder, value]) => {
            message = message.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
        });

        return message;
    }

    /**
     * Get follow-up statistics for a clinician
     */
    async getClinicianStats(clinicianId) {
        const result = await db.query(
            `SELECT 
                COUNT(*) as total_enrollments,
                COUNT(*) FILTER (WHERE status = 'active') as active_enrollments,
                COUNT(*) FILTER (WHERE status = 'completed') as completed_enrollments,
                COUNT(*) FILTER (WHERE line_linked = TRUE) as line_linked,
                AVG(messages_sent) as avg_messages_sent,
                AVG(messages_responded) as avg_messages_responded,
                ROUND(AVG(messages_responded::numeric / NULLIF(messages_sent, 0)) * 100, 2) as response_rate
             FROM followup_enrollments
             WHERE clinician_id = $1`,
            [clinicianId]
        );

        return result.rows[0];
    }

    /**
     * Get active enrollments for a clinician
     */
    async getClinicianEnrollments(clinicianId, status = 'active') {
        const result = await db.query(
            `SELECT * FROM followup_enrollments 
             WHERE clinician_id = $1 AND status = $2
             ORDER BY enrolled_at DESC`,
            [clinicianId, status]
        );

        return result.rows;
    }

    /**
     * Complete an enrollment (patient finished program)
     */
    async completeEnrollment(enrollmentId) {
        await db.query(
            `UPDATE followup_enrollments 
             SET status = 'completed', completed_at = NOW()
             WHERE id = $1`,
            [enrollmentId]
        );

        // Send completion message
        const enrollment = await this.getEnrollment(enrollmentId);
        if (enrollment && enrollment.line_user_id) {
            await line.pushMessage(enrollment.line_user_id, {
                type: 'text',
                text: `ยินดีด้วยค่ะ ${enrollment.patient_name}! 🎉\n\nคุณสำเร็จโปรแกรมติดตามอาการ 14 วันแล้ว\n\nอย่าลืมดูแลสุขภาพต่อเนื่องนะคะ ฮันนาเป็นห่วงเสมอค่ะ 💚`
            });
        }

        console.log(`✅ [FollowUp] Enrollment completed: ${enrollmentId}`);
    }

    /**
     * Opt-out a patient from follow-up
     */
    async optOut(enrollmentId, reason = 'Patient requested') {
        await db.query(
            `UPDATE followup_enrollments 
             SET status = 'opted_out', updated_at = NOW()
             WHERE id = $1`,
            [enrollmentId]
        );

        // Cancel pending messages
        await db.query(
            `UPDATE followup_messages 
             SET delivery_status = 'cancelled'
             WHERE enrollment_id = $1 AND delivery_status = 'pending'`,
            [enrollmentId]
        );

        console.log(`✅ [FollowUp] Patient opted out: ${enrollmentId} (${reason})`);
    }
}

module.exports = new FollowUpService();
