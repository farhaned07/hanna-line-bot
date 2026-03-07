const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 4173;
const DIST_DIR = path.join(__dirname, 'dist');
const API_HOST = 'hanna-line-bot-production.up.railway.app';

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function handleRequest(req, res) {
    console.log(`${req.method} ${req.url}`);

    // API Proxy
    if (req.url.startsWith('/api/')) {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            proxyApi(req, res, body);
        });
        return;
    }

    // SPA Routing
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    if (req.url.startsWith('/scribe/app/') && !fs.existsSync(filePath)) {
        filePath = path.join(DIST_DIR, 'scribe/app/index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, content2) => {
                    if (err2) {
                        res.writeHead(404);
                        res.end('Not Found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content2, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

function proxyApi(req, res, body) {
    const options = {
        hostname: API_HOST,
        port: 443,
        path: req.url,
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body || '')
        }
    };

    const proxyReq = https.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => { data += chunk; });
        proxyRes.on('end', () => {
            try {
                const json = JSON.parse(data);
                res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(json));
            } catch (e) {
                res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    });

    proxyReq.on('error', (e) => {
        console.error('Proxy error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API proxy failed', message: e.message }));
    });

    if (body) {
        proxyReq.write(body);
    }
    proxyReq.end();
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
    console.log(`\n📍 URLs:`);
    console.log(`   Landing: http://localhost:${PORT}/`);
    console.log(`   Scribe:  http://localhost:${PORT}/scribe/app/`);
    console.log(`\n🧪 Test Login:`);
    console.log(`   Email: doctor@hospital.com`);
    console.log(`   (any access key)`);
    console.log('');
});
