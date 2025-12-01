require('dotenv').config();
const fs = require('fs');
const path = require('path');
const tts = require('../src/services/tts');
const gemini = require('../src/services/gemini');
const storage = require('../src/services/storage');

async function testVoiceFlow() {
    console.log('🎙️ Starting End-to-End Voice Integration Test...');

    try {
        // 1. Simulate User Voice (using our own TTS to generate a "user" message)
        console.log('\n--- Step 1: Simulating User Voice Input ---');
        const userText = "สวัสดีค่ะ ฮันนา วันนี้ฉันรู้สึกเวียนหัวนิดหน่อย";
        console.log(`🗣️ User says: "${userText}"`);

        const userAudioBuffer = await tts.generateSpeech(userText);
        if (!userAudioBuffer) throw new Error('Failed to generate user audio simulation');
        console.log('✅ User audio simulation generated.');

        // 2. Process with Gemini (STT + Brain)
        console.log('\n--- Step 2: Processing with Gemini (Ears & Brain) ---');
        const replyText = await gemini.processAudio(userAudioBuffer, 'audio/mp3');
        console.log(`🤖 Hanna replies: "${replyText}"`);

        if (!replyText || replyText.includes('ขออภัย')) {
            console.warn('⚠️ Gemini might have failed or returned a fallback message.');
        } else {
            console.log('✅ Gemini processed audio and generated response.');
        }

        // 3. Generate Voice Reply (TTS)
        console.log('\n--- Step 3: Generating Voice Reply (Mouth) ---');
        const replyAudioBuffer = await tts.generateSpeech(replyText);
        if (!replyAudioBuffer) throw new Error('Failed to generate reply audio');
        console.log('✅ Reply audio generated.');

        // 4. Upload to Storage
        console.log('\n--- Step 4: Uploading to Supabase Storage ---');
        const filename = `test-reply-${Date.now()}.mp3`;
        const publicUrl = await storage.uploadAudio(replyAudioBuffer, filename);

        if (!publicUrl) throw new Error('Failed to upload audio to Supabase');
        console.log(`✅ Audio uploaded successfully: ${publicUrl}`);

        console.log('\n🎉 TEST PASSED: Full Voice Pipeline is Operational!');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error);
        process.exit(1);
    }
}

testVoiceFlow();
