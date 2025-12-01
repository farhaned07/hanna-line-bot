require('dotenv').config();
const dns = require('dns');
// Force IPv4 to avoid ENETUNREACH errors on Railway/Supabase
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const { middleware } = require('@line/bot-sdk');
const { handleEvent } = require('./handlers/webhook');
const { config } = require('./config');
const { initScheduler } = require('./scheduler');

const app = express();

// Logging Middleware
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// Serve Static Files (Hanna Live Frontend)
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));


// LINE Webhook
app.post('/webhook', middleware(config.line), (req, res) => {
    console.log('Webhook received events:', JSON.stringify(req.body.events));
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// Enable CORS for LIFF
const cors = require('cors');
app.use(cors());

// Voice API endpoint for LIFF audio processing
app.post('/api/chat/voice', express.json({ limit: '10mb' }), require('./routes/voice'));


// Health check
app.get('/health', async (req, res) => {
    try {
        const db = require('./services/db');
        await db.query('SELECT 1');
        res.send('OK');
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).send('Database Error');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
    initScheduler();
});
