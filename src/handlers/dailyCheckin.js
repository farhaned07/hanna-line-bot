const db = require('../services/db');
const line = require('../services/line');
const OneBrain = require('../services/OneBrain');
const engagement = require('../services/engagement');

/**
 * Daily Check-In Handler
 * 
 * Implements the structured button-based check-in flow:
 * 1. Greeting: [ดี] [ปกติ] [ไม่ดี]
 * 2. Medication: [ได้ ครบ] [บางส่วน] [ไม่ได้เลย]
 * 3. Symptoms: [ไม่ มีแต่เรื่องดี] [มีอาการบ้าง]
 * 4. (If symptoms) Symptom Picker
 * 5. Completion
 * 
 * States:
 * - null: Not in check-in
 * - 'greeting': Waiting for mood response
 * - 'medication': Waiting for medication response
 * - 'symptoms': Waiting for symptom response
 * - 'symptom_picker': Waiting for specific symptoms
 */

// Message variations to prevent fatigue
const GREETINGS = {
    morning: [
        'ดีเช้า {name}! 🌅 วันนี้เป็นยังไง?',
        'สวัสดีตอนเช้าค่ะ {name}! ☀️ วันนี้รู้สึกดีไหม?',
        'เช้านี้เป็นไง {name}? 😊',
        'สวัสดี! 👋 วันนี้คุณรู้สึกยังไง?'
    ],
    afternoon: [
        'สวัสดีค่ะ {name}! วันนี้เป็นยังไงบ้าง?',
        'สวัสดีตอนบ่าย {name}! 🌤️ รู้สึกดีไหม?',
        'บ่ายนี้เป็นไง {name}? 😊'
    ],
    evening: [
        'สวัสดีตอนเย็น {name}! 🌆 วันนี้เป็นยังไง?',
        'เย็นนี้เป็นไง {name}? วันนี้โอเคไหม?',
        'สวัสดีค่ะ {name}! 🌙 วันนี้รู้สึกดีไหม?'
    ]
};

const MEDICATION_MESSAGES = [
    'วันนี้คุณกินยาครบไหม?',
    'กินยาครบแล้วไหมวันนี้?',
    'ยาวันนี้เรียบร้อยไหม?',
    'ทุกอย่างเกี่ยวกับยาเรียบร้อยไหม?'
];

const SYMPTOM_MESSAGES = [
    'มีอาการผิดปกติไหม?',
    'มีอาการต่างไปไหม?',
    'รู้สึกปกติดีไหม?'
];

/**
 * Get time-based greeting period
 */
const getGreetingPeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    return 'evening';
};

/**
 * Get random message from array
 */
const getRandomMessage = (messages, name = '') => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    return msg.replace('{name}', name);
};

/**
 * Start daily check-in flow
 * Called by scheduler or manually
 */
const startCheckIn = async (userId, userName) => {
    const period = getGreetingPeriod();
    const greeting = getRandomMessage(GREETINGS[period], userName);

    // Update state
    await db.query(
        `UPDATE chronic_patients 
         SET current_checkin_state = 'greeting' 
         WHERE line_user_id = $1`,
        [userId]
    );

    const message = {
        type: 'flex',
        altText: greeting,
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: greeting,
                        weight: 'bold',
                        size: 'lg',
                        wrap: true,
                        color: '#06C755'
                    }
                ]
            },
            footer: {
                type: 'box',
                layout: 'horizontal',
                spacing: 'sm',
                contents: [
                    {
                        type: 'button',
                        style: 'primary',
                        color: '#06C755',
                        action: {
                            type: 'postback',
                            label: 'ดี 😊',
                            data: 'action=checkin_mood&value=good'
                        },
                        flex: 1
                    },
                    {
                        type: 'button',
                        style: 'secondary',
                        action: {
                            type: 'postback',
                            label: 'ปกติ 😐',
                            data: 'action=checkin_mood&value=ok'
                        },
                        flex: 1
                    },
                    {
                        type: 'button',
                        style: 'secondary',
                        color: '#FF6B6B',
                        action: {
                            type: 'postback',
                            label: 'ไม่ดี 😟',
                            data: 'action=checkin_mood&value=bad'
                        },
                        flex: 1
                    }
                ]
            }
        }
    };

    return line.pushMessage(userId, message);
};

/**
 * Handle check-in postback
 */
const handleCheckInPostback = async (event, user) => {
    const userId = user.line_user_id;
    const data = new URLSearchParams(event.postback.data);
    const action = data.get('action');
    const value = data.get('value');
    const state = user.current_checkin_state;

    console.log(`[DailyCheckIn] User ${userId} state: ${state}, action: ${action}, value: ${value}`);

    // ================================================================
    // STEP 1: Mood Response → Medication Question
    // ================================================================
    if (action === 'checkin_mood') {
        // Log mood
        await db.query(
            `INSERT INTO check_ins (patient_id, mood, check_in_time) 
             VALUES ((SELECT id FROM chronic_patients WHERE line_user_id = $1), $2, NOW())
             ON CONFLICT DO NOTHING`,
            [userId, value]
        );

        // Update state
        await db.query(
            `UPDATE chronic_patients 
             SET current_checkin_state = 'medication', last_response_date = CURRENT_DATE 
             WHERE line_user_id = $1`,
            [userId]
        );

        // If bad mood, trigger OneBrain alert
        if (value === 'bad') {
            const patientRes = await db.query('SELECT id FROM chronic_patients WHERE line_user_id = $1', [userId]);
            if (patientRes.rows[0]) {
                OneBrain.analyzePatient(patientRes.rows[0].id, 'mood_bad');
            }
        }

        // Response based on mood
        let moodResponse = '';
        if (value === 'good') {
            moodResponse = 'ยอดเยี่ยม! 💪\n\n';
        } else if (value === 'ok') {
            moodResponse = 'เข้าใจค่ะ 👍\n\n';
        } else {
            moodResponse = 'เสียใจด้วยค่ะ 😟 เราจะดูแลคุณนะ\n\n';
        }

        const medQuestion = getRandomMessage(MEDICATION_MESSAGES);

        return line.replyMessage(event.replyToken, {
            type: 'flex',
            altText: moodResponse + medQuestion,
            contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        { type: 'text', text: moodResponse.trim(), size: 'md', wrap: true },
                        { type: 'text', text: medQuestion, weight: 'bold', size: 'lg', margin: 'md', color: '#06C755' }
                    ]
                },
                footer: {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'button',
                            style: 'primary',
                            color: '#06C755',
                            action: {
                                type: 'postback',
                                label: 'ได้ ครบ ✅',
                                data: 'action=checkin_med&value=full'
                            }
                        },
                        {
                            type: 'button',
                            style: 'secondary',
                            action: {
                                type: 'postback',
                                label: 'บางส่วน',
                                data: 'action=checkin_med&value=partial'
                            }
                        },
                        {
                            type: 'button',
                            style: 'secondary',
                            action: {
                                type: 'postback',
                                label: 'ไม่ได้เลย',
                                data: 'action=checkin_med&value=none'
                            }
                        },
                        {
                            type: 'button',
                            style: 'link',
                            action: {
                                type: 'postback',
                                label: 'ลืม',
                                data: 'action=checkin_med&value=forgot'
                            }
                        }
                    ]
                }
            }
        });
    }

    // ================================================================
    // STEP 2: Medication Response → Symptom Question
    // ================================================================
    if (action === 'checkin_med') {
        // Log medication
        const taken = value === 'full';
        const partial = value === 'partial';

        // Update today's check-in with medication data
        await db.query(
            `UPDATE check_ins 
             SET medication_taken = $2, medication_notes = $3
             WHERE patient_id = (SELECT id FROM chronic_patients WHERE line_user_id = $1)
             AND DATE(check_in_time) = CURRENT_DATE`,
            [userId, taken, value]
        );

        // Update state
        await db.query(
            `UPDATE chronic_patients SET current_checkin_state = 'symptoms' WHERE line_user_id = $1`,
            [userId]
        );

        // If no medication, trigger alert
        if (value === 'none') {
            const patientRes = await db.query('SELECT id FROM chronic_patients WHERE line_user_id = $1', [userId]);
            if (patientRes.rows[0]) {
                OneBrain.analyzePatient(patientRes.rows[0].id, 'missed_medication');
            }
        }

        // Response based on medication
        let medResponse = '';
        if (taken) {
            medResponse = 'ยอดเยี่ยมมม! 🎉 ต่อเนื่องนะคะ\n\n';
        } else if (partial) {
            medResponse = 'ไม่เป็นไรค่ะ 👍 พยายามกินให้ครบนะ\n\n';
        } else if (value === 'forgot') {
            medResponse = 'ไม่เป็นไรค่ะ 😊 อย่าลืมกินในมื้อถัดไปนะ\n\n';
        } else {
            medResponse = 'ไม่เป็นไรค่ะ 😟 บอกเราได้ถ้ามีปัญหานะ\n\n';
        }

        const symptomQuestion = getRandomMessage(SYMPTOM_MESSAGES);

        return line.replyMessage(event.replyToken, {
            type: 'flex',
            altText: medResponse + symptomQuestion,
            contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        { type: 'text', text: medResponse.trim(), size: 'md', wrap: true },
                        { type: 'text', text: symptomQuestion, weight: 'bold', size: 'lg', margin: 'md', color: '#06C755' }
                    ]
                },
                footer: {
                    type: 'box',
                    layout: 'horizontal',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'button',
                            style: 'primary',
                            color: '#06C755',
                            action: {
                                type: 'postback',
                                label: 'ไม่ มีแต่เรื่องดี 👍',
                                data: 'action=checkin_symptom&value=none'
                            },
                            flex: 1
                        },
                        {
                            type: 'button',
                            style: 'secondary',
                            color: '#FF6B6B',
                            action: {
                                type: 'postback',
                                label: 'มีอาการบ้าง 😟',
                                data: 'action=checkin_symptom&value=has'
                            },
                            flex: 1
                        }
                    ]
                }
            }
        });
    }

    // ================================================================
    // STEP 3: Symptom Response → Complete or Symptom Picker
    // ================================================================
    if (action === 'checkin_symptom') {
        if (value === 'none') {
            // No symptoms - complete check-in
            await db.query(
                `UPDATE chronic_patients SET current_checkin_state = NULL WHERE line_user_id = $1`,
                [userId]
            );

            // Check for streak
            const streakMsg = await getStreakMessage(userId);

            return line.replyMessage(event.replyToken, {
                type: 'flex',
                altText: 'ยอดเยี่ยม! 🌟',
                contents: {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            { type: 'text', text: 'ยอดเยี่ยม! 🌟', weight: 'bold', size: 'xl', color: '#06C755' },
                            { type: 'text', text: 'ขอบคุณที่ตอบคำถามของเราค่ะ 💕', margin: 'md', wrap: true },
                            { type: 'text', text: 'วันนี้คุณดูแลตัวเองได้ดีมากค่ะ', margin: 'sm', size: 'sm', color: '#666666' },
                            ...(streakMsg ? [{ type: 'text', text: streakMsg, margin: 'md', weight: 'bold', color: '#FF6B00' }] : []),
                            { type: 'separator', margin: 'lg' },
                            { type: 'text', text: 'พบกันพรุ่งนี้นะคะ! 👋', margin: 'md', align: 'center', size: 'sm' }
                        ]
                    }
                }
            });
        } else {
            // Has symptoms - show symptom picker
            await db.query(
                `UPDATE chronic_patients SET current_checkin_state = 'symptom_picker' WHERE line_user_id = $1`,
                [userId]
            );

            return line.replyMessage(event.replyToken, {
                type: 'flex',
                altText: 'มีอาการอะไรบ้างคะ?',
                contents: {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            { type: 'text', text: 'มีอาการอะไรบ้างคะ? 🩺', weight: 'bold', size: 'lg', color: '#06C755' },
                            { type: 'text', text: 'เลือกอาการที่ตรงกับคุณค่ะ', margin: 'sm', size: 'xs', color: '#888888' }
                        ]
                    },
                    footer: {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'sm',
                                contents: [
                                    { type: 'button', style: 'secondary', action: { type: 'postback', label: 'มีไข้ 🌡️', data: 'action=checkin_symptom_select&value=fever' }, flex: 1 },
                                    { type: 'button', style: 'secondary', action: { type: 'postback', label: 'ปวดศีรษะ', data: 'action=checkin_symptom_select&value=headache' }, flex: 1 }
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'sm',
                                contents: [
                                    { type: 'button', style: 'secondary', action: { type: 'postback', label: 'คลื่นไส้', data: 'action=checkin_symptom_select&value=nausea' }, flex: 1 },
                                    { type: 'button', style: 'secondary', action: { type: 'postback', label: 'หอบเหนื่อย', data: 'action=checkin_symptom_select&value=sob' }, flex: 1 }
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'sm',
                                contents: [
                                    { type: 'button', style: 'secondary', action: { type: 'postback', label: 'ปวด/บวม', data: 'action=checkin_symptom_select&value=pain' }, flex: 1 },
                                    { type: 'button', style: 'secondary', action: { type: 'postback', label: 'เหนื่อยล้า', data: 'action=checkin_symptom_select&value=fatigue' }, flex: 1 }
                                ]
                            },
                            { type: 'button', style: 'link', action: { type: 'postback', label: 'อื่นๆ...', data: 'action=checkin_symptom_select&value=other' } }
                        ]
                    }
                }
            });
        }
    }

    // ================================================================
    // STEP 4: Symptom Selection → Complete with Alert
    // ================================================================
    if (action === 'checkin_symptom_select') {
        const symptomLabels = {
            'fever': 'มีไข้',
            'headache': 'ปวดศีรษะ',
            'nausea': 'คลื่นไส้',
            'sob': 'หอบเหนื่อย',
            'pain': 'ปวด/บวม',
            'fatigue': 'เหนื่อยล้า',
            'other': 'อื่นๆ'
        };

        const symptom = symptomLabels[value] || value;

        // Update check-in with symptom
        await db.query(
            `UPDATE check_ins 
             SET symptoms = $2
             WHERE patient_id = (SELECT id FROM chronic_patients WHERE line_user_id = $1)
             AND DATE(check_in_time) = CURRENT_DATE`,
            [userId, symptom]
        );

        // Clear state
        await db.query(
            `UPDATE chronic_patients SET current_checkin_state = NULL WHERE line_user_id = $1`,
            [userId]
        );

        // Trigger OneBrain for symptom alert
        const patientRes = await db.query('SELECT id FROM chronic_patients WHERE line_user_id = $1', [userId]);
        if (patientRes.rows[0]) {
            OneBrain.analyzePatient(patientRes.rows[0].id, `symptom:${symptom}`);

            // Track recurring symptoms (3-day escalation)
            const recurringResult = await engagement.trackRecurringSymptom(patientRes.rows[0].id, symptom);
            if (recurringResult.recurring) {
                console.log(`🚨 [Recurring Symptom] ${symptom} for ${recurringResult.days} days - created urgent task`);
            }
        }

        return line.replyMessage(event.replyToken, {
            type: 'flex',
            altText: 'รับทราบแล้วค่ะ',
            contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        { type: 'text', text: 'รับทราบแล้วค่ะ 📝', weight: 'bold', size: 'lg', color: '#06C755' },
                        { type: 'text', text: `คุณแจ้งอาการ: ${symptom}`, margin: 'md', wrap: true },
                        { type: 'separator', margin: 'md' },
                        { type: 'text', text: 'ฮันนาแจ้งพยาบาลแล้วค่ะ', margin: 'md', size: 'sm', color: '#666666' },
                        { type: 'text', text: 'ถ้าอาการหนักขึ้น บอกเราได้ตลอดนะคะ', margin: 'sm', size: 'sm', color: '#666666' }
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
                            action: { type: 'message', label: 'ไปหน้าแรก 🏠', text: 'ช่วยเหลือ' }
                        }
                    ]
                }
            }
        });
    }

    return null;
};

/**
 * Get streak celebration message (if applicable)
 */
const getStreakMessage = async (userId) => {
    try {
        // Get consecutive check-in days
        const result = await db.query(`
            SELECT COUNT(DISTINCT DATE(check_in_time)) as streak
            FROM check_ins
            WHERE patient_id = (SELECT id FROM chronic_patients WHERE line_user_id = $1)
            AND check_in_time >= CURRENT_DATE - INTERVAL '30 days'
        `, [userId]);

        const streak = parseInt(result.rows[0]?.streak || 0);

        if (streak === 7) return '🔥 7 วันติดต่อกัน! สุดยอด!';
        if (streak === 14) return '🏆 2 อาทิตย์แล้ว! เก่งมาก!';
        if (streak === 30) return '⭐ 1 เดือนเต็ม! ยอดเยี่ยม!';

        return null;
    } catch (e) {
        console.error('Error getting streak:', e);
        return null;
    }
};

/**
 * Check if user is in check-in flow
 */
const isInCheckInFlow = (user) => {
    return user.current_checkin_state &&
        ['greeting', 'medication', 'symptoms', 'symptom_picker'].includes(user.current_checkin_state);
};

module.exports = {
    startCheckIn,
    handleCheckInPostback,
    isInCheckInFlow,
    getStreakMessage
};
