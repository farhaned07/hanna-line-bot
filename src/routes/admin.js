const express = require('express');
const router = express.Router();
const line = require('../services/line');
const db = require('../services/db');

// Secure this endpoint in production! (e.g. check for a shared secret or session)
// For MVP, we assume the API is only called by the local frontend (same origin)
// or protected by network policy, but ideally add middleware.
router.post('/notify-activation', async (req, res) => {
    const { userId, name } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        await line.pushMessage(userId, {
            type: 'text',
            text: `🎉 ยินดีด้วยค่ะ คุณ${name || ''}! \n\nการชำระเงินได้รับการอนุมัติแล้ว ✅\nตอนนี้คุณสามารถใช้งานฟีเจอร์ Premium ได้เต็มรูปแบบเลยค่ะ\n\nเริ่มจากการวัดน้ำตาลวันนี้ได้เลยนะคะ 💪`
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending activation message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router;
