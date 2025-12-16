const express = require('express');
const router = express.Router();
const livekitService = require('../services/livekitService');
const voiceAgent = require('../worker/agent');

// Simple per-IP rate limiting for voice API
const voiceRateLimits = {};
const VOICE_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const VOICE_RATE_LIMIT_MAX = 10; // 10 requests per minute

const voiceRateLimiter = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!voiceRateLimits[ip] || now - voiceRateLimits[ip].start > VOICE_RATE_LIMIT_WINDOW) {
        voiceRateLimits[ip] = { count: 1, start: now };
    } else {
        voiceRateLimits[ip].count++;
        if (voiceRateLimits[ip].count > VOICE_RATE_LIMIT_MAX) {
            console.warn(`⚠️ Voice API rate limit exceeded for IP: ${ip}`);
            return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }
    }
    next();
};

// Apply rate limiting to all voice routes
router.use(voiceRateLimiter);

// Debug endpoint to check LIVEKIT config
router.get('/debug', (req, res) => {
    res.json({
        LIVEKIT_URL: process.env.LIVEKIT_URL ? 'SET (' + process.env.LIVEKIT_URL.substring(0, 20) + '...)' : 'NOT SET',
        LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY ? 'SET' : 'NOT SET',
        LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET ? 'SET' : 'NOT SET',
        nodeEnv: process.env.NODE_ENV
    });
});

// GET /api/voice/token?userId=X&room=Y
router.get('/token', async (req, res) => {
    try {
        const userId = req.query.userId || 'guest';
        const roomName = req.query.room || 'consultation-room';
        const token = await livekitService.generateToken(userId, roomName);
        const wsUrl = livekitService.getWsUrl();
        res.json({ token, wsUrl });
    } catch (err) {
        console.error("Token Gen Error:", err);
        res.status(500).json({ error: "Failed to generate token", details: err.message });
    }
});

// POST /api/voice/chat { text, userId }
router.post('/chat', async (req, res) => {
    try {
        const { text, userId } = req.body;
        const result = await voiceAgent.processVoiceQuery(text, userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Agent Error" });
    }
});

module.exports = router;
