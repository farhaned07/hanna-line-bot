const { createClient } = require('@deepgram/sdk');

// Lazy initialization - only create client when API key is available
let deepgram = null;

const getDeepgramClient = () => {
    if (!deepgram) {
        const apiKey = process.env.DEEPGRAM_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ [Deepgram] No API key provided - transcription will be disabled');
            return null;
        }
        deepgram = createClient(apiKey);
    }
    return deepgram;
};

/**
 * 🎤 Transcribe Audio using Deepgram
 * Model: nova-2 (General) or nova-2-meeting (Medical optimized)
 * Languages: Thai (th), Bangla (bn), English (en)
 * Features:
 * - Multilingual (auto-detects Thai, Bangla, English)
 * - Medical terminology support
 * - Faster than Whisper
 * - Better accuracy for clinical terms
 */
const transcribeAudio = async (audioBuffer) => {
    try {
        console.log('🎤 [Deepgram] Transcribing audio...');

        const client = getDeepgramClient();
        if (!client) {
            console.error('❌ [Deepgram] Client not initialized - no API key');
            return '';
        }

        const result = await client.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                model: 'nova-2',
                // Support Thai, Bangla, and English with auto-detection
                language: 'th', // Primary: Thai (auto-detects others)
                alternatives: 1,
                smart_format: true,
                detect_language: true, // Auto-detect Thai/Bangla/English
                utterances: true,
                filler_words: false,
                punctuate: true,
                paragraphs: true,
                // Medical terminology optimization
                keywords: [
                    // Thai medical terms
                    'ความดัน', 'น้ำตาล', 'เบาหวาน', 'เลือด', 'หัวใจ',
                    'ไข้', 'ปวด', 'ยา', 'หมอ', 'โรงพยาบาล',
                    // Bangla medical terms
                    'রক্ত', 'চিনি', 'ডায়াবেটিস', 'ঔষধ', 'ডাক্তার',
                    // English medical terms
                    'diabetes', 'hypertension', 'blood pressure', 'glucose',
                    'medication', 'doctor', 'hospital', 'fever', 'pain'
                ],
            }
        );

        const transcript = result.result.results.channels[0]?.alternatives[0]?.transcript || '';
        
        console.log(`🎤 [Deepgram] Transcript: "${transcript}"`);
        return transcript.trim();

    } catch (error) {
        console.error('❌ [Deepgram] Transcription Error:', error.message);
        
        // Fallback: Return empty string instead of null
        // This prevents the entire flow from breaking
        return '';
    }
};

module.exports = { transcribeAudio };
