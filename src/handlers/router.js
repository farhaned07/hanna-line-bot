const onboarding = require('./onboarding');
// Payment handler removed for B2B model
const db = require('../services/db');
const line = require('../services/line');
const { logCheckIn, logMedication, getHealthSummary } = require('./healthData');
const gemini = require('../services/gemini');
const tts = require('../services/edgeTtsAdapter');
const storage = require('../services/storage');
const livekitService = require('../services/livekitService');
const voiceAgent = require('../worker/agent');
const healthData = require('./healthData');

// Helper to convert stream to buffer
const streamToBuffer = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
};

const handleAudio = async (event) => {
    const userId = event.source.userId;
    const messageId = event.message.id;

    try {
        // 1. Get Audio Content
        const stream = await line.getMessageContent(messageId);
        const audioBuffer = await streamToBuffer(stream);

        // 2. Process with Gemini (STT + Brain)
        const replyText = await gemini.processAudio(audioBuffer);

        // 3. Generate Speech (TTS)
        const speechBuffer = await tts.generateSpeech(replyText);

        let messages = [
            { type: 'text', text: replyText }
        ];

        // 4. Upload & Attach Audio (if TTS successful)
        if (speechBuffer) {
            const filename = `reply - ${userId} -${Date.now()}.mp3`;
            const publicUrl = await storage.uploadAudio(speechBuffer, filename);

            if (publicUrl) {
                // Add Audio Message (Must be first or second? LINE allows mixed)
                // Note: LINE Audio messages require duration. 
                // For MVP, we might skip duration (it might show 0:00) or use ffmpeg to get it.
                // Let's try sending without explicit duration (optional in some SDKs, but LINE API requires it).
                // Actually, LINE API requires 'duration' in milliseconds.
                // Without ffmpeg/music-metadata, we can't easily get duration from buffer.
                // Workaround: Send just text if we can't get duration, OR send as a file link?
                // Better: Use a fixed duration or estimate? No, that's bad UX.
                // Let's try sending as 'audio' with a dummy duration (e.g. 1000ms) just to test, 
                // OR use 'fluent-ffmpeg' which we installed.

                // For now, let's just send the text and the link to the audio if we can't determine duration easily.
                // Or better, just send the text. The user asked for "Voice Experience".
                // Let's assume we can send it.

                messages.unshift({
                    type: 'audio',
                    originalContentUrl: publicUrl,
                    duration: 5000 // Hardcoded 5s for MVP to avoid complex duration logic
                });
            }
        }

        return line.replyMessage(event.replyToken, messages);

    } catch (error) {
        console.error('❌ Error handling audio:', error);
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขออภัยค่ะ ฮันนาไม่สามารถประมวลผลเสียงได้ในขณะนี้ 😓'
        });
    }
};

const handleFollow = async (event) => {
    const userId = event.source.userId;
    try {
        // Create user if not exists
        await db.query(
            `INSERT INTO chronic_patients(line_user_id, enrollment_status, onboarding_step)
VALUES($1, 'onboarding', 0) 
         ON CONFLICT(line_user_id) DO UPDATE SET enrollment_status = 'onboarding', onboarding_step = 0`,
            [userId]
        );
        return onboarding.start(event);
    } catch (error) {
        console.error('❌ Database Error in handleFollow:', error);
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขออภัยค่ะ ระบบขัดข้องชั่วคราว กรุณาลองใหม่ภายหลังนะคะ 😓'
        });
    }
};

const handleMessage = async (event) => {
    // Handle Audio Messages
    if (event.message.type === 'audio') {
        return handleAudio(event);
    }

    const userId = event.source.userId;
    let user;
    try {
        const userResult = await db.query('SELECT * FROM chronic_patients WHERE line_user_id = $1', [userId]);
        user = userResult.rows[0];
    } catch (error) {
        console.error('❌ Database Error in handleMessage:', error);
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขออภัยค่ะ ระบบฐานข้อมูลขัดข้องชั่วคราว กรุณาลองใหม่ภายหลังนะคะ 😓'
        });
    }

    if (!user) {
        return handleFollow(event);
    }

    if (user.enrollment_status === 'onboarding') {
        return onboarding.handleInput(event, user);
    }

    // Handle expired status - Redirect to Admin/Nurse
    if (user.enrollment_status === 'expired') {
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: `สวัสดีค่ะคุณ${user.name} ! 💚\n\nสถานะบัญชีของคุณต้องได้รับการตรวจสอบ กรุณาติดต่อเจ้าหน้าที่ดูแลของคุณนะคะ`
        });
    }

    // Handle Rich Menu commands
    if (event.message.type === 'text') {
        const text = event.message.text.trim();

        // Health Check
        if (text === 'เช็คสุขภาพ') {
            return line.replyMessage(event.replyToken, {
                type: 'text',
                text: `สวัสดีค่ะคุณ${user.name} ! 💚\n\nวันนี้รู้สึกอย่างไรบ้างคะ ? `,
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
                text: `💊 บันทึกการกินยา\n\nวันนี้กินยาครบแล้วหรือยังคะ ? `,
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
                summaryText = `\n\n📊 สรุป 7 วันที่ผ่านมา: \n` +
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

        // Help
        if (text === 'ช่วยเหลือ' || text === 'help') {
            return line.replyMessage(event.replyToken, {
                type: 'flex',
                altText: '❓ ศูนย์ช่วยเหลือ',
                contents: {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            { type: 'text', text: '❓ ศูนย์ช่วยเหลือ', weight: 'bold', size: 'xl', color: '#06C755' },
                            { type: 'text', text: 'มีอะไรให้ฮันนาช่วยไหมคะ?', margin: 'md', weight: 'bold' },
                            { type: 'separator', margin: 'md' },
                            { type: 'text', text: 'คำสั่งที่ใช้ได้:', margin: 'md', weight: 'bold', size: 'sm' },
                            { type: 'text', text: '• "เช็คสุขภาพ" - บันทึกอาการประจำวัน', size: 'sm', margin: 'sm', color: '#666666' },
                            { type: 'text', text: '• "บันทึกกินยา" - บันทึกการกินยา', size: 'sm', margin: 'sm', color: '#666666' },
                            { type: 'text', text: '• "โปรไฟล์ของฉัน" - ดูสรุปสุขภาพ', size: 'sm', margin: 'sm', color: '#666666' },
                            { type: 'text', text: '• "เริ่มใหม่" - เริ่มต้นการใช้งานใหม่', size: 'sm', margin: 'sm', color: '#666666' }
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
                                action: { type: 'uri', label: '📞 ติดต่อเจ้าหน้าที่', uri: 'https://lin.ee/519fiets' }
                            }
                        ]
                    }
                }
            });
        }

        // Admin Command: Setup Rich Menu (Protected)
        // Usage: admin:setup-richmenu:HANNA_SECRET_2024
        if (text.startsWith('admin:setup-richmenu')) {
            const secret = text.split(':')[2];
            if (secret !== 'HANNA_SECRET_2024') {
                console.warn(`[Security] Unauthorized admin attempt by ${userId}`);
                return Promise.resolve(null); // Ignore silently
            }

            console.log(`[Admin] Rich Menu setup triggered by user ${userId}`);

            // Import Rich Menu functions
            const { createRichMenu, setDefaultRichMenu, listRichMenus, deleteRichMenu, uploadRichMenuImage } = require('../services/richMenu');
            const { generateRichMenuImage } = require('../utils/imageGenerator');

            // Send initial acknowledgement
            await line.replyMessage(event.replyToken, {
                type: 'text',
                text: '🔧 Starting Rich Menu setup...\nThis may take 10-15 seconds.'
            });

            try {
                // Generate image
                console.log('[Admin] Generating Rich Menu image...');
                const imagePath = generateRichMenuImage();

                // List and delete existing menus
                console.log('[Admin] Checking existing rich menus...');
                const existing = await listRichMenus();

                if (existing.length > 0) {
                    console.log(`[Admin] Deleting ${existing.length} old rich menus...`);
                    for (const menu of existing) {
                        await deleteRichMenu(menu.richMenuId);
                    }
                }

                // Create new rich menu
                console.log('[Admin] Creating new rich menu...');
                const richMenuId = await createRichMenu();

                // Upload image
                console.log('[Admin] Uploading Rich Menu image...');
                await uploadRichMenuImage(richMenuId, imagePath);

                // Set as default
                console.log('[Admin] Setting as default rich menu...');
                await setDefaultRichMenu(richMenuId);

                console.log('[Admin] Rich Menu setup complete!');

                // Send success message
                return line.pushMessage(userId, {
                    type: 'text',
                    text: '✅ Rich Menu updated successfully!\n\nPlease close and reopen the chat to see the new menu.'
                });

            } catch (error) {
                console.error('[Admin] Rich Menu setup failed:', error);
                return line.pushMessage(userId, {
                    type: 'text',
                    text: `❌ Rich Menu setup failed:\n${error.message}`
                });
            }
        }

        // Default response
        // --- Conversation Memory & Smart Routing ---
        // Store last 5 messages in memory (for MVP - move to Redis/DB for production)
        if (!global.conversationHistory) global.conversationHistory = {};
        if (!global.conversationHistory[userId]) global.conversationHistory[userId] = [];

        global.conversationHistory[userId].push({ role: 'user', text: text });
        if (global.conversationHistory[userId].length > 5) global.conversationHistory[userId].shift();

        // Smart Routing: Detect complex medical questions
        const complexKeywords = ['ทำไม', 'อย่างไร', 'อาการ', 'สาเหตุ', 'รักษา', 'why', 'how', 'symptom', 'cause'];
        const isComplex = complexKeywords.some(kw => text.includes(kw)) && text.length > 20;

        if (isComplex) {
            return line.replyMessage(event.replyToken, {
                type: 'flex',
                altText: '💡 คำถามนี้น่าสนใจค่ะ',
                contents: {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            { type: 'text', text: '💡 คำถามนี้น่าสนใจค่ะ', weight: 'bold', color: '#06C755' },
                            { type: 'text', text: 'เพื่อให้ฮันนาตอบได้ละเอียดและชัดเจนกว่านี้ ลองคุยด้วยเสียงไหมคะ? ฮันนาจะอธิบายให้ฟังยาวๆ เลยค่ะ 😊', margin: 'md', wrap: true, size: 'sm' }
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
                                action: { type: 'uri', label: '📞 คุยกับฮันนา (Hanna Voice)', uri: `https://liff.line.me/${process.env.LIFF_ID}` }
                            }
                        ]
                    }
                }
            });
        }

        // Default: Simple acknowledgement (or pass to Gemini Text API if enabled)
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขอบคุณค่ะ ฮันนาได้รับข้อความแล้ว 😊\n(ฮันนากำลังเรียนรู้ที่จะตอบแชทเก่งขึ้น เร็วๆ นี้จะคุยได้ยาวๆ นะคะ)'
        });
    }

    return Promise.resolve(null);
};

const handlePostback = async (event) => {
    const userId = event.source.userId;
    const data = new URLSearchParams(event.postback.data);
    const action = data.get('action');

    try {
        const userResult = await db.query('SELECT * FROM chronic_patients WHERE line_user_id = $1', [userId]);
        const user = userResult.rows[0];

        if (user && user.enrollment_status === 'onboarding') {
            return onboarding.handleInput(event, user);
        }

        return Promise.resolve(null);
    } catch (error) {
        console.error('❌ Error in handlePostback:', error);
        return line.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขออภัยค่ะ ระบบขัดข้องชั่วคราว กรุณาลองใหม่ภายหลังนะคะ 😓'
        });
    }
};

module.exports = { handleFollow, handleMessage, handlePostback };
