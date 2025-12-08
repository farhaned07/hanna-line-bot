const cron = require('node-cron');
const db = require('./services/db');
const line = require('./services/line');
const { checkTrialStatus } = require('./handlers/trial');

// H10 FIX: Retry logic for LINE API calls
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Send message with retry logic
 * @param {string} userId - LINE user ID
 * @param {object} message - Message to send
 * @param {number} attempt - Current attempt number
 */
const sendWithRetry = async (userId, message, attempt = 1) => {
    try {
        await line.pushMessage(userId, message);
        return true;
    } catch (error) {
        if (attempt < MAX_RETRIES) {
            console.warn(`⚠️ Retry ${attempt}/${MAX_RETRIES} for user ${userId}:`, error.message);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
            return sendWithRetry(userId, message, attempt + 1);
        } else {
            console.error(`❌ Failed to send message to ${userId} after ${MAX_RETRIES} attempts:`, error.message);
            return false;
        }
    }
};

const initScheduler = () => {
    console.log('Scheduler initialized');

    // Morning Check-in (8:00 AM)
    cron.schedule('0 8 * * *', async () => {
        console.log('Running morning check-in...');

        // First, check trial status and send reminders
        await checkTrialStatus();

        try {
            const result = await db.query(
                "SELECT line_user_id, name FROM chronic_patients WHERE enrollment_status IN ('active', 'trial')"
            );

            let successCount = 0;
            let failCount = 0;

            for (const user of result.rows) {
                const success = await sendWithRetry(user.line_user_id, {
                    type: 'text',
                    text: `สวัสดีตอนเช้าค่ะ คุณ${user.name || ''} ☀️\nได้เวลาวัดน้ำตาลแล้วนะคะ วันนี้ได้ค่าเท่าไหร่ บอกฮันนาหน่อยนะคะ`
                });

                if (success) successCount++;
                else failCount++;
            }

            console.log(`✅ Morning check-in complete: ${successCount} sent, ${failCount} failed`);
        } catch (err) {
            console.error('Error in morning job:', err);
        }
    }, {
        timezone: "Asia/Bangkok"
    });

    // Evening Medication Reminder (7:00 PM)
    cron.schedule('0 19 * * *', async () => {
        console.log('Running evening medication job');

        try {
            const result = await db.query(
                "SELECT line_user_id, name FROM chronic_patients WHERE enrollment_status IN ('active', 'trial')"
            );

            let successCount = 0;
            let failCount = 0;

            for (const user of result.rows) {
                const success = await sendWithRetry(user.line_user_id, {
                    type: 'text',
                    text: `🔔 ได้เวลากินยาตอนเย็นแล้วนะคะ คุณ${user.name || ''}\nกินแล้วกดปุ่มบอกฮันนาด้วยนะคะ`,
                    quickReply: {
                        items: [
                            { type: 'action', action: { type: 'message', label: 'กินแล้ว ✅', text: 'กินยาแล้วค่ะ' } },
                            { type: 'action', action: { type: 'message', label: 'ยังค่ะ ⏰', text: 'ยังไม่ได้กินค่ะ' } }
                        ]
                    }
                });

                if (success) successCount++;
                else failCount++;
            }

            console.log(`✅ Evening reminder complete: ${successCount} sent, ${failCount} failed`);
        } catch (err) {
            console.error('Error in evening job:', err);
        }
    }, {
        timezone: "Asia/Bangkok"
    });
};

module.exports = { initScheduler };
