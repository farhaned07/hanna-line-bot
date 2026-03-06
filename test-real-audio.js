const { createClient } = require('@deepgram/sdk');

// CRITICAL FIX: Use environment variable instead of hardcoded key
const API_KEY = process.env.DEEPGRAM_API_KEY;

if (!API_KEY) {
    console.error('❌ CRITICAL: DEEPGRAM_API_KEY not set in environment variables');
    console.error('Please set DEEPGRAM_API_KEY in your .env file or Railway environment');
    process.exit(1);
}

const deepgram = createClient(API_KEY);

// Create a simple test: record 1 second of actual audio would be ideal, but let's test with a file
// For now, let's just test the API connection

async function testDeepgram() {
    console.log('Testing Deepgram API connection...');
    
    try {
        // Test with a tiny silent audio buffer
        const silentAudio = Buffer.from([
            0x1A, 0x45, 0xDF, 0xA3, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x23,
            0x42, 0x82, 0x88, 0x77, 0x65, 0x62, 0x6D, 0x6B, 0x42, 0x87, 0x01, 0x02,
            0x18, 0x53, 0x80, 0x67, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]);
        
        console.log('Sending audio to Deepgram...');
        const result = await deepgram.listen.prerecorded.transcribeFile(silentAudio, {
            model: 'nova-2',
            language: 'th',
            detect_language: true,
            smart_format: true,
            punctuate: true,
        });
        
        console.log('✅ Deepgram responded!');
        console.log('Response:', JSON.stringify(result, null, 2));
        
    } catch (err) {
        console.error('❌ Deepgram error:', err.message);
        console.error('Status:', err.status);
        console.error('Code:', err.code);
    }
}

testDeepgram();
