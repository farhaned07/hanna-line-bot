const onboarding = require('./onboarding');
const payment = require('./payment');
const db = require('../services/db');
const line = require('../services/line');

const handleFollow = async (event) => {
    const userId = event.source.userId;
    // Create user if not exists
    await db.query(
        `INSERT INTO chronic_patients (line_user_id, enrollment_status, onboarding_step) 
     VALUES ($1, 'onboarding', 0) 
     ON CONFLICT (line_user_id) DO UPDATE SET enrollment_status = 'onboarding', onboarding_step = 0`,
        [userId]
    );
    return onboarding.start(event);
};

const handleMessage = async (event) => {
    const userId = event.source.userId;
    const userResult = await db.query('SELECT * FROM chronic_patients WHERE line_user_id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
        // Should not happen if followed, but handle edge case
        return handleFollow(event);
    }

    if (user.enrollment_status === 'onboarding') {
        return onboarding.handleInput(event, user);
    }

    // Handle expired trial users
    if (user.enrollment_status === 'expired') {
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: `สวัสดีค่ะคุณ${user.name}! 💚\n\nช่วงทดลองใช้ของคุณหมดอายุแล้วค่ะ หากต้องการใช้บริการต่อ พิมพ์ "สมัคร" เพื่อดูแพ็คเกจนะคะ 😊`,
            quickReply: {
                items: [
                    { type: 'action', action: { type: 'postback', label: 'สมัครแพ็คเกจ 💳', data: 'action=select_plan&plan=monthly' } }
                ]
            }
        });
    }

    // Handle other messages (e.g. daily check-in responses)
    // For MVP, just echo or simple response if not in onboarding
    if (event.message.type === 'text') {
        // TODO: Add check-in logic here
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขอบคุณค่ะ ฮันนาได้รับข้อความแล้ว 😊'
        });
    }

    return Promise.resolve(null);
};

const handlePostback = async (event) => {
    const userId = event.source.userId;
    const data = new URLSearchParams(event.postback.data);
    const action = data.get('action');

    const userResult = await db.query('SELECT * FROM chronic_patients WHERE line_user_id = $1', [userId]);
    const user = userResult.rows[0];

    if (action === 'select_plan') {
        return payment.handlePlanSelection(event, data.get('plan'));
    } else if (action === 'confirm_payment') {
        return payment.handlePaymentConfirmation(event);
    } else if (user && user.enrollment_status === 'onboarding') {
        return onboarding.handleInput(event, user);
    }

    return Promise.resolve(null);
};

module.exports = { handleFollow, handleMessage, handlePostback };
