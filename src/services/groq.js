const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const os = require('os');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * 👂 Hearing: Transcribe Audio using Whisper (Open Standard)
 * Model: whisper-large-v3 (Multilingual)
 */
const transcribeAudio = async (audioBuffer) => {
    try {
        console.log('👂 [Groq] Transcribing audio with Whisper...');

        // Groq SDK requires a file stream, so we must write to temp first
        // This is a known nuance of the OpenAI-compatible endpoints
        const tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.m4a`);
        fs.writeFileSync(tempFilePath, audioBuffer);

        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-large-v3", // Multilingual model
            response_format: "text",
            language: "th", // Hint: Thai preferred, but it auto-detects
            temperature: 0.0
        });

        // Cleanup
        fs.unlinkSync(tempFilePath);

        const text = transcription.trim();
        console.log(`👂 [Groq] Transcript: "${text}"`);
        return text;

    } catch (error) {
        console.error('❌ [Groq] STT Error:', error);
        return null;
    }
};

/**
 * 🧠 Speaking: Generate Response using Llama 3 (Open Weights)
 * Model: llama-3.3-70b-versatile
 */
const generateChatResponse = async (userText, riskProfile = {}) => {
    try {
        // Tone Calibration based on Risk
        let toneInstruction = "Be friendly, warm, and encouraging. Like a caring granddaughter (Thai: หลานสาว).";
        if (riskProfile.level === 'high' || riskProfile.level === 'critical') {
            toneInstruction = "Be calm but URGENT. Keep sentences short. Show concern. Advise professional help immediately.";
        }

        const riskContext = riskProfile.reasons ? `\nRISK ALERT: ${riskProfile.level.toUpperCase()} (${riskProfile.reasons.join(', ')})` : '';

        const systemPrompt = `
        You are Hanna (ฮันนา), a caring AI nurse assistant for chronic disease patients in Thailand.
        
        **Your Personality**:
        - ${toneInstruction}
        - Speak Thai (unless spoken to in English).
        - Use emojis 💚 😊 💊 to be friendly.
        
        **Patient Context**:
        ${riskContext}
        
        **Rules**:
        1. Keep responses CONCISE (under 2 sentences).
        2. If they report symptoms, show empathy.
        3. CRITICAL: NEVER diagnose or prescribe. If risk is high, tell them "I have notified the nurse".
        
        Reply ONLY with the text of your response.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userText }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 300,
        });

        const reply = completion.choices[0]?.message?.content || "ขออภัยค่ะ ฮันนากำลังคิดนิดนึงค่ะ";
        console.log(`🧠 [Groq] Reply: "${reply}"`);
        return reply;

    } catch (error) {
        console.error('❌ [Groq] Chat Error:', error);
        return "ขออภัยค่ะ ระบบกำลังประมวลผล กรุณารอสักครู่นะคะ";
    }
};

module.exports = { transcribeAudio, generateChatResponse };
