const express = require('express');
const router = express.Router();
const livekitService = require('../services/livekitService');
const voiceAgent = require('../worker/agent');

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
        res.status(500).json({ error: "Failed to generate token" });
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
