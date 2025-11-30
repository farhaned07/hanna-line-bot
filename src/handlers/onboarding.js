const db = require('../services/db');
const line = require('../services/line');

const start = async (event) => {
    const userId = event.source.userId;
    await line.replyMessage(event.replyToken, [
        {
            type: 'text',
            text: '✨ สวัสดีค่ะ! ฉันชื่อฮันนา พยาบาล AI ที่จะช่วยดูแลคุณทุกวัน 💚'
        },
        {
            type: 'text',
            text: 'เพื่อเริ่มดูแลคุณ ฮันนาขอทราบชื่อเล่นหน่อยนะคะ 😊'
        }
    ]);
    await db.query('UPDATE chronic_patients SET onboarding_step = 1 WHERE line_user_id = $1', [userId]);
};

const handleInput = async (event, user) => {
    const userId = user.line_user_id;
    const step = user.onboarding_step;
    let input = '';

    if (event.type === 'message' && event.message.type === 'text') {
        input = event.message.text;
    } else if (event.type === 'postback') {
        const data = new URLSearchParams(event.postback.data);
        input = data.get('value');
    }

    if (step === 1) {
        // Name received
        await db.query('UPDATE chronic_patients SET name = $1, onboarding_step = 2 WHERE line_user_id = $2', [input, userId]);
        await line.replyMessage(event.replyToken, {
            type: 'text',
            text: `ยินดีที่ได้รู้จักนะคะ คุณ${input}! \nอายุเท่าไหร่คะ?`
        });
    } else if (step === 2) {
        // Age received
        const age = parseInt(input);
        if (isNaN(age)) {
            return line.replyMessage(event.replyToken, { type: 'text', text: 'กรุณาระบุอายุเป็นตัวเลขนะคะ' });
        }
        await db.query('UPDATE chronic_patients SET age = $1, onboarding_step = 3 WHERE line_user_id = $2', [age, userId]);
        await line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'คุณเป็นเบาหวานชนิดไหนคะ?',
            quickReply: {
                items: [
                    { type: 'action', action: { type: 'postback', label: 'Type 1', data: 'value=Type 1' } },
                    { type: 'action', action: { type: 'postback', label: 'Type 2', data: 'value=Type 2' } },
                    { type: 'action', action: { type: 'postback', label: 'ยังไม่แน่ใจ', data: 'value=Unknown' } }
                ]
            }
        });
    } else if (step === 3) {
        // Condition received
        await db.query('UPDATE chronic_patients SET condition = $1, onboarding_step = 4 WHERE line_user_id = $2', [input, userId]);
        await line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ปกติวัดน้ำตาลบ่อยแค่ไหนคะ?',
            quickReply: {
                items: [
                    { type: 'action', action: { type: 'postback', label: 'ทุกวัน', data: 'value=Daily' } },
                    { type: 'action', action: { type: 'postback', label: 'อาทิตย์ละครั้ง', data: 'value=Weekly' } },
                    { type: 'action', action: { type: 'postback', label: 'นานๆ ครั้ง', data: 'value=Rarely' } }
                ]
            }
        });
    } else if (step === 4) {
        // Habit received
        // Offer Trial
        await db.query('UPDATE chronic_patients SET onboarding_step = 5 WHERE line_user_id = $1', [userId]);

        // Flex Message for Trial Offer
        const flexMessage = {
            type: 'flex',
            altText: 'ทดลองใช้ฟรี 14 วัน',
            contents: {
                type: 'bubble',
                hero: {
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Placeholder medical image
                    size: 'full',
                    aspectRatio: '20:13',
                    aspectMode: 'cover'
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        { type: 'text', text: 'ทดลองใช้ฟรี 14 วัน', weight: 'bold', size: 'xl' },
                        { type: 'text', text: 'ให้ฮันนาช่วยดูแลคุณตั้งแต่วันนี้', margin: 'md' },
                        { type: 'text', text: '• โทรเช็คสุขภาพทุกเช้า', size: 'sm', color: '#666666', margin: 'sm' },
                        { type: 'text', text: '• เตือนกินยาไม่ให้พลาด', size: 'sm', color: '#666666' },
                        { type: 'text', text: '• สรุปสุขภาพให้ลูกหลาน', size: 'sm', color: '#666666' }
                    ]
                },
                footer: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'button',
                            style: 'primary',
                            color: '#06C755',
                            action: { type: 'postback', label: 'เริ่มทดลองใช้ฟรี! 🎉', data: 'action=select_plan&plan=trial' }
                        },
                        {
                            type: 'button',
                            action: { type: 'postback', label: 'ดูแพ็คเกจรายเดือน', data: 'action=select_plan&plan=monthly' },
                            margin: 'sm'
                        }
                    ]
                }
            }
        };

        await line.replyMessage(event.replyToken, flexMessage);
    }
};

module.exports = { start, handleInput };
