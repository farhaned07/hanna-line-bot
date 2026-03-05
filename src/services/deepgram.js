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
 * Features:
 * - Multilingual (Thai, English, etc.)
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
                language: 'th', // Thai (auto-detects English too)
                smart_format: true,
                detect_language: true,
                utterances: true,
                filler_words: false,
                punctuate: true,
                paragraphs: true,
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
