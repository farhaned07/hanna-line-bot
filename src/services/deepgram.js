const { createClient } = require('@deepgram/sdk');

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

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

        const result = await deepgram.listen.prerecorded.transcribeFile(
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
