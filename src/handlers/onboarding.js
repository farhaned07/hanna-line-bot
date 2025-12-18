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
                    { type: 'text', text: 'อ่านนโยบายความเป็นส่วนตัว', size: 'xs', color: '#007AFF', action: { type: 'uri', label: 'อ่านนโยบาย', uri: `https://${(process.env.BASE_URL || 'hanna-line-bot-production.up.railway.app').replace(/^https?:\/\//, '')}/privacy.html` }, margin: 'sm', align: 'center' }
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

    // --- Step 0: PDPA Consent ---
    if (step === 0) {
        if (action === 'consent_pdpa' && input === 'yes') {
            console.log(`[Onboarding] User ${userId} accepted consent. Moving to Step 1 (Identity Confirmation).`);
            // Update DB to Step 1
            await db.query('UPDATE chronic_patients SET consent_pdpa = TRUE, consent_date = NOW(), onboarding_step = 1 WHERE line_user_id = $1', [userId]);

            // Mock "Pre-filled" Data for Confirmation
            // In production, this would query an Insurer API using the LINE User ID (via phone match)
            // For Pilot, we simulate finding: Name="คุณสมดุล", DOB="01/01/1955", Condition="เบาหวาน Type 2"
            const mockName = "คุณสมดุล";

            await line.replyMessage(event.replyToken, [
                { type: 'text', text: 'ขอบคุณที่ไว้ใจฮันนานะคะ! 💚' },
                {
                    type: 'flex',
                    altText: '🔒 ยืนยันตัวตน',
                    contents: {
                        type: 'bubble',
                        body: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                { type: 'text', text: '🔒 ยืนยันตัวตน', weight: 'bold', size: 'xl', color: '#06C755' },
                                { type: 'separator', margin: 'md' },
                                { type: 'text', text: 'ฮันนาพบข้อมูลสิทธิ์ของคุณจากประกัน:', margin: 'md', size: 'sm', color: '#666666' },
                                { type: 'text', text: mockName, weight: 'bold', size: 'lg', margin: 'sm' },
                                { type: 'text', text: 'เกิดวันที่: 01 ม.ค. 2498', size: 'sm', margin: 'xs' },
                                { type: 'text', text: 'สิทธิ์การดูแล: เบาหวาน (Diabetes)', size: 'sm', margin: 'xs', color: '#007AFF' },
                                { type: 'separator', margin: 'md' },
                                { type: 'text', text: 'ข้อมูลนี้ถูกต้องใช่ไหมคะ?', margin: 'md', weight: 'bold', align: 'center' }
                            ]
                        },
                        footer: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                { type: 'button', style: 'primary', color: '#06C755', action: { type: 'postback', label: 'ใช่ ถูกต้อง ✅', data: 'action=confirm_identity&value=yes' } },
                                { type: 'button', action: { type: 'postback', label: 'ไม่ใช่ ไม่ใช่ฉัน', data: 'action=confirm_identity&value=no' }, margin: 'sm', height: 'sm', style: 'link', color: '#FF3333' }
                            ]
                        }
                    }
                }
            ]);
        } else {
            // Re-send Consent (Simulated same as before)
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
                            { type: 'text', text: 'อ่านนโยบายความเป็นส่วนตัว', size: 'xs', color: '#007AFF', action: { type: 'uri', label: 'อ่านนโยบาย', uri: `https://${(process.env.BASE_URL || 'hanna-line-bot-production.up.railway.app').replace(/^https?:\/\//, '')}/privacy.html` }, margin: 'sm', align: 'center' }
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

        // --- Step 1: Identity Confirmation (Pre-filled) ---
    } else if (step === 1) {
        if (action === 'confirm_identity' && input === 'yes') {
            // Finish Onboarding - Move to Active
            console.log(`[Onboarding] User ${userId} confirmed identity.`);

            // In a real app, we would copy the pre-filled data to the user record here.
            // For simplicity, we just set name/age hardcoded to match the mock above or generic.
            await db.query(`
                UPDATE chronic_patients 
                SET enrollment_status = 'active', onboarding_step = 2, 
                    name = 'คุณสมดุล', age = '70', condition = 'Diabetes Type 2'
                WHERE line_user_id = $1`, [userId]);

            await line.replyMessage(event.replyToken, [
                {
                    type: 'text',
                    text: '━━━━━━━━━━━━━━━━━━━\nยืนยันสิทธิ์เรียบร้อย ✅\n━━━━━━━━━━━━━━━━━━━'
                },
                {
                    type: 'flex',
                    altText: '✅ เริ่มใช้งาน',
                    contents: {
                        type: 'bubble',
                        body: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                { type: 'text', text: '🎉 ยินดีต้อนรับสู่ครอบครัวค่ะ!', weight: 'bold', size: 'xl', color: '#06C755' },
                                { type: 'text', text: 'ฮันนาจะคอยเป็นห่วงคุณแทนลูกหลานเองค่ะ 💚', margin: 'md', size: 'sm', color: '#666666' },
                                { type: 'separator', margin: 'md' },
                                { type: 'text', text: 'หลังจากนี้:', weight: 'bold', margin: 'md' },
                                { type: 'text', text: '1. ฮันนาจะทักหาทุกเช้า (08:00)', size: 'sm', margin: 'sm' },
                                { type: 'text', text: '2. ถ้ามีอาการ บอกฮันนาได้เสมอ', size: 'sm', margin: 'sm' },
                                { type: 'text', text: '3. คุณพยาบาลคอยดูแลอยู่ใกล้ๆ ค่ะ', size: 'sm', margin: 'sm' }
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
                                    action: { type: 'message', label: 'เริ่มเช็คสุขภาพครั้งแรก', text: 'เช็คสุขภาพ' }
                                }
                            ]
                        }
                    }
                }
            ]);

        } else if (action === 'confirm_identity' && input === 'no') {
            await line.replyMessage(event.replyToken, {
                type: 'text',
                text: 'ขออภัยในความไม่สะดวกค่ะ 🙏\n\nหากข้อมูลไม่ถูกต้อง กรุณาติดต่อฝ่ายบริการลูกค้าของบริษัทประกันของคุณเพื่อแก้ไขข้อมูลนะคะ\n\n(หรือพิมพ์ "เริ่มใหม่" เพื่อลองอีกครั้ง)'
            });
        }
    }
};

module.exports = { start, handleInput };
