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

// H5 FIX: Rate Limiting
const rateLimit = {};
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimit[ip]) {
        rateLimit[ip] = { count: 1, startTime: now };
    } else if (now - rateLimit[ip].startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimit[ip] = { count: 1, startTime: now };
    } else {
        rateLimit[ip].count++;
        if (rateLimit[ip].count > RATE_LIMIT_MAX_REQUESTS) {
            console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
            return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }
    }
    next();
};

// Apply rate limiting to API routes
app.use('/api', rateLimitMiddleware);

// Admin API Routes
app.use('/api/admin', require('./routes/admin'));

// Serve React Dashboard (Admin Panel)
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use('/dashboard', express.static(clientBuildPath));
app.use('/login', express.static(clientBuildPath)); // Handle direct login access
// Fallback for React Router (SPA) - simplified for specific routes
app.get(['/dashboard/*', '/login'], (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Logging Middleware

// N1 FIX: Cleanup stale rate limit entries every minute to prevent memory leak
setInterval(() => {
    const now = Date.now();
    let cleanedCount = 0;
    for (const ip in rateLimit) {
        if (now - rateLimit[ip].startTime > RATE_LIMIT_WINDOW_MS * 2) {
            delete rateLimit[ip];
            cleanedCount++;
        }
    }
    if (cleanedCount > 0) {
        console.log(`🧹 Cleaned ${cleanedCount} stale rate limit entries`);
    }
}, 60000);

// Logging Middleware
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// Serve Static Files (Hanna Live Frontend)
// M1 FIX: Removed duplicate static middleware (was at line 44)
app.use(express.static(path.join(__dirname, '../public')));

// JSON parsing for non-webhook routes
app.use(express.json());

// LINE Webhook (must use raw body for signature verification)
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

// Report Generation Endpoint
const reportService = require('./services/report');
app.get('/api/report/:userId', async (req, res) => {
    try {
        const pdfBuffer = await reportService.generateReport(req.params.userId);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=health_report_${req.params.userId}.pdf`,
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).send('Error generating report');
    }
});

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
