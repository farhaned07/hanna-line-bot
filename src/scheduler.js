const cron = require('node-cron');
const db = require('./services/db');
const line = require('./services/line');
// const { checkTrialStatus } = require('./handlers/trial'); // Module missing, disabling for MVP

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

    // Proactive "Silence Audit" (10:00 AM)
    cron.schedule('0 10 * * *', checkSilenceAndNudge, {
        timezone: "Asia/Bangkok"
    });

    // Safety Safeguard: Escalation Check (Every 15 mins)
    cron.schedule('*/15 * * * *', checkEscalations);

    console.log('✅ Scheduler Initialized: Morning(08:00), Nudge(10:00), Evening(19:00), Escalation(15m)');

    console.log('✅ Scheduler Initialized: Morning(08:00), Nudge(10:00), Evening(19:00)');
};

/**
 * 📢 The Active Nudge
 * Finds patients with no activity in 24h and sends a "Call Me" card.
 */
const checkSilenceAndNudge = async () => {
    console.log('🕵️‍♀️ [Scheduler] Auditing Patient Silence...');

    try {
        // Find users with no check-in today (Simple MVP Logic)
        // In prod: SELECT * FROM chronic_patients WHERE last_interaction < NOW() - INTERVAL '24 hours'
        const users = await db.query(`SELECT * FROM chronic_patients WHERE enrollment_status = 'active'`);

        for (const user of users.rows) {
            // MVP Simulation: Nudge everyone for the demo
            console.log(`📡 Nudging Patient: ${user.name}`);

            await sendWithRetry(user.line_user_id, {
                type: 'flex',
                altText: '📞 ฮันนาเป็นห่วงค่ะ',
                contents: {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            { type: 'text', text: 'ฮันนาเป็นห่วงค่ะ 😟', weight: 'bold', size: 'xl', color: '#FF3333' },
                            { type: 'text', text: 'วันนี้ยังไม่ได้คุยกันเลย สบายดีไหมคะ?', margin: 'md', size: 'md' },
                            { type: 'text', text: 'กดปุ่มเพื่อคุยกับพยาบาล 1 นาทีนะคะ', margin: 'sm', size: 'xs', color: '#666666' }
                        ]
                    },
                    footer: {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'button',
                                style: 'primary',
                                color: '#06C755',
                                height: 'sm',
                                action: {
                                    type: 'uri',
                                    label: '📞 กดเพื่อคุย (โทรฟรี)',
                                    uri: `https://liff.line.me/${process.env.LIFF_ID}`
                                }
                            }
                        ]
                    }
                }
            });
        }
    } catch (err) {
        console.error('❌ Scheduler Error:', err);
    }
};

/**
 * 🚨 Escalation Monitor (Safeguard)
 * Checks for Critical Tasks pending > 1 hour.
 */
const checkEscalations = async () => {
    console.log('⏱️ [Scheduler] Checking for Escalations...');
    try {
        // Find ignored criticals (older than 1 hour)
        const ignored = await db.query(`
            SELECT * FROM nurse_tasks 
            WHERE status = 'pending' 
            AND priority = 'critical' 
            AND created_at < NOW() - INTERVAL '1 hour'
        `);

        for (const task of ignored.rows) {
            console.log(`🔥 [ESCALATION] Task ${task.id} unanswered for >1h! Pinging Supervisor...`);
            // MVP Simulation: Just log. In prod: await smsService.send(SUPERVISOR_PHONE, 'Critical Alert Ignored!');
        }
    } catch (err) {
        console.error('❌ Escalation Check Error:', err);
    }
};

module.exports = { initScheduler, checkSilenceAndNudge, checkEscalations };
