const db = require('../services/db');
const line = require('../services/line');
const qrcode = require('qrcode');
const generatePayload = require('promptpay-qr');

const handlePlanSelection = async (event, plan) => {
    const userId = event.source.userId;

    if (plan === 'trial') {
        // Start 14-day trial
        const moment = require('moment-timezone');
        const trialEndDate = moment().tz('Asia/Bangkok').add(14, 'days').endOf('day').toDate();

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
            text: '🎉 ยินดีต้อนรับสู่ครอบครัว Hanna ค่ะ! \n\nพรุ่งนี้เช้าฮันนาจะเริ่มทักไปคุยด้วยนะคะ ☀️\nขอให้คืนนี้หลับฝันดีค่ะ 💤'
        });
    } else {
        // Handle Paid Plan (Monthly)
        const amount = 2999; // Basic Plan

        // C4 FIX: Use environment variable for PromptPay ID
        const promptPayId = process.env.PROMPTPAY_ID;
        if (!promptPayId) {
            console.error('❌ PROMPTPAY_ID not configured!');
            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: 'ขออภัยค่ะ ระบบชำระเงินยังไม่พร้อมใช้งาน กรุณาติดต่อเจ้าหน้าที่ค่ะ 🙏'
            });
        }

        const payload = generatePayload(promptPayId, { amount });

        try {
            // C5 FIX: Generate QR locally using qrcode library
            const qrDataUrl = await qrcode.toDataURL(payload, {
                width: 300,
                margin: 2,
                color: { dark: '#000000', light: '#ffffff' }
            });

            // Convert data URL to buffer for upload
            const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
            const qrBuffer = Buffer.from(base64Data, 'base64');
            const filename = `qr-payment-${userId}-${Date.now()}.png`;

            // Try to upload to Supabase storage (LINE requires HTTPS URLs)
            const storage = require('../services/storage');
            let qrUrl = null;

            if (storage && storage.uploadQR) {
                qrUrl = await storage.uploadQR(qrBuffer, filename);
            }

            // If upload fails, use fallback text-only message
            if (!qrUrl) {
                console.warn('⚠️ QR upload failed, using fallback');
                return line.replyMessage(event.replyToken, [
                    {
                        type: 'text',
                        text: `📦 แพ็คเกจ Basic รายเดือน\nยอดชำระ: ฿${amount.toLocaleString()}\n\n🏦 PromptPay: ${promptPayId}\n\nโอนเงินแล้วกดยืนยันด้านล่างค่ะ`
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
        } catch (error) {
            console.error('❌ Error generating payment QR:', error);
            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: 'ขออภัยค่ะ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งค่ะ 🙏'
            });
        }
    }
};

const handlePaymentConfirmation = async (event) => {
    const userId = event.source.userId;

    try {
        // C3 FIX: Payment requires admin verification
        // Mark as 'pending_verification' instead of directly 'active'
        // Admin must verify via dashboard or LINE Notify before activation

        await db.query(
            `UPDATE chronic_patients 
             SET enrollment_status = 'pending_verification', 
                 subscription_plan = 'monthly',
                 subscription_start_date = NOW(),
                 onboarding_step = 6
             WHERE line_user_id = $1`,
            [userId]
        );

        // Notify admin for verification
        const lineNotify = require('../services/lineNotify');
        const userResult = await db.query(
            'SELECT name FROM chronic_patients WHERE line_user_id = $1',
            [userId]
        );
        const patientName = userResult.rows[0]?.name || 'Unknown';

        await lineNotify.sendAlert(
            `💳 PAYMENT VERIFICATION NEEDED\n\nPatient: ${patientName}\nPlan: Monthly (฿2,999)\nUser ID: ${userId}\n\nPlease verify payment and update status in database.`
        );

        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขอบคุณค่ะ! ฮันนาได้รับแจ้งการชำระเงินแล้ว ✅\n\nกรุณารอการตรวจสอบจากเจ้าหน้าที่ภายใน 24 ชั่วโมงนะคะ\nเมื่อยืนยันเรียบร้อยแล้ว ฮันนาจะแจ้งให้ทราบค่ะ 💚'
        });
    } catch (error) {
        console.error('❌ Error handling payment confirmation:', error);
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขออภัยค่ะ เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่ค่ะ 🙏'
        });
    }
};

module.exports = { handlePlanSelection, handlePaymentConfirmation };
