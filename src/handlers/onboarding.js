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
                { type: 'text', text: 'ขอบคุณที่ไว้ใจฮันนานะคะ! 💚' },
                { type: 'text', text: '━━━━━━━━━━━━━━━━━━━\nขั้นตอนที่ 1/5\n●○○○○\n━━━━━━━━━━━━━━━━━━━' },
                { type: 'text', text: 'มาเริ่มทำความรู้จักกันค่อยนะคะ\nจะใช้เวลาแค่ 2-3 นาทีเท่านั้น 😊' },
                { type: 'text', text: 'ฮันนาจะเรียกคุณว่าอะไรดีคะ?\n\nบอกชื่อเล่น หรือ ชื่อที่อยากให้ฮันนาเรียกมาได้เลยนะคะ' }
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
        await line.replyMessage(event.replyToken, [
            {
                type: 'text',
                text: `ยินดีที่ได้รู้จักนะคะ คุณ${input}! 😊\nชื่อน่ารักมากเลยค่ะ`
            },
            {
                type: 'text',
                text: '━━━━━━━━━━━━━━━━━━━\nขั้นตอนที่ 2/5\n●●○○○\n━━━━━━━━━━━━━━━━━━━'
            },
            {
                type: 'text',
                text: 'คุณ' + input + 'อายุเท่าไหร่คะ?\n(เพื่อให้ฮันนาดูแลได้เหมาะสมกับวัย)',
                quickReply: {
                    items: [
                        { type: 'action', action: { type: 'postback', label: 'ต่ำกว่า 50', data: 'value=<50' } },
                        { type: 'action', action: { type: 'postback', label: '50-60', data: 'value=50-60' } },
                        { type: 'action', action: { type: 'postback', label: '61-70', data: 'value=61-70' } },
                        { type: 'action', action: { type: 'postback', label: '71-80', data: 'value=71-80' } },
                        { type: 'action', action: { type: 'postback', label: '81 ขึ้นไป', data: 'value=81+' } }
                    ]
                }
            }
        ]);
    } else if (step === 2) {
        // Age range received (now accepts range strings like "61-70")
        await db.query('UPDATE chronic_patients SET age = $1, onboarding_step = 3 WHERE line_user_id = $2', [input, userId]);
        await line.replyMessage(event.replyToken, [
            {
                type: 'text',
                text: `ขอบคุณค่ะ คุณ${user.name} 😊`
            },
            {
                type: 'text',
                text: '━━━━━━━━━━━━━━━━━━━\nขั้นตอนที่ 3/5\n●●●○○\n━━━━━━━━━━━━━━━━━━━'
            },
            {
                type: 'text',
                text: `คุณ${user.name}มีภาวะสุขภาพอะไรบ้างคะ? 🏥`
            },
            {
                type: 'flex',
                altText: 'เลือกประเภทเบาหวาน',
                contents: {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            { type: 'text', text: 'คุณหมอวินิจฉัยว่าเป็น', size: 'sm', color: '#999999' },
                            { type: 'text', text: 'เบาหวานชนิดไหน? 🏥', weight: 'bold', size: 'lg', margin: 'xs' },
                            { type: 'separator', margin: 'md' },
                            {
                                type: 'box',
                                layout: 'vertical',
                                margin: 'md',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                            { type: 'text', text: 'Type 1 (ฉีดอินซูลิน)', weight: 'bold', size: 'sm', color: '#1E90FF' },
                                            { type: 'text', text: 'ร่างกายไม่ผลิตอินซูลิน', size: 'xs', color: '#999999', wrap: true }
                                        ],
                                        action: { type: 'postback', data: 'value=Type 1', displayText: 'Type 1 (ฉีดอินซูลิน)' },
                                        paddingAll: 'sm',
                                        backgroundColor: '#F0F8FF',
                                        cornerRadius: 'md'
                                    },
                                    {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                            { type: 'text', text: 'Type 2 (ทั่วไป)', weight: 'bold', size: 'sm', color: '#32CD32' },
                                            { type: 'text', text: 'ควบคุมด้วยยาและอาหาร', size: 'xs', color: '#999999', wrap: true }
                                        ],
                                        action: { type: 'postback', data: 'value=Type 2', displayText: 'Type 2 (ทั่วไป)' },
                                        paddingAll: 'sm',
                                        backgroundColor: '#F0FFF0',
                                        cornerRadius: 'md'
                                    },
                                    {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                            { type: 'text', text: 'ยังไม่แน่ใจ', weight: 'bold', size: 'sm', color: '#999999' },
                                            { type: 'text', text: 'ไม่ทราบประเภทที่ชัดเจน', size: 'xs', color: '#999999', wrap: true }
                                        ],
                                        action: { type: 'postback', data: 'value=Unknown', displayText: 'ยังไม่แน่ใจ' },
                                        paddingAll: 'sm',
                                        backgroundColor: '#F5F5F5',
                                        cornerRadius: 'md'
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ]);
    } else if (step === 3) {
        // Condition received
        await db.query('UPDATE chronic_patients SET condition = $1, onboarding_step = 4 WHERE line_user_id = $2', [input, userId]);
        await line.replyMessage(event.replyToken, [
            {
                type: 'text',
                text: `เข้าใจแล้วค่ะ คุณ${user.name}\nฮันนาจะดูแลเรื่อง ${input} ให้ดีที่สุดนะคะ 💚`
            },
            {
                type: 'text',
                text: '━━━━━━━━━━━━━━━━━━━\nขั้นตอนที่ 4/5\n●●●●○\n━━━━━━━━━━━━━━━━━━━'
            },
            {
                type: 'text',
                text: `ปกติคุณ${user.name} **วัดระดับน้ำตาล** บ่อยแค่ไหนคะ? 🩸`,
                quickReply: {
                    items: [
                        { type: 'action', action: { type: 'postback', label: 'ทุกวัน', data: 'value=Daily' } },
                        { type: 'action', action: { type: 'postback', label: 'อาทิตย์ละครั้ง', data: 'value=Weekly' } },
                        { type: 'action', action: { type: 'postback', label: 'นานๆ ครั้ง', data: 'value=Rarely' } }
                    ]
                }
            }
        ]);
    } else if (step === 4) {
        // Habit received
        // Offer Trial
        await db.query('UPDATE chronic_patients SET onboarding_step = 5 WHERE line_user_id = $1', [userId]);

        await line.replyMessage(event.replyToken, [
            {
                type: 'text',
                text: '━━━━━━━━━━━━━━━━━━━\nขั้นตอนที่ 5/5 - ขั้นตอนสุดท้าย!\n●●●●●\n━━━━━━━━━━━━━━━━━━━'
            },
            {
                type: 'text',
                text: `เรียบร้อยแล้วค่ะ คุณ${user.name}! 🎉\n\nฮันนาพร้อมดูแลสุขภาพคุณแล้วค่ะ`
            },
            {
                // Flex Message for Trial Offer
                type: 'flex',
                altText: '🎁 ทดลองใช้ฟรี 14 วัน',
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
                            { type: 'text', text: '🎁 ทดลองใช้ฟรี 14 วัน', weight: 'bold', size: 'xl', color: '#1DB446' },
                            { type: 'text', text: 'ไม่ต้องใส่บัตร ไม่มีค่าใช้จ่าย', margin: 'sm', size: 'sm', color: '#999999' },
                            { type: 'separator', margin: 'md' },
                            { type: 'text', text: 'คุณจะได้รับ:', weight: 'bold', margin: 'md' },
                            { type: 'text', text: '✅ ฮันนาเช็คสุขภาพทุกเช้า', size: 'sm', color: '#666666', margin: 'sm' },
                            { type: 'text', text: '✅ เตือนกินยาตรงเวลา', size: 'sm', color: '#666666', margin: 'sm' },
                            { type: 'text', text: '✅ คุยด้วยเสียงได้ตลอด (Gemini Live)', size: 'sm', color: '#666666', margin: 'sm' },
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
            }
        ]);
    }
};

module.exports = { start, handleInput };
