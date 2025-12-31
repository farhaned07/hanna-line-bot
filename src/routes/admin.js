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
    const imagePath = path.join(__dirname, '../../assets/richmenu.jpg');
    res.sendFile(imagePath);
});

// Force Setup Rich Menu (Web Trigger)
router.get('/force-setup-richmenu', async (req, res) => {
    const secret = req.query.secret;
    const expectedSecret = process.env.ADMIN_SECRET || 'CHANGE_ME_IN_PRODUCTION';

    if (secret !== expectedSecret) {
        return res.status(403).json({ error: 'Invalid Secret' });
    }

    try {
        const { createRichMenu, setDefaultRichMenu, listRichMenus, deleteRichMenu, uploadRichMenuImage, unlinkDefaultRichMenu } = require('../services/richMenu');
        const { generateRichMenuImage } = require('../utils/imageGenerator');
        const path = require('path');

        // 1. Unlink
        await unlinkDefaultRichMenu().catch(e => console.warn('Unlink failed:', e.message));

        // 2. Cleanup old
        const existing = await listRichMenus();
        for (const menu of existing) {
            await deleteRichMenu(menu.richMenuId);
        }

        // 3. Generate Image Path (Static Asset)
        // ensure generator uses correct logic (it does now)
        const imagePath = generateRichMenuImage();

        // 4. Create & Upload
        const richMenuId = await createRichMenu();
        await uploadRichMenuImage(richMenuId, imagePath);
        await setDefaultRichMenu(richMenuId);

        res.json({ success: true, message: 'Rich Menu Force Setup Complete', richMenuId });
    } catch (error) {
        console.error('Force setup failed:', error);
        res.status(500).json({ error: error.message });
    }
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
