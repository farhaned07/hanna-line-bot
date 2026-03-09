const followupService = require('./followup');
const db = require('./db');

/**
 * Follow-up Scheduler
 * 
 * Runs hourly to send scheduled follow-up messages
 * Called by main scheduler.js
 */

/**
 * Run follow-up message scheduler
 * Sends all pending messages that are due
 */
const runFollowupScheduler = async () => {
    try {
        console.log('📅 [FollowUp Scheduler] Running scheduled message delivery...');

        const result = await followupService.sendPendingMessages();

        console.log(`📊 [FollowUp Scheduler] Complete: ${result.sentCount} sent, ${result.failedCount} failed`);
        return result;
    } catch (err) {
        console.error('❌ [FollowUp Scheduler] Error:', err.message);
        throw err;
    }
};

/**
 * Check for enrollments that need Day 1 message sent manually
 * (e.g., patients who enrolled but message failed)
 */
const checkPendingDay1Messages = async () => {
    try {
        const result = await db.query(
            `SELECT fe.id, fe.patient_name, fe.line_user_id
             FROM followup_enrollments fe
             LEFT JOIN followup_messages fm ON fe.id = fm.enrollment_id 
                 AND fm.message_day = 1
             WHERE fe.enrolled_at > NOW() - INTERVAL '24 hours'
             AND fm.id IS NULL
             AND fe.status = 'active'`
        );

        for (const enrollment of result.rows) {
            console.log(`📅 [FollowUp] Sending delayed Day 1 message to ${enrollment.patient_name}`);
            await followupService.scheduleMessage(enrollment.id, 1);
        }

        if (result.rows.length > 0) {
            console.log(`✅ [FollowUp] Sent ${result.rows.length} delayed Day 1 messages`);
        }
    } catch (err) {
        console.error('❌ [FollowUp] Check pending Day 1 error:', err.message);
    }
};

/**
 * Get follow-up program statistics
 */
const getProgramStats = async () => {
    try {
        const stats = await db.query(`
            SELECT 
                COUNT(*) as total_enrollments,
                COUNT(*) FILTER (WHERE status = 'active') as active_enrollments,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'opted_out') as opted_out,
                COUNT(*) FILTER (WHERE line_linked = TRUE) as line_linked,
                AVG(CASE WHEN messages_sent > 0 THEN messages_responded::float / messages_sent END) as avg_response_rate,
                COUNT(DISTINCT clinician_id) as participating_clinicians
            FROM followup_enrollments
        `);

        return stats.rows[0];
    } catch (err) {
        console.error('❌ [FollowUp] Get stats error:', err.message);
        return null;
    }
};

module.exports = {
    runFollowupScheduler,
    checkPendingDay1Messages,
    getProgramStats
};
