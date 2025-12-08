const WebSocket = require('ws');

/**
 * Gemini 2.0 Flash Multimodal Live API Service
 * Handles real-time bidirectional audio streaming
 */

const GEMINI_LIVE_API_URL = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';

// H8 & H9 FIX: Session limits
const MAX_CONCURRENT_SESSIONS = 50;
const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

// Hanna's system instruction for nursing intelligence
const HANNA_SYSTEM_INSTRUCTION = `You are Hanna (ฮันนา), a caring AI nurse for diabetes patients in Thailand.

PERSONALITY:
- Speak in Thai language only
- Warm, empathetic, and professional tone
- Use "ค่ะ" (polite female ending) in every response
- Address patients as "คุณ" (respectful you)
- Keep responses brief (2-3 sentences maximum)

ROLE & RESPONSIBILITIES:
- Monitor blood sugar levels and medication adherence
- Provide health advice and encouragement
- Detect urgency and escalate to human nurses when needed
- Remember patient context from conversation history

IMPORTANT RULES:
- Never provide medical diagnoses (say "ควรปรึกษาแพทย์นะคะ" - should consult doctor)
- If blood sugar > 250 or < 70, express concern and suggest calling nurse
- If patient mentions emergency keywords (chest pain, difficulty breathing, severe dizziness), immediately suggest calling emergency services
- Be encouraging about medication adherence
- Acknowledge feelings and show empathy

CONVERSATION STYLE:
- Greeting: "สวัสดีค่ะ ฮันนาพร้อมช่วยเหลือคุณแล้วค่ะ วันนี้รู้สึกอย่างไรบ้างคะ?"
- Response format: Brief, actionable, caring
- Example: "น้ำตาลสูงนิดนึงนะคะ กินยาครบแล้วหรือยังคะ? ดื่มน้ำเยอะๆนะคะ"`;

class GeminiLiveService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.sessions = new Map();
    }

    /**
     * Create a new session for a user
     * @param {string} userId - LINE user ID
     * @param {WebSocket} clientWs - Client WebSocket connection
     */
    createSession(userId, clientWs) {
        // H9 FIX: Check concurrent session limit
        if (this.sessions.size >= MAX_CONCURRENT_SESSIONS) {
            console.warn(`⚠️ Max sessions (${MAX_CONCURRENT_SESSIONS}) reached. Rejecting new session.`);
            clientWs.send(JSON.stringify({
                type: 'error',
                message: 'ขออภัยค่ะ ระบบมีผู้ใช้งานเต็มแล้ว กรุณาลองใหม่ภายหลังนะคะ'
            }));
            clientWs.close();
            return null;
        }

        console.log(`Creating Gemini Live session for user: ${userId} (${this.sessions.size + 1}/${MAX_CONCURRENT_SESSIONS})`);

        // Connect to Gemini Live API
        const geminiWs = new WebSocket(`${GEMINI_LIVE_API_URL}?key=${this.apiKey}`);

        const session = {
            userId,
            clientWs,
            geminiWs,
            connected: false,
            createdAt: Date.now(),
            timeoutId: null
        };

        // H8 FIX: Set session timeout
        session.timeoutId = setTimeout(() => {
            console.log(`⏰ Session timeout for user: ${userId}`);
            clientWs.send(JSON.stringify({
                type: 'timeout',
                message: 'เซสชันหมดเวลาแล้วค่ะ กรุณาเชื่อมต่อใหม่ได้เลยนะคะ'
            }));
            this.closeSession(userId);
        }, SESSION_TIMEOUT_MS);

        // Handle Gemini connection open
        geminiWs.on('open', () => {
            console.log('Connected to Gemini Live API');
            session.connected = true;

            // Send initial setup
            const setupMessage = {
                setup: {
                    model: 'models/gemini-2.0-flash-exp',
                    systemInstruction: {
                        parts: [{ text: HANNA_SYSTEM_INSTRUCTION }]
                    },
                    generationConfig: {
                        responseModalities: ['AUDIO'],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: 'Puck' // Female voice
                                }
                            }
                        }
                    }
                }
            };

            geminiWs.send(JSON.stringify(setupMessage));

            // Notify client that connection is ready
            clientWs.send(JSON.stringify({ type: 'ready' }));

            // Send initial greeting
            this.sendGreeting(geminiWs);
        });

        // Handle messages from Gemini
        geminiWs.on('message', (data) => {
            try {
                const message = JSON.parse(data);

                // Forward audio responses to client
                if (message.serverContent?.modelTurn?.parts) {
                    const parts = message.serverContent.modelTurn.parts;

                    for (const part of parts) {
                        if (part.inlineData?.mimeType === 'audio/pcm') {
                            // Send audio chunk to client
                            clientWs.send(JSON.stringify({
                                type: 'audio',
                                data: part.inlineData.data
                            }));
                        }

                        if (part.text) {
                            // Also send text for debugging/logging
                            clientWs.send(JSON.stringify({
                                type: 'text',
                                text: part.text
                            }));
                        }
                    }
                }

                // Handle turn complete
                if (message.serverContent?.turnComplete) {
                    clientWs.send(JSON.stringify({ type: 'turnComplete' }));
                }

            } catch (error) {
                console.error('Error processing Gemini message:', error);
            }
        });

        // Handle Gemini errors
        geminiWs.on('error', (error) => {
            console.error('Gemini WebSocket error:', error);
            clientWs.send(JSON.stringify({
                type: 'error',
                message: 'Connection to AI service failed'
            }));
        });

        // Handle Gemini close
        geminiWs.on('close', (code, reason) => {
            console.log(`Gemini connection closed. Code: ${code}, Reason: ${reason.toString()}`);
            session.connected = false;
            if (session.timeoutId) clearTimeout(session.timeoutId);
            this.sessions.delete(userId);
        });

        // Handle client messages (audio from user)
        clientWs.on('message', (data) => {
            try {
                const message = JSON.parse(data);

                if (message.type === 'audio' && session.connected) {
                    // Forward audio to Gemini
                    const audioMessage = {
                        clientContent: {
                            turns: [{
                                role: 'user',
                                parts: [{
                                    inlineData: {
                                        mimeType: 'audio/pcm',
                                        data: message.data
                                    }
                                }]
                            }],
                            turnComplete: true
                        }
                    };

                    geminiWs.send(JSON.stringify(audioMessage));
                }
            } catch (error) {
                console.error('Error processing client message:', error);
            }
        });

        // Handle client disconnect
        clientWs.on('close', () => {
            console.log(`Client disconnected: ${userId}`);
            if (session.timeoutId) clearTimeout(session.timeoutId);
            if (geminiWs.readyState === WebSocket.OPEN) {
                geminiWs.close();
            }
            this.sessions.delete(userId);
        });

        this.sessions.set(userId, session);
        return session;
    }

    /**
     * Send initial greeting from Hanna
     */
    sendGreeting(geminiWs) {
        const greetingMessage = {
            clientContent: {
                turns: [{
                    role: 'user',
                    parts: [{
                        text: 'สวัสดี' // This triggers Hanna's greeting
                    }]
                }],
                turnComplete: true
            }
        };

        geminiWs.send(JSON.stringify(greetingMessage));
    }

    /**
     * Get active session for user
     */
    getSession(userId) {
        return this.sessions.get(userId);
    }

    /**
     * Get current session count
     */
    getSessionCount() {
        return this.sessions.size;
    }

    /**
     * Close session for user
     */
    closeSession(userId) {
        const session = this.sessions.get(userId);
        if (session) {
            if (session.timeoutId) clearTimeout(session.timeoutId);
            if (session.geminiWs.readyState === WebSocket.OPEN) {
                session.geminiWs.close();
            }
            if (session.clientWs.readyState === WebSocket.OPEN) {
                session.clientWs.close();
            }
            this.sessions.delete(userId);
        }
    }
}

module.exports = GeminiLiveService;
