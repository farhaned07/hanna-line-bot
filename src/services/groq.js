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

        // Rule-based fallback when AI is unavailable
        return generateFallbackResponse(userText, riskProfile);
    }
};

/**
 * Rule-based fallback response when Groq API is unavailable
 * Provides safe, contextual responses based on detected intent
 */
const generateFallbackResponse = (userText, riskProfile = {}) => {
    const text = userText.toLowerCase();

    // Emergency phrases - always prioritize safety
    const emergencyPhrases = ['chest pain', 'เจ็บหน้าอก', 'breathe', 'หายใจไม่ออก', 'faint', 'จะเป็นลม'];
    if (emergencyPhrases.some(p => text.includes(p))) {
        return '🚨 ได้ยินอาการของคุณแล้วค่ะ! กรุณาโทร 1669 ทันที หรือไปห้องฉุกเฉินใกล้บ้านนะคะ พยาบาลจะติดต่อกลับเร็วที่สุดค่ะ';
    }

    // High risk patient - be cautious
    if (riskProfile.level === 'critical' || riskProfile.level === 'high') {
        return 'ขอบคุณที่บอกนะคะ ฮันนาได้แจ้งพยาบาลให้ทราบแล้ว จะติดต่อกลับโดยเร็วค่ะ 💚';
    }

    // Medication-related
    if (text.includes('ยา') || text.includes('กิน') || text.includes('medication')) {
        return 'อย่าลืมกินยาตรงเวลานะคะ 💊 หากมีคำถามเรื่องยา สามารถปรึกษาเภสัชกรหรือหมอของคุณได้ค่ะ';
    }

    // Glucose/sugar-related
    if (text.includes('น้ำตาล') || text.includes('glucose') || text.includes('sugar')) {
        return 'การวัดน้ำตาลสม่ำเสมอช่วยควบคุมได้ดีค่ะ 📊 หากค่าสูงหรือต่ำผิดปกติ กรุณาแจ้งหมอนะคะ';
    }

    // Feeling unwell
    if (text.includes('ไม่สบาย') || text.includes('เจ็บ') || text.includes('ปวด') || text.includes('sick')) {
        return 'เสียใจที่ไม่สบายนะคะ 😔 พักผ่อนเยอะๆ ดื่มน้ำมากๆ หากอาการไม่ดีขึ้นใน 24 ชม. ควรพบแพทย์ค่ะ';
    }

    // Positive/greetings
    if (text.includes('ดี') || text.includes('สบาย') || text.includes('good') || text.includes('fine')) {
        return 'ดีใจที่สบายดีค่ะ! 💚 ขอให้วันนี้เป็นวันที่ดีต่อไปนะคะ อย่าลืมดูแลสุขภาพ';
    }

    // Default fallback
    return 'ขอบคุณที่ส่งข้อความมาค่ะ 💚 ขณะนี้ระบบกำลังปรับปรุง หากต้องการพูดคุยกับพยาบาล กรุณากดปุ่มโทรได้เลยนะคะ';
};

module.exports = { transcribeAudio, generateChatResponse };
