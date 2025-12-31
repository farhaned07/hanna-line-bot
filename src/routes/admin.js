const express = require('express');
const router = express.Router();
const line = require('../services/line');
const db = require('../services/db');

// AUTH MIDDLEWARE (Shared with Nurse API for simplicity)
const checkAdminAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Missing Authorization Header' });
    }
    // Use the same token as Nurse Dashboard, or a separate ADMIN_API_TOKEN
    const expected = `Bearer ${process.env.NURSE_DASHBOARD_TOKEN || process.env.ADMIN_API_TOKEN}`;
    if (token !== expected) {
        return res.status(403).json({ error: 'Invalid Token' });
    }
    next();
};

// Debug endpoint to check current image file (PUBLIC)
router.get('/debug/richmenu', (req, res) => {
    const path = require('path');
    const imagePath = path.join(__dirname, '../../assets/richmenu.png');
    res.sendFile(imagePath);
});

// Protect all other routes
router.use(checkAdminAuth);

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
