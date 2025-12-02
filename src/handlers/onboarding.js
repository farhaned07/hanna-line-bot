const db = require('../services/db');
const line = require('../services/line');

const start = async (event) => {
    const userId = event.source.userId;

    // Step 0: PDPA Consent
    const flexMessage = {
        type: 'flex',
        altText: '🔒 ขอความยินยอมข้อมูลส่วนบุคคล',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    { type: 'text', text: '🔒 ความเป็นส่วนตัวของคุณสำคัญ', weight: 'bold', size: 'lg', color: '#06C755' },
                    { type: 'text', text: 'เพื่อให้ฮันนาดูแลคุณได้อย่างเต็มที่ ฮันนาขออนุญาตเก็บรวบรวมข้อมูลสุขภาพของคุณตามนโยบายความเป็นส่วนตัวนะคะ', margin: 'md', wrap: true, size: 'sm' },
                    { type: 'separator', margin: 'md' },
                    { type: 'text', text: 'อ่านนโยบายความเป็นส่วนตัว', size: 'xs', color: '#007AFF', action: { type: 'uri', label: 'อ่านนโยบาย', uri: `https://${process.env.BASE_URL.replace(/^https?:\/\//, '')}/privacy.html` }, margin: 'sm', align: 'center' }
                ]
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    { type: 'button', style: 'primary', color: '#06C755', action: { type: 'postback', label: 'ยอมรับและเริ่มใช้งาน ✅', data: 'action=consent_pdpa&value=yes' } },
                    { type: 'button', action: { type: 'postback', label: 'ไม่ยอมรับ', data: 'action=consent_pdpa&value=no' }, margin: 'sm', height: 'sm', style: 'link', color: '#666666' }
                ]
            }
        }
    };

    await line.replyMessage(event.replyToken, flexMessage);
    // Set step to 0 (Consent)
    await db.query('UPDATE chronic_patients SET onboarding_step = 0 WHERE line_user_id = $1', [userId]);
};

const handleInput = async (event, user) => {
    const userId = user.line_user_id;
    const step = user.onboarding_step;
    let input = '';
    let action = '';

    if (event.type === 'message' && event.message.type === 'text') {
        input = event.message.text;
    } else if (event.type === 'postback') {
        const data = new URLSearchParams(event.postback.data);
        input = data.get('value');
        action = data.get('action');
    }

    console.log(`[Onboarding] User ${userId} at Step ${step}. Input: ${input}, Action: ${action}`);

    if (step === 0) {
        // Consent received
        if (action === 'consent_pdpa' && input === 'yes') {
            console.log(`[Onboarding] User ${userId} accepted consent. Moving to Step 1.`);
            await db.query('UPDATE chronic_patients SET consent_pdpa = TRUE, consent_date = NOW(), onboarding_step = 1 WHERE line_user_id = $1', [userId]);
            await line.replyMessage(event.replyToken, [
                { type: 'text', text: 'ขอบคุณที่ไว้ใจฮันนานะคะ 💚' },
                { type: 'text', text: '✨ สวัสดีค่ะ! ฮันนาเองนะคะ พยาบาลส่วนตัวของคุณ \nฮันนาพร้อมดูแลสุขภาพคุณให้ดีขึ้นทุกวันค่ะ' },
                { type: 'text', text: 'ก่อนอื่น... ฮันนาขอทราบ **ชื่อเล่น** ของคุณหน่อยนะคะ 😊' }
            ]);
        } else {
            // If user types text or declines, re-send consent card
            console.log(`[Onboarding] User ${userId} sent invalid input at Step 0. Re-sending consent.`);

            const flexMessage = {
                type: 'flex',
                altText: '🔒 ขอความยินยอมข้อมูลส่วนบุคคล',
                contents: {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            { type: 'text', text: '⚠️ กรุณากดยอมรับเพื่อดำเนินการต่อ', weight: 'bold', color: '#FF3333', size: 'sm', margin: 'md' },
                            { type: 'text', text: '🔒 ความเป็นส่วนตัวของคุณสำคัญ', weight: 'bold', size: 'lg', color: '#06C755', margin: 'sm' },
                            { type: 'text', text: 'เพื่อให้ฮันนาดูแลคุณได้อย่างเต็มที่ ฮันนาขออนุญาตเก็บรวบรวมข้อมูลสุขภาพของคุณตามนโยบายความเป็นส่วนตัวนะคะ', margin: 'md', wrap: true, size: 'sm' },
                            { type: 'separator', margin: 'md' },
                            { type: 'text', text: 'อ่านนโยบายความเป็นส่วนตัว', size: 'xs', color: '#007AFF', action: { type: 'uri', label: 'อ่านนโยบาย', uri: `https://${process.env.BASE_URL.replace(/^https?:\/\//, '')}/privacy.html` }, margin: 'sm', align: 'center' }
                        ]
                    },
                    footer: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            { type: 'button', style: 'primary', color: '#06C755', action: { type: 'postback', label: 'ยอมรับและเริ่มใช้งาน ✅', data: 'action=consent_pdpa&value=yes' } },
                            { type: 'button', action: { type: 'postback', label: 'ไม่ยอมรับ', data: 'action=consent_pdpa&value=no' }, margin: 'sm', height: 'sm', style: 'link', color: '#666666' }
                        ]
                    }
                }
            };

            await line.replyMessage(event.replyToken, flexMessage);
        }
    } else if (step === 1) {
        // Name received
        await db.query('UPDATE chronic_patients SET name = $1, onboarding_step = 2 WHERE line_user_id = $2', [input, userId]);
        await line.replyMessage(event.replyToken, {
            type: 'text',
            text: `ยินดีที่ได้รู้จักค่ะ คุณ${input}! 👋\n\nขออนุญาตถาม **อายุ** หน่อยนะคะ (เพื่อการดูแลที่เหมาะสมค่ะ) 👵`
        });
    } else if (step === 2) {
        // Age received
        const age = parseInt(input);
        if (isNaN(age)) {
            return line.replyMessage(event.replyToken, { type: 'text', text: 'ฮันนาขอตัวเลขล้วนๆ เลยนะคะ (เช่น 55) 😊' });
        }
        await db.query('UPDATE chronic_patients SET age = $1, onboarding_step = 3 WHERE line_user_id = $2', [age, userId]);
        await line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'คุณหมอวินิจฉัยว่าเป็น **เบาหวานชนิดไหน** คะ? 🏥',
            quickReply: {
                items: [
                    { type: 'action', action: { type: 'postback', label: 'Type 1 (ฉีดอินซูลิน)', data: 'value=Type 1' } },
                    { type: 'action', action: { type: 'postback', label: 'Type 2 (ทั่วไป)', data: 'value=Type 2' } },
                    { type: 'action', action: { type: 'postback', label: 'ยังไม่แน่ใจ', data: 'value=Unknown' } }
                ]
            }
        });
    } else if (step === 3) {
        // Condition received
        await db.query('UPDATE chronic_patients SET condition = $1, onboarding_step = 4 WHERE line_user_id = $2', [input, userId]);
        await line.replyMessage(event.replyToken, {
            type: 'text',
            text: `ปกติคุณ${user.name || 'คนเก่ง'} **วัดระดับน้ำตาล** บ่อยแค่ไหนคะ? 🩸`,
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
            altText: '🎁 ของขวัญต้อนรับจากฮันนา',
            contents: {
                type: 'bubble',
                hero: {
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                    size: 'full',
                    aspectRatio: '20:13',
                    aspectMode: 'cover'
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        { type: 'text', text: 'ทดลองใช้ฟรี 14 วัน', weight: 'bold', size: 'xl', color: '#1DB446' },
                        { type: 'text', text: 'ให้ฮันนาช่วยดูแลคุณตั้งแต่วันนี้', margin: 'md', weight: 'bold' },
                        { type: 'separator', margin: 'md' },
                        { type: 'text', text: '✅ โทรเช็คสุขภาพทุกเช้า', size: 'sm', color: '#666666', margin: 'md' },
                        { type: 'text', text: '✅ เตือนกินยาไม่ให้พลาด', size: 'sm', color: '#666666', margin: 'sm' },
                        { type: 'text', text: '✅ สรุปสุขภาพให้ลูกหลาน', size: 'sm', color: '#666666', margin: 'sm' }
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
                            margin: 'sm',
                            height: 'sm',
                            style: 'link'
                        }
                    ]
                }
            }
        };

        await line.replyMessage(event.replyToken, flexMessage);
    }
};

module.exports = { start, handleInput };
