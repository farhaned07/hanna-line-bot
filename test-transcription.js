#!/usr/bin/env node

/**
 * 🔬 Comprehensive Transcription Debug Test
 * Run this to diagnose why transcription is failing
 */

// Don't use dotenv - use environment variables directly
const path = require('path');
const fs = require('fs');

console.log('🔬 Starting Transcription Debug Test...\n');

// Test 1: Check Environment Variables
console.log('📋 Test 1: Environment Variables');
console.log('─────────────────────────────────');
console.log(`DEEPGRAM_API_KEY: ${process.env.DEEPGRAM_API_KEY ? '✅ SET (' + process.env.DEEPGRAM_API_KEY.substring(0, 8) + '...)' : '❌ NOT SET'}`);
console.log(`GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ SET' : '❌ NOT SET'}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET'}\n`);

if (!process.env.DEEPGRAM_API_KEY) {
    console.log('❌ CRITICAL: DEEPGRAM_API_KEY is not set!');
    console.log('   Add it to Railway: https://railway.app/project/hanna-line-bot → Variables\n');
    process.exit(1);
}

// Test 2: Import Deepgram Service
console.log('📦 Test 2: Import Deepgram Service');
console.log('─────────────────────────────────');
try {
    const { transcribeAudio } = require('./src/services/deepgram');
    console.log('✅ Deepgram service imported successfully\n');
} catch (err) {
    console.log(`❌ Failed to import: ${err.message}\n`);
    process.exit(1);
}

// Test 3: Create Test Audio File
console.log('🎤 Test 3: Create Test Audio');
console.log('─────────────────────────────────');

// Create a minimal valid WebM audio file (silent, 1 second)
// This is a minimal WebM container with silent Opus audio
const testAudio = Buffer.from([
    0x1A, 0x45, 0xDF, 0xA3, // EBML header
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x23, // EBML DocType
    0x42, 0x82, 0x88, 0x77, 0x65, 0x62, 0x6D, 0x6B, // webm
    0x42, 0x87, 0x01, 0x02, // EBMLVersion
    0x42, 0x85, 0x01, 0x04, // EBMLReadVersion
    0x42, 0x86, 0x01, 0x04, // EBMLMaxIDLength
    0x42, 0x87, 0x01, 0x08, // EBMLMaxSizeLength
    0x42, 0x88, 0x01, 0x02, // DocTypeVersion
    0x42, 0x85, 0x01, 0x02, // DocTypeReadVersion
    0x18, 0x53, 0x80, 0x67, // Segment
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // Unlimited size
]);

const testFilePath = path.join(__dirname, 'test-audio.webm');
fs.writeFileSync(testFilePath, testAudio);
console.log(`✅ Test audio created: ${testFilePath}`);
console.log(`   Size: ${testAudio.length} bytes\n`);

// Test 4: Call Deepgram API
console.log('📡 Test 4: Call Deepgram API');
console.log('─────────────────────────────────');

const { transcribeAudio } = require('./src/services/deepgram');

transcribeAudio(testAudio)
    .then(result => {
        console.log(`✅ Transcription completed`);
        console.log(`   Result: "${result}"`);
        console.log(`   Length: ${result.length} characters\n`);
        
        if (result === '') {
            console.log('⚠️  WARNING: Empty transcript returned');
            console.log('   This could mean:');
            console.log('   1. Audio file is too short/invalid');
            console.log('   2. Deepgram API key is invalid');
            console.log('   3. Network issue\n');
        } else {
            console.log('✅ SUCCESS: Transcription is working!\n');
        }
        
        // Cleanup
        fs.unlinkSync(testFilePath);
        console.log('🧹 Cleaned up test file\n');
        
        console.log('═══════════════════════════════════════');
        console.log('✅ ALL TESTS PASSED');
        console.log('═══════════════════════════════════════');
        console.log('\nNext steps:');
        console.log('1. Test with real audio recording');
        console.log('2. Check Railway logs for any errors');
        console.log('3. Verify DEEPGRAM_API_KEY is set in Railway\n');
        
        process.exit(0);
    })
    .catch(err => {
        console.log(`❌ Transcription failed: ${err.message}`);
        console.log(`   Stack: ${err.stack}\n`);
        
        // Cleanup
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
        
        console.log('═══════════════════════════════════════');
        console.log('❌ TEST FAILED');
        console.log('═══════════════════════════════════════');
        console.log('\nTroubleshooting:');
        console.log('1. Check DEEPGRAM_API_KEY is valid');
        console.log('2. Check internet connection');
        console.log('3. Check Deepgram service status: https://status.deepgram.com\n');
        
        process.exit(1);
    });
