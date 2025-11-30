require('dotenv').config();
const fetch = require('node-fetch');
const crypto = require('crypto');
const db = require('../src/services/db');

const BASE_URL = process.env.BASE_URL || 'https://hanna-line-bot-production.up.railway.app';
const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const TEST_USER_ID = 'U_SIMULATED_TEST_' + Date.now();

// Helper to sign the body
const sign = (body) => {
    return crypto
        .createHmac('SHA256', CHANNEL_SECRET)
        .update(JSON.stringify(body))
        .digest('base64');
};

async function simulateJourney() {
    console.log(`🚀 Starting End-to-End Simulation`);
    console.log(`target: ${BASE_URL}`);
    console.log(`user_id: ${TEST_USER_ID}`);

    // 1. Simulate Follow Event
    console.log('\n1️⃣ Simulating FOLLOW Event...');
    const followBody = {
        destination: 'U_BOT',
        events: [{
            type: 'follow',
            webhookEventId: 'SIMULATED_ID',
            deliveryContext: { isRedelivery: false },
            timestamp: Date.now(),
            source: { type: 'user', userId: TEST_USER_ID },
            replyToken: 'SIMULATED_REPLY_TOKEN',
            mode: 'active'
        }]
    };

    try {
        const res = await fetch(`${BASE_URL}/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-line-signature': sign(followBody)
            },
            body: JSON.stringify(followBody)
        });

        if (res.ok) {
            console.log('✅ Webhook accepted request (200 OK)');
        } else {
            console.error(`❌ Webhook failed: ${res.status} ${res.statusText}`);
            process.exit(1);
        }

        // 2. Verify Database
        console.log('\n2️⃣ Verifying Database Persistence...');
        // Give it a moment to write
        await new Promise(r => setTimeout(r, 2000));

        const result = await db.query('SELECT * FROM chronic_patients WHERE line_user_id = $1', [TEST_USER_ID]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log('✅ User found in DB!');
            console.log(`   - Name: ${user.name || '(Not set)'}`);
            console.log(`   - Status: ${user.enrollment_status}`);
            console.log(`   - Step: ${user.onboarding_step}`);

            if (user.enrollment_status === 'onboarding') {
                console.log('🎉 SUCCESS: Onboarding flow initialized correctly in DB.');
            } else {
                console.warn('⚠️ User found but status unexpected.');
            }
        } else {
            console.error('❌ User NOT found in DB. The webhook worked but data was not saved.');
        }

    } catch (error) {
        console.error('❌ Simulation Failed:', error);
    } finally {
        // Cleanup
        console.log('\n🧹 Cleaning up test data...');
        await db.query('DELETE FROM chronic_patients WHERE line_user_id = $1', [TEST_USER_ID]);
        console.log('✅ Cleanup complete.');
        process.exit();
    }
}

simulateJourney();
