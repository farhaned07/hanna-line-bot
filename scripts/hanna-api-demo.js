'use strict';

/**
 * Synthetic API product demo. Runs ONLY on 127.0.0.1. No LINE/hospital calls.
 * Start: node scripts/hanna-api-demo.js
 * Browse: http://127.0.0.1:4178
 */
if (process.env.NODE_ENV === 'production') {
    throw new Error('Synthetic demo server is intentionally unavailable in production mode');
}

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { createDemoApi } = require('../src/agentic/demoApi');
const { createInterSystemsFhirAdapter } = require('../src/agentic/intersystemsFhirAdapter');
const hasFhirSettings = !!process.env.HANNA_IRIS_FHIR_URL;
const fhirAdapter = hasFhirSettings ? createInterSystemsFhirAdapter({
    baseUrl: process.env.HANNA_IRIS_FHIR_URL,
    username: process.env.HANNA_IRIS_USER,
    password: process.env.HANNA_IRIS_PASSWORD
}) : null;
const api = createDemoApi({ fhirAdapter });
const HOST = '127.0.0.1';
const PORT = Number(process.env.HANNA_DEMO_PORT || 4178);
const MAX_BODY_BYTES = 16384;

const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    try {
        const pathname = new URL(req.url, 'http://localhost').pathname;
        if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fs.readFileSync(path.join(__dirname, '../demo/hanna-api/index.html')));
            return;
        }
        if (!pathname.startsWith('/v1/')) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
            return;
        }
        let body = {};
        if (req.method === 'POST') {
            if (!String(req.headers['content-type'] || '').startsWith('application/json')) {
                res.writeHead(415, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'application/json required' }));
                return;
            }
            let raw = '';
            for await (const chunk of req) {
                raw += chunk;
                if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
                    res.writeHead(413, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Payload too large' }));
                    return;
                }
            }
            try { body = JSON.parse(raw || '{}'); }
            catch (_) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Malformed JSON' }));
                return;
            }
        }
        const result = await api.handle({ method: req.method, path: pathname, body });
        res.writeHead(result.status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result.body));
    } catch (error) {
        console.error('[SYNTHETIC DEMO] Request failed:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Demo request failed' }));
    }
});
server.listen(PORT, HOST, () => {
    console.log('Hanna Care Intelligence · SYNTHETIC DEMO ONLY');
    console.log('Open http://' + HOST + ':' + PORT);
    console.log('Bound to loopback. No PHI or live LINE sends.');
    console.log(hasFhirSettings ? 'InterSystems FHIR adapter configured for local synthetic IRIS.' : 'InterSystems FHIR: not configured; use the optional hackathon kit setup.');
});
