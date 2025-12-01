const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

router.post('/', async (req, res) => {
    try {
        console.log('Received voice request');

        // 1. Get Audio Data (Expect base64 or binary in body)
        // For MVP, we assume client sends JSON with { audio: "base64..." }
        // In production, use multer for multipart/form-data
        const { audio } = req.body;

        if (!audio) {
            return res.status(400).json({ error: 'No audio data provided' });
        }

        // 2. Process with Gemini (Multimodal)
        // We send the audio directly to Gemini 2.0 Flash
        const result = await model.generateContent([
            "Listen to this audio and respond as Hanna, a caring AI nurse. Keep it short (1-2 sentences). Respond in Thai.",
            {
                inlineData: {
                    mimeType: "audio/wav", // Adjust based on client recording format
                    data: audio
                }
            }
        ]);

        const responseText = result.response.text();
        console.log('Gemini Response:', responseText);

        // 3. Generate TTS (Text-to-Speech)
        // TODO: Integrate Google Cloud TTS or similar here.
        // For now, we return the text and a mock audio URL.

        // Mock Audio for testing frontend playback
        const mockAudioUrl = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

        // 4. Determine Emotion (Simple keyword matching for MVP)
        let emotion = 'neutral';
        if (responseText.includes('?')) emotion = 'listening';
        if (responseText.includes('ดี') || responseText.includes('เยี่ยม')) emotion = 'happy';
        if (responseText.includes('เสียใจ') || responseText.includes('แย่')) emotion = 'sad';

        res.json({
            text: responseText,
            audioUrl: mockAudioUrl, // Replace with real TTS url later
            emotion: emotion
        });

    } catch (error) {
        console.error('Voice processing error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
