/**
 * Local Test Backend for Hanna Scribe
 * Mocks the production API for local testing
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'test-secret-key-for-local-development-only-32chars';

app.use(cors());
app.use(express.json());

// Mock database
const users = new Map();
const sessions = new Map();
const notes = new Map();

// Generate test user
function createUser(email) {
    const user = {
        id: `user_${Date.now()}`,
        email,
        display_name: email.split('@')[0],
        role: 'clinician',
        hospital_name: 'Test Hospital',
        plan: 'pro',
        notes_count_this_month: 0
    };
    users.set(user.id, user);
    return user;
}

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, displayName: user.display_name },
        JWT_SECRET,
        { expiresIn: '30d' }
    );
}

// Auth middleware
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// ═══════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ═══════════════════════════════════════════════════════════

app.post('/api/scribe/auth/register', (req, res) => {
    const { email, displayName } = req.body;
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    
    const user = createUser(email);
    if (displayName) {
        user.display_name = displayName;
    }
    
    const token = generateToken(user);
    
    console.log('✅ User registered:', user.email);
    res.json({ token, user });
});

app.post('/api/scribe/auth/login', (req, res) => {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Find or create user
    let user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
        user = createUser(email);
    }
    
    const token = generateToken(user);
    
    console.log('✅ User logged in:', user.email);
    res.json({ token, user });
});

// ═══════════════════════════════════════════════════════════
// BILLING ENDPOINTS
// ═══════════════════════════════════════════════════════════

app.get('/api/scribe/billing/status', authMiddleware, (req, res) => {
    const user = users.get(req.user.id);
    res.json({
        plan: user?.plan || 'free',
        notes_count: user?.notes_count_this_month || 0,
        notes_limit: 10,
        is_pro: user?.plan === 'pro',
        is_clinic: user?.plan === 'clinic'
    });
});

app.post('/api/scribe/billing/create-checkout-session', authMiddleware, (req, res) => {
    const { plan } = req.body;
    
    // Mock Stripe checkout session
    const session = {
        id: 'session_' + Date.now(),
        url: `https://checkout.stripe.com/test?plan=${plan}`,
        plan: plan || 'pro'
    };
    
    console.log('🛒 Checkout session created:', session.id);
    res.json(session);
});

// ═══════════════════════════════════════════════════════════
// SESSIONS ENDPOINTS
// ═══════════════════════════════════════════════════════════

app.get('/api/scribe/sessions', authMiddleware, (req, res) => {
    const userSessions = Array.from(sessions.values())
        .filter(s => s.user_id === req.user.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(userSessions);
});

app.post('/api/scribe/sessions', authMiddleware, (req, res) => {
    const { patient_name, hn, template_type } = req.body;
    
    const session = {
        id: `session_${Date.now()}`,
        user_id: req.user.id,
        patient_name,
        hn,
        template_type: template_type || 'soap',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    sessions.set(session.id, session);
    console.log('📝 Session created:', session.id);
    res.json(session);
});

app.get('/api/scribe/sessions/:id', authMiddleware, (req, res) => {
    const session = sessions.get(req.params.id);
    
    if (!session || session.user_id !== req.user.id) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
});

app.delete('/api/scribe/sessions/:id', authMiddleware, (req, res) => {
    const session = sessions.get(req.params.id);
    
    if (!session || session.user_id !== req.user.id) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    sessions.delete(req.params.id);
    console.log('🗑️ Session deleted:', req.params.id);
    res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════
// TRANSCRIPTION ENDPOINT (Mock)
// ═══════════════════════════════════════════════════════════

app.post('/api/scribe/transcribe', authMiddleware, (req, res) => {
    // Mock transcription - in production this would use Deepgram
    const mockTranscript = `Patient presents with chief complaint of fatigue for the past two weeks. 
    Patient reports difficulty sleeping and decreased appetite. 
    No fever, cough, or shortness of breath. 
    Past medical history significant for hypertension and type 2 diabetes. 
    Current medications include lisinopril 10mg daily and metformin 500mg twice daily. 
    Patient denies any allergies. 
    Social history: non-smoker, occasional alcohol use. 
    Family history: mother with diabetes, father with heart disease.`;
    
    console.log('🎤 Transcription completed');
    res.json({
        transcript: mockTranscript,
        language: 'en',
        duration: 45,
        confidence: 0.95
    });
});

// ═══════════════════════════════════════════════════════════
// NOTE GENERATION ENDPOINT (Mock)
// ═══════════════════════════════════════════════════════════

app.post('/api/scribe/sessions/:sessionId/generate-note', authMiddleware, (req, res) => {
    const { templateType } = req.body;
    
    // Mock SOAP note generation
    const note = {
        id: `note_${Date.now()}`,
        session_id: req.params.sessionId,
        user_id: req.user.id,
        template_type: templateType || 'soap',
        status: 'draft',
        subjective: 'Patient presents with chief complaint of fatigue for the past two weeks. Reports difficulty sleeping and decreased appetite. No fever, cough, or shortness of breath.',
        objective: 'Vital signs: BP 138/86, HR 78, Temp 98.6°F, RR 16. General: appears tired but alert. HEENT: normal. Cardiovascular: regular rate and rhythm. Respiratory: clear to auscultation.',
        assessment: 'Fatigue, unspecified. Rule out anemia, thyroid disorder, or depression. Poor sleep hygiene contributing to symptoms.',
        plan: '1. Order CBC, TSH, comprehensive metabolic panel\n2. Sleep hygiene education\n3. Follow-up in 2 weeks to review labs\n4. Return if symptoms worsen',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    notes.set(note.id, note);
    console.log('📄 Note generated:', note.id);
    res.json(note);
});

// ═══════════════════════════════════════════════════════════
// NOTES ENDPOINTS
// ═══════════════════════════════════════════════════════════

app.get('/api/scribe/notes', authMiddleware, (req, res) => {
    const userNotes = Array.from(notes.values())
        .filter(n => n.user_id === req.user.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(userNotes);
});

app.get('/api/scribe/notes/:id', authMiddleware, (req, res) => {
    const note = notes.get(req.params.id);
    
    if (!note || note.user_id !== req.user.id) {
        return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
});

app.patch('/api/scribe/notes/:id', authMiddleware, (req, res) => {
    const note = notes.get(req.params.id);
    
    if (!note || note.user_id !== req.user.id) {
        return res.status(404).json({ error: 'Note not found' });
    }
    
    const updates = req.body;
    Object.assign(note, updates, { updated_at: new Date().toISOString() });
    notes.set(req.params.id, note);
    
    console.log('✏️ Note updated:', req.params.id);
    res.json(note);
});

app.post('/api/scribe/notes/:id/finalize', authMiddleware, (req, res) => {
    const note = notes.get(req.params.id);
    
    if (!note || note.user_id !== req.user.id) {
        return res.status(404).json({ error: 'Note not found' });
    }
    
    note.status = 'finalized';
    note.finalized_at = new Date().toISOString();
    notes.set(req.params.id, note);
    
    console.log('✅ Note finalized:', req.params.id);
    res.json(note);
});

// ═══════════════════════════════════════════════════════════
// AI COMMANDS (Mock)
// ═══════════════════════════════════════════════════════════

app.post('/api/scribe/notes/:noteId/regenerate-section', authMiddleware, (req, res) => {
    const { section } = req.body;
    
    const mockSections = {
        subjective: 'Patient reports improvement in energy levels. Sleep quality has improved with better sleep hygiene. Appetite returning to normal.',
        objective: 'Vital signs stable. BP 132/82, HR 72. Patient appears more alert and engaged.',
        assessment: 'Improving fatigue. Sleep hygiene interventions effective. Continue monitoring.',
        plan: '1. Continue current medications\n2. Maintain sleep hygiene practices\n3. Follow-up in 4 weeks or PRN'
    };
    
    res.json({
        [section]: mockSections[section] || 'Generated content'
    });
});

app.post('/api/scribe/notes/:noteId/hanna-command', authMiddleware, (req, res) => {
    const { command, currentContent } = req.body;
    
    // Mock AI command responses
    const responses = {
        'make concise': currentContent?.substring(0, 100) + '...',
        'expand': currentContent + ' Additional details: Patient tolerating interventions well.',
        'fix grammar': currentContent, // Would use AI in production
        'add vitals': currentContent + '\n\nVitals: BP 132/82, HR 72, Temp 98.6°F, RR 16, SpO2 98%'
    };
    
    res.json({
        result: responses[command] || currentContent
    });
});

// ═══════════════════════════════════════════════════════════
// EXPORT ENDPOINTS (Mock)
// ═══════════════════════════════════════════════════════════

app.get('/api/scribe/export/:noteId', authMiddleware, (req, res) => {
    const note = notes.get(req.params.id);
    
    if (!note || note.user_id !== req.user.id) {
        return res.status(404).json({ error: 'Note not found' });
    }
    
    const { format } = req.query;
    
    if (format === 'pdf') {
        // Mock PDF response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="note-${note.id}.pdf"`);
        res.send(Buffer.from('%PDF-1.4 Mock PDF')); // Not a real PDF
    } else {
        // Text format
        const text = `
SOAP Note
=========
Patient: ${note.session_id}
Date: ${note.created_at}

SUBJECTIVE:
${note.subjective}

OBJECTIVE:
${note.objective}

ASSESSMENT:
${note.assessment}

PLAN:
${note.plan}
        `.trim();
        
        res.setHeader('Content-Type', 'text/plain');
        res.send(text);
    }
});

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏥 HANNA SCRIBE - LOCAL TEST BACKEND                    ║
║                                                           ║
║   Server running: http://localhost:${PORT}                ║
║                                                           ║
║   Test Credentials:                                       ║
║   - Any valid email format                                ║
║   - No password required (passwordless auth)              ║
║                                                           ║
║   Mock Features:                                          ║
║   ✅ Authentication (register/login)                      ║
║   ✅ Session management                                   ║
║   ✅ Note generation                                      ║
║   ✅ Note editing & finalization                          ║
║   ✅ AI commands (mock)                                   ║
║   ✅ Export (mock PDF)                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
