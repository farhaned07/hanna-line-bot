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

        // Use Deepgram's multilingual model with auto-detection
        // nova-2-general automatically detects from 30+ languages including Thai, Bangla, English
        const result = await client.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                model: 'nova-2',
                // Enable multilingual detection - removes language bias
                language: null, // Let Deepgram auto-detect (supports 30+ languages)
                detect_language: true, // Enable language detection
                
                // Alternative: Specify multiple languages for better detection
                // This tells Deepgram to expect Thai, Bangla, or English
                multilingual: true, // Enable multilingual mode
                
                alternatives: 1,
                smart_format: true,
                utterances: true,
                filler_words: false,
                punctuate: true,
                paragraphs: true,
                diarize: false, // Not needed for medical notes
                
                // Medical terminology optimization for all three languages
                keywords: [
                    // Thai medical terms (20 common terms)
                    'ความดัน', 'น้ำตาล', 'เบาหวาน', 'เลือด', 'หัวใจ',
                    'ไข้', 'ปวด', 'ยา', 'หมอ', 'โรงพยาบาล',
                    'พาราเซตามอล', 'อินซูลิน', 'เมตฟอร์มิน', 'กลูโคส',
                    'ไต', 'ตับ', 'ปอด', 'กระเพาะ', 'ลำไส้', 'สมอง',
                    
                    // Bangla medical terms (20 common terms)
                    'রক্ত', 'চিনি', 'ডায়াবেটিস', 'ঔষধ', 'ডাক্তার',
                    'হাসপাতাল', 'জ্বর', 'ব্যথা', 'ইনসুলিন', 'মেটফরমিন',
                    'প্যারাসিটামল', 'গ্লুকোজ', 'কিডনি', 'লিভার', 'ফুসফুস',
                    'হৃদরোগ', 'উচ্চ রক্তচাপ', 'মাথাব্যথা', 'বমি', 'সর্দি',
                    
                    // English medical terms (20 common terms)
                    'diabetes', 'hypertension', 'blood pressure', 'glucose',
                    'medication', 'doctor', 'hospital', 'fever', 'pain',
                    'paracetamol', 'insulin', 'metformin', 'kidney', 'liver',
                    'heart', 'lung', 'stomach', 'headache', 'nausea', 'prescription'
                ],
                
                // Boost accuracy for medical terms
                boost: [
                    'diabetes', 'hypertension', 'glucose', 'insulin',
                    'เบาหวาน', 'ความดัน', 'น้ำตาล',
                    'ডায়াবেটিস', 'রক্ত', 'চিনি'
                ],
            }
        );

        console.log('🎤 [Deepgram] Raw response:', JSON.stringify(result, null, 2).substring(0, 500));

        const transcript = result.result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
        
        console.log(`🎤 [Deepgram] Transcript: "${transcript}"`);
        return transcript.trim();

    } catch (error) {
        console.error('❌ [Deepgram] Transcription Error:', error.message);
        console.error('❌ [Deepgram] Error details:', JSON.stringify(error, null, 2));
        
        // Check for specific error types
        if (error.message.includes('corrupt or unsupported')) {
            console.error('❌ [Deepgram] Audio format issue - expected WebM/MP4 with Opus codec');
        } else if (error.message.includes('400')) {
            console.error('❌ [Deepgram] Bad Request - check audio format and API key');
        } else if (error.message.includes('401')) {
            console.error('❌ [Deepgram] Authentication failed - check API key');
        }
        
        // Fallback: Return empty string instead of null
        // This prevents the entire flow from breaking
        return '';
    }
};

module.exports = { transcribeAudio };
