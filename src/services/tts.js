const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

// Initialize TTS Client
// Expects GOOGLE_APPLICATION_CREDENTIALS env var to be set to path of JSON key file
let client = null;

try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        client = new textToSpeech.TextToSpeechClient();
    } else {
        console.warn('⚠️ GOOGLE_APPLICATION_CREDENTIALS missing. TTS disabled.');
    }
} catch (error) {
    console.error('❌ Failed to initialize Google TTS:', error.message);
}

/**
 * Generate speech from text using Google Cloud TTS
 * @param {string} text - The text to convert to speech
 * @returns {Promise<Buffer>} - The audio buffer (MP3)
 */
const generateSpeech = async (text) => {
    if (!client) {
        console.warn('⚠️ Skipping TTS: Client not initialized.');
        return null;
    }

    try {
        console.log('🗣️ Generating speech...');

        const request = {
            input: { text: text },
            // Select the language and SSML voice gender (optional)
            voice: { languageCode: 'th-TH', ssmlGender: 'FEMALE' },
            // select the type of audio encoding
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);

        console.log('🗣️ Speech generated successfully');
        return response.audioContent;

    } catch (error) {
        console.error('❌ Error generating speech:', error);
        return null;
    }
};

module.exports = { generateSpeech };
