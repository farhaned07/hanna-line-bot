const db = require('../services/db');
const line = require('../services/line');
const payment = require('./payment');

/**
 * Check trial status and send appropriate reminders
 * Called by scheduler daily
 */
const checkTrialStatus = async () => {
    // Get all trial users
    const result = await db.query(
        `SELECT line_user_id, name, trial_start_date, trial_end_date 
         FROM chronic_patients 
         WHERE enrollment_status = 'trial'`
    );

    const now = new Date();

    for (const user of result.rows) {
        const trialEnd = new Date(user.trial_end_date);
        const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

        // Day 10: First reminder (4 days left)
        if (daysRemaining === 4) {
            await sendTrialReminder(user, 'first');
        }
        // Day 12: Second reminder (2 days left)
        else if (daysRemaining === 2) {
            await sendTrialReminder(user, 'second');
        }
        // Day 14: Final day
        else if (daysRemaining === 0) {
            await sendTrialReminder(user, 'final');
        }
        // Day 15: Trial expired
        else if (daysRemaining < 0) {
            await expireTrial(user);
        }
    }
};

/**
 * Send trial reminder based on stage
 */
const sendTrialReminder = async (user, stage) => {
    let message;

    if (stage === 'first') {
        // Day 10 - Gentle reminder
        message = {
            type: 'flex',
            altText: '💚 ช่วงทดลองใช้ใกล้หมดแล้วค่ะ',
            contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: `สวัสดีค่ะคุณ${user.name} 💚`,
                            weight: 'bold',
                            size: 'lg'
                        },
                        {
                            type: 'text',
                            text: 'ช่วงทดลองใช้ฟรีของคุณเหลืออีก 4 วันค่ะ',
                            margin: 'md',
                            wrap: true
                        },
                        {
                            type: 'separator',
                            margin: 'md'
                        },
                        {
                            type: 'text',
                            text: 'หากต้องการใช้บริการต่อ สามารถสมัครแพ็คเกจรายเดือนได้เลยนะคะ 😊',
                            margin: 'md',
                            size: 'sm',
                            color: '#666666',
                            wrap: true
                        }
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
                            action: {
                                type: 'postback',
                                label: 'สมัครแพ็คเกจรายเดือน 💳',
                                data: 'action=select_plan&plan=monthly'
                            }
                        },
                        {
                            type: 'button',
                            action: {
                                type: 'message',
                                label: 'ยังไม่ตัดสินใจ',
                                text: 'ยังไม่ตัดสินใจ'
                            },
                            margin: 'sm',
                            style: 'link'
                        }
                    ]
                }
            }
        };
    } else if (stage === 'second') {
        // Day 12 - More urgent
        message = {
            type: 'flex',
            altText: '⏰ เหลือเวลาอีก 2 วัน',
            contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: '⏰ เหลือเวลาอีก 2 วัน',
                            weight: 'bold',
                            size: 'xl',
                            color: '#FF6B00'
                        },
                        {
                            type: 'text',
                            text: `คุณ${user.name} ช่วงทดลองใช้ฟรีจะหมดอายุในอีก 2 วันค่ะ`,
                            margin: 'md',
                            wrap: true
                        },
                        {
                            type: 'text',
                            text: 'สมัครวันนี้เพื่อให้ฮันนาดูแลคุณต่อไปได้นะคะ 💚',
                            margin: 'sm',
                            size: 'sm',
                            color: '#666666',
                            wrap: true
                        }
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
                            action: {
                                type: 'postback',
                                label: 'สมัครเลย! (฿2,999/เดือน)',
                                data: 'action=select_plan&plan=monthly'
                            }
                        }
                    ]
                }
            }
        };
    } else if (stage === 'final') {
        // Day 14 - Last day
        message = {
            type: 'flex',
            altText: '🚨 วันสุดท้ายของช่วงทดลองใช้',
            contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: '🚨 วันสุดท้าย!',
                            weight: 'bold',
                            size: 'xl',
                            color: '#E60012'
                        },
                        {
                            type: 'text',
                            text: `คุณ${user.name} วันนี้เป็นวันสุดท้ายของช่วงทดลองใช้ฟรีค่ะ`,
                            margin: 'md',
                            wrap: true
                        },
                        {
                            type: 'text',
                            text: 'สมัครตอนนี้เพื่อไม่ให้ขาดการดูแลจากฮันนาค่ะ 💚',
                            margin: 'sm',
                            size: 'sm',
                            color: '#666666',
                            wrap: true
                        }
                    ]
                },
                footer: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'button',
                            style: 'primary',
                            color: '#E60012',
                            action: {
                                type: 'postback',
                                label: 'สมัครทันที! ฿2,999/เดือน',
                                data: 'action=select_plan&plan=monthly'
                            }
                        }
                    ]
                }
            }
        };
    }

    await line.pushMessage(user.line_user_id, message);
};

/**
 * Expire trial and disable service
 */
const expireTrial = async (user) => {
    // Update status to expired
    await db.query(
        `UPDATE chronic_patients 
         SET enrollment_status = 'expired' 
         WHERE line_user_id = $1`,
        [user.line_user_id]
    );

    // Send expiration message
    const message = {
        type: 'flex',
        altText: 'ช่วงทดลองใช้หมดอายุแล้วค่ะ',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: '😢 ช่วงทดลองใช้หมดอายุแล้ว',
                        weight: 'bold',
                        size: 'lg'
                    },
                    {
                        type: 'text',
                        text: `คุณ${user.name} ช่วงทดลองใช้ฟรี 14 วันของคุณหมดอายุแล้วค่ะ`,
                        margin: 'md',
                        wrap: true,
                        size: 'sm'
                    },
                    {
                        type: 'text',
                        text: 'ฮันนาจะหยุดส่งข้อความเช็คสุขภาพชั่วคราว แต่คุณสามารถกลับมาใช้บริการได้ทุกเมื่อค่ะ 💚',
                        margin: 'sm',
                        size: 'sm',
                        color: '#666666',
                        wrap: true
                    }
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
                        action: {
                            type: 'postback',
                            label: 'สมัครใช้บริการ ฿2,999/เดือน',
                            data: 'action=select_plan&plan=monthly'
                        }
                    }
                ]
            }
        }
    };

    await line.pushMessage(user.line_user_id, message);
};

module.exports = { checkTrialStatus };
