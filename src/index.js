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
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for LIFF
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// Serve Static Files (Hanna Live Frontend)
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
const http = require('http');
const WebSocket = require('ws');
const GeminiLiveService = require('./services/geminiLive');

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server for Gemini Live
const wss = new WebSocket.Server({
    server,
    path: '/api/voice/live'
});

// Initialize Gemini Live service
const geminiLive = new GeminiLiveService(process.env.GEMINI_API_KEY);

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection for Gemini Live');

    // Extract userId from query string or generate one
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId') || `user_${Date.now()}`;

    // Create Gemini Live session
    geminiLive.createSession(userId, ws);
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`WebSocket endpoint: ws://localhost:${port}/api/voice/live`);
    initScheduler();
});
