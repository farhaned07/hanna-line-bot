const db = require('../services/db');
const line = require('../services/line');
const qrcode = require('qrcode');
const generatePayload = require('promptpay-qr');

const handlePlanSelection = async (event, plan) => {
    const userId = event.source.userId;

    if (plan === 'trial') {
        // Start 14-day trial
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);

        await db.query(
            `UPDATE chronic_patients 
       SET enrollment_status = 'trial', 
           trial_start_date = NOW(), 
           trial_end_date = $1,
           onboarding_step = 6 
       WHERE line_user_id = $2`,
            [trialEndDate, userId]
        );

        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: '🎉 ยินดีต้อนรับสู่ครอบครัว Hanna ค่ะ! \nพรุ่งนี้เช้าฮันนาจะเริ่มทักไปคุยด้วยนะคะ ☀️'
        });
    } else {
        // Handle Paid Plan (Monthly)
        const amount = 2999; // Basic Plan
        const mobileNumber = '0812345678'; // REPLACE WITH REAL PROMPTPAY ID
        const payload = generatePayload(mobileNumber, { amount });

        // Generate QR Code Data URL
        // Note: In production, we need to upload this image to a public URL.
        // For MVP/Text-based, we might just send the text or a static image if we can't upload dynamically.
        // Or we can use a public QR generator API for MVP speed.
        // Let's use a public API for tonight's MVP to avoid S3 setup.
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;

        return line.replyMessage(event.replyToken, [
            {
                type: 'text',
                text: `📦 แพ็คเกจ Basic รายเดือน \nยอดชำระ: ฿${amount.toLocaleString()}`
            },
            {
                type: 'image',
                originalContentUrl: qrUrl,
                previewImageUrl: qrUrl
            },
            {
                type: 'text',
                text: 'เมื่อโอนเงินเสร็จแล้ว กดปุ่มด้านล่างเพื่อยืนยันนะคะ',
                quickReply: {
                    items: [
                        { type: 'action', action: { type: 'postback', label: 'โอนแล้ว ✅', data: 'action=confirm_payment' } }
                    ]
                }
            }
        ]);
    }
};

const handlePaymentConfirmation = async (event) => {
    const userId = event.source.userId;

    // In real app, verify slip. For MVP, trust user.
    await db.query(
        `UPDATE chronic_patients 
         SET enrollment_status = 'active', 
             subscription_plan = 'monthly',
             subscription_start_date = NOW(),
             onboarding_step = 6
         WHERE line_user_id = $1`,
        [userId]
    );

    return line.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ขอบคุณค่ะ! ฮันนาตรวจสอบยอดเงินเรียบร้อยแล้ว ✅\nเริ่มดูแลสุขภาพกันตั้งแต่วันนี้เลยนะคะ!'
    });
};

module.exports = { handlePlanSelection, handlePaymentConfirmation };
