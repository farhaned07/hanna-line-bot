const cron = require('node-cron');
const db = require('./services/db');
const line = require('./services/line');
const { checkTrialStatus } = require('./handlers/trial');

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

            for (const user of result.rows) {
                await line.pushMessage(user.line_user_id, {
                    type: 'text',
                    text: `สวัสดีตอนเช้าค่ะ คุณ${user.name || ''} ☀️\nได้เวลาวัดน้ำตาลแล้วนะคะ วันนี้ได้ค่าเท่าไหร่ บอกฮันนาหน่อยนะคะ`
                });
            }
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

            for (const user of result.rows) {
                await line.pushMessage(user.line_user_id, {
                    type: 'text',
                    text: `🔔 ได้เวลากินยาตอนเย็นแล้วนะคะ คุณ${user.name || ''}\nกินแล้วกดปุ่มบอกฮันนาด้วยนะคะ`,
                    quickReply: {
                        items: [
                            { type: 'action', action: { type: 'message', label: 'กินแล้ว ✅', text: 'กินยาแล้วค่ะ' } },
                            { type: 'action', action: { type: 'message', label: 'ยังค่ะ ⏰', text: 'ยังไม่ได้กินค่ะ' } }
                        ]
                    }
                });
            }
        } catch (err) {
            console.error('Error in evening job:', err);
        }
    }, {
        timezone: "Asia/Bangkok"
    });
};

module.exports = { initScheduler };
