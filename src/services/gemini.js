const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Process audio buffer with Gemini to get a response
 * @param {Buffer} audioBuffer - The audio file buffer
 * @param {string} mimeType - MIME type of the audio (e.g., 'audio/mp3', 'audio/m4a')
 * @returns {Promise<string>} - The text response from Hanna
 */
const processAudio = async (audioBuffer, mimeType = 'audio/mp3') => {
    try {
        console.log('🤖 Sending audio to Gemini...');

        // Convert buffer to base64 for Gemini API
        const audioBase64 = audioBuffer.toString('base64');

        const prompt = `
        You are Hanna, a caring and empathetic AI nurse assistant for chronic disease patients in Thailand.
        
        A patient has sent you a voice message. 
        1. Listen to their message carefully.
        2. Reply in Thai (unless they speak English).
        3. Keep your response warm, encouraging, and concise (suitable for a chat message).
        4. If they report symptoms, show concern and advise seeing a doctor if needed.
        5. If they are just checking in, be friendly.
        
        Reply ONLY with the text of your response. Do not add "Hanna:" or other prefixes.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: mimeType,
                    data: audioBase64
                }
            }
        ]);

        const response = result.response;
        const text = response.text();

        console.log('🤖 Gemini Response:', text);
        return text;

    } catch (error) {
        console.error('❌ Error processing audio with Gemini:', error);
        return "ขออภัยค่ะ ฮันนาได้ยินไม่ค่อยชัด รบกวนพูดอีกครั้งหรือพิมพ์ข้อความมาแทนได้ไหมคะ? 😓";
    }
};

module.exports = { processAudio };
