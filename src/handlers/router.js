const onboarding = require('./onboarding');
const payment = require('./payment');
const db = require('../services/db');
const line = require('../services/line');
const { logCheckIn, logMedication, getHealthSummary } = require('./healthData');

const handleFollow = async (event) => {
    const userId = event.source.userId;
    try {
        // Create user if not exists
        await db.query(
            `INSERT INTO chronic_patients (line_user_id, enrollment_status, onboarding_step) 
         VALUES ($1, 'onboarding', 0) 
         ON CONFLICT (line_user_id) DO UPDATE SET enrollment_status = 'onboarding', onboarding_step = 0`,
            [userId]
        );
        return onboarding.start(event);
    } catch (error) {
        console.error('❌ Database Error in handleFollow:', error);
        // Still try to send welcome message even if DB fails? 
        // Maybe better to let them know something is wrong or just fail silently but log it.
        // For now, let's just log it so we don't crash the whole process if possible, 
        // but rethrowing might be better for Railway to restart.
        // Let's reply with a generic error so the user isn't left hanging.
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขออภัยค่ะ ระบบขัดข้องชั่วคราว กรุณาลองใหม่ภายหลังนะคะ 😓'
        });
    }
};

const handleMessage = async (event) => {
    const userId = event.source.userId;
    let user;
    try {
        const userResult = await db.query('SELECT * FROM chronic_patients WHERE line_user_id = $1', [userId]);
        user = userResult.rows[0];
    } catch (error) {
        console.error('❌ Database Error in handleMessage:', error);
        // Send error message to user instead of crashing
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขออภัยค่ะ ระบบฐานข้อมูลขัดข้องชั่วคราว กรุณาลองใหม่ภายหลังนะคะ 😓\n\nหากปัญหายังคงอยู่ กรุณาติดต่อทีมงานค่ะ'
        });
    }

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

    // Handle Rich Menu commands
    if (event.message.type === 'text') {
        const text = event.message.text.trim();

        // Health Check
        if (text === 'เช็คสุขภาพ') {
            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: `สวัสดีค่ะคุณ${user.name}! 💚\n\nวันนี้รู้สึกอย่างไรบ้างคะ?`,
                quickReply: {
                    items: [
                        { type: 'action', action: { type: 'message', label: 'สบายดี 😊', text: 'สบายดี' } },
                        { type: 'action', action: { type: 'message', label: 'ไม่ค่อยสบาย 😔', text: 'ไม่สบาย' } }
                    ]
                }
            });
        }

        // Log health responses
        if (text === 'สบายดี' || text === 'good') {
            await logCheckIn(userId, 'good');
            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: 'ดีใจด้วยนะคะ! ขอให้วันนี้เป็นวันที่ดีต่อไปนะคะ 💚'
            });
        }

        if (text === 'ไม่สบาย' || text === 'bad') {
            await logCheckIn(userId, 'bad', 'ไม่สบาย');
            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: 'เสียใจด้วยนะคะ ดูแลสุขภาพให้ดีๆ นะคะ หากอาการไม่ดีขึ้น ควรพบแพทย์ค่ะ 🩺'
            });
        }

        // Medication Log
        if (text === 'บันทึกกินยา') {
            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: `💊 บันทึกการกินยา\n\nวันนี้กินยาครบแล้วหรือยังคะ?`,
                quickReply: {
                    items: [
                        { type: 'action', action: { type: 'message', label: 'กินแล้ว ✅', text: 'กินยาแล้ว' } },
                        { type: 'action', action: { type: 'message', label: 'ยังไม่กิน', text: 'ยังไม่ได้กินยา' } }
                    ]
                }
            });
        }

        // Log medication responses
        if (text === 'กินยาแล้ว') {
            await logMedication(userId, true);
            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: 'เก่งมากค่ะ! ✅ บันทึกเรียบร้อยแล้ว การกินยาสม่ำเสมอช่วยให้สุขภาพดีขึ้นนะคะ 💊'
            });
        }

        if (text === 'ยังไม่ได้กินยา') {
            await logMedication(userId, false, 'ยังไม่กิน');
            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: 'อย่าลืมกินยาให้ตรงเวลานะคะ 💊 หากมีปัญหาเรื่องยา สามารถปรึกษาฮันนาได้เสมอค่ะ'
            });
        }

        // Profile with health summary
        if (text === 'โปรไฟล์ของฉัน') {
            const status = user.enrollment_status === 'trial' ? 'ทดลองใช้ฟรี' :
                user.enrollment_status === 'active' ? 'สมาชิกปกติ' : 'หมดอายุ';

            // Get 7-day summary
            const summary = await getHealthSummary(userId, 7);

            let summaryText = '';
            if (summary && summary.totalCheckIns > 0) {
                summaryText = `\n\n📊 สรุป 7 วันที่ผ่านมา:\n` +
                    `✅ เช็คอิน: ${summary.totalCheckIns} ครั้ง\n` +
                    `💊 กินยา: ${summary.medicationsTaken}/${summary.medicationsTaken + summary.medicationsMissed} ครั้ง (${summary.adherencePercent}%)\n` +
                    `😊 รู้สึกดี: ${summary.goodMoodDays} วัน`;
            }

            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: `👤 โปรไฟล์ของคุณ${user.name}\n\n` +
                    `อายุ: ${user.age} ปี\n` +
                    `ประเภท: ${user.condition || 'ไม่ระบุ'}\n` +
                    `สถานะ: ${status}` +
                    summaryText +
                    `\n\nหากต้องการแก้ไขข้อมูล กรุณาติดต่อฮันนาค่ะ`
            });
        }

        // Default response
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
