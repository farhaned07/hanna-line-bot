const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const tts = require('../services/tts');
const storage = require('../services/storage');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

router.post('/', async (req, res) => {
    try {
        console.log('Received voice request');

        // 1. Get Audio Data (Expect base64 or binary in body)
        const { audio } = req.body;

        if (!audio) {
            return res.status(400).json({ error: 'No audio data provided' });
        }

        // 2. Process with Gemini (Multimodal)
        const result = await model.generateContent([
            "Listen to this audio and respond as Hanna, a caring AI nurse. Keep it short (1-2 sentences). Respond in Thai.",
            {
                inlineData: {
                    mimeType: "audio/wav",
                    data: audio
                }
            }
        ]);

        const responseText = result.response.text();
        console.log('Gemini Response:', responseText);

        // 3. C6 FIX: Generate real TTS audio instead of mock URL
        let audioUrl = null;

        try {
            const speechBuffer = await tts.generateSpeech(responseText);

            if (speechBuffer) {
                // Upload to Supabase for public URL
                const filename = `voice-response-${Date.now()}.mp3`;
                audioUrl = await storage.uploadAudio(speechBuffer, filename);
            }
        } catch (ttsError) {
            console.error('TTS generation failed:', ttsError);
            // Continue without audio - text response is still valid
        }

        // 4. Determine Emotion (Simple keyword matching for MVP)
        let emotion = 'neutral';
        if (responseText.includes('?')) emotion = 'listening';
        if (responseText.includes('ดี') || responseText.includes('เยี่ยม')) emotion = 'happy';
        if (responseText.includes('เสียใจ') || responseText.includes('แย่')) emotion = 'sad';

        res.json({
            text: responseText,
            audioUrl: audioUrl, // Real TTS URL (or null if failed)
            emotion: emotion
        });

    } catch (error) {
        console.error('Voice processing error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
