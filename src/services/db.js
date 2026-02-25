const { Pool } = require('pg');

// ─── In-Memory MockDB for Demo Mode ───
const now = new Date();
const hourAgo = new Date(now - 3600000);
const twoHoursAgo = new Date(now - 7200000);
const yesterday = new Date(now - 86400000);

const MOCK_DATA = {
    clinicians: [
        { id: 1, email: 'demo@hanna.care', display_name: 'Dr. Somchai', pin_hash: '', role: 'nurse', hospital_name: 'Demo Hospital', created_at: yesterday }
    ],
    scribe_sessions: [
        { id: 1, clinician_id: 1, patient_name: 'คุณสมชาย ใจดี', patient_hn: '64-001234', template_type: 'soap', transcript: 'Patient Somchai presents with fever 38.5C for 2 days, headache, body aches. No cough or rhinorrhea. Vitals stable.', status: 'noted', audio_duration_seconds: 180, created_at: twoHoursAgo, updated_at: twoHoursAgo },
        { id: 2, clinician_id: 1, patient_name: 'คุณวิชัย สุขใจ', patient_hn: '64-005678', template_type: 'soap', transcript: 'Patient Wichai, DM follow-up. HbA1c 7.2, fasting glucose 145. Currently on metformin 500mg bid. No hypoglycemic episodes.', status: 'noted', audio_duration_seconds: 240, created_at: hourAgo, updated_at: hourAgo },
        { id: 3, clinician_id: 1, patient_name: 'คุณนารี รักชาติ', patient_hn: '64-009012', template_type: 'soap', transcript: 'Patient Naree, BP 160/95. Uncontrolled hypertension despite amlodipine 5mg. Needs urgent review.', status: 'noted', audio_duration_seconds: 120, created_at: new Date(now - 1800000), updated_at: new Date(now - 1800000) },
        { id: 4, clinician_id: 1, patient_name: 'คุณกานดา สุขสันต์', patient_hn: '64-003456', template_type: 'progress', transcript: 'Post-op day 2 appendectomy. Tolerating diet, passed flatus. Wound clean. Planning discharge tomorrow.', status: 'noted', audio_duration_seconds: 90, created_at: yesterday, updated_at: yesterday }
    ],
    scribe_notes: [
        {
            id: 1, session_id: 1, clinician_id: 1, template_type: 'soap', is_final: true, finalized_at: twoHoursAgo,
            content: {
                subjective: 'ผู้ป่วยมาด้วยอาการไข้ 2 วัน ปวดศีรษะ ปวดเมื่อยตามตัว ไม่มีอาการไอ ไม่มีน้ำมูก\nPatient presents with 2-day history of fever, headache, and body aches. Denies cough, rhinorrhea, or diarrhea.',
                objective: 'T 38.5°C, BP 120/78 mmHg, HR 88 bpm, RR 18/min, SpO2 98% RA\nPE: Alert, oriented. Pharynx mildly injected. No tonsillar exudate. Lungs clear. Abdomen soft.',
                assessment: '1. Acute febrile illness — likely viral URI\n2. Dehydration — mild',
                plan: '1. Paracetamol 500mg q6h PRN fever\n2. ORS 1 pack tid\n3. Rest, increase fluid intake\n4. F/U in 3 days if not improving\n5. Return immediately if fever >39°C'
            },
            content_text: 'SOAP Note for คุณสมชาย ใจดี', created_at: twoHoursAgo, updated_at: twoHoursAgo
        },
        {
            id: 2, session_id: 2, clinician_id: 1, template_type: 'soap', is_final: true, finalized_at: hourAgo,
            content: {
                subjective: 'DM follow-up. ไม่มี hypoglycemic episodes. ควบคุมอาหารได้บ้าง\nPatient reports good compliance with medication. No hypoglycemic episodes. Diet partially controlled.',
                objective: 'BP 128/82 mmHg, HR 76 bpm. BMI 26.4\nLab: HbA1c 7.2%, FPG 145 mg/dL, Cr 0.9 mg/dL',
                assessment: '1. Type 2 DM — suboptimal control (HbA1c 7.2%)\n2. Overweight',
                plan: '1. Continue metformin 500mg bid\n2. Add glipizide 5mg OD before breakfast\n3. Dietary counseling referral\n4. Recheck HbA1c in 3 months'
            },
            content_text: 'SOAP Note for คุณวิชัย สุขใจ', created_at: hourAgo, updated_at: hourAgo
        },
        {
            id: 3, session_id: 3, clinician_id: 1, template_type: 'soap', is_final: false, finalized_at: null,
            content: {
                subjective: 'ผู้ป่วยมาตรวจ BP สูง ปวดศีรษะเล็กน้อย ไม่มีอาการตามัว ไม่มีอาการเจ็บหน้าอก\nPatient presents for hypertension follow-up. Mild headache. No visual changes or chest pain.',
                objective: 'BP 160/95 mmHg (repeated 155/92), HR 80 bpm\nPE: No papilledema. Heart S1S2 normal. No peripheral edema.',
                assessment: '1. Uncontrolled essential hypertension\n2. Needs medication adjustment — URGENT',
                plan: '1. Increase amlodipine 5mg → 10mg OD\n2. Add losartan 50mg OD\n3. Low-sodium diet counseling\n4. Recheck BP in 1 week\n5. Urgent MD review if BP >180/110'
            },
            content_text: 'SOAP Note for คุณนารี รักชาติ', created_at: new Date(now - 1800000), updated_at: new Date(now - 1800000)
        },
        {
            id: 4, session_id: 4, clinician_id: 1, template_type: 'progress', is_final: true, finalized_at: yesterday,
            content: {
                subjective: 'Post-op day 2 appendectomy. ผู้ป่วยทานอาหารได้ ผายลมแล้ว ปวดแผลน้อยลง\nPatient tolerating regular diet. Passed flatus. Pain improving.',
                objective: 'T 37.1°C, BP 118/70, HR 72. Wound clean, dry, no erythema. Bowel sounds active.',
                assessment: '1. Post-appendectomy — recovering well\n2. Suitable for discharge',
                plan: '1. Remove drain\n2. Discharge tomorrow with paracetamol PRN\n3. Wound care instructions\n4. F/U in 7 days for wound check'
            },
            content_text: 'Progress Note for คุณกานดา สุขสันต์', created_at: yesterday, updated_at: yesterday
        }
    ],
    scribe_templates: [
        { id: 1, name: 'S.O.A.P.', template_type: 'soap', description: 'Standard SOAP note', prompt_template: '', fields: {} },
        { id: 2, name: 'Progress Note', template_type: 'progress', description: 'Progress note', prompt_template: '', fields: {} },
        { id: 3, name: 'Free Text', template_type: 'free', description: 'Free text note', prompt_template: '', fields: {} }
    ]
};

let mockIdCounter = 100;
const nextId = () => mockIdCounter++;

function createMockDB() {
    console.log('📋 [MockDB] Running in demo mode — no database required');

    return {
        query: async (text, params = []) => {
            const q = text.replace(/\s+/g, ' ').trim();

            // ── Auth: Register ──
            if (q.startsWith('INSERT INTO clinicians')) {
                const [email, displayName, pinHash, role, hospitalName] = params;
                const existing = MOCK_DATA.clinicians.find(c => c.email === email);
                if (existing) { const err = new Error('Duplicate'); err.code = '23505'; throw err; }
                const user = { id: nextId(), email, display_name: displayName, pin_hash: pinHash, role, hospital_name: hospitalName, created_at: new Date() };
                MOCK_DATA.clinicians.push(user);
                return { rows: [user] };
            }

            // ── Auth: Login ──
            if (q.includes('FROM clinicians WHERE email')) {
                const [email, pinHash] = params;
                const user = MOCK_DATA.clinicians.find(c => c.email === email && c.pin_hash === pinHash);
                return { rows: user ? [user] : [] };
            }

            // ── Sessions: Create ──
            if (q.startsWith('INSERT INTO scribe_sessions')) {
                const [clinicianId, patientName, patientHn, templateType] = params;
                const session = {
                    id: nextId(), clinician_id: clinicianId, patient_name: patientName, patient_hn: patientHn,
                    template_type: templateType, transcript: null, status: 'created',
                    audio_duration_seconds: 0, created_at: new Date(), updated_at: new Date()
                };
                MOCK_DATA.scribe_sessions.push(session);
                return { rows: [session] };
            }

            // ── Sessions: List ──
            if (q.includes('FROM scribe_sessions s') && q.includes('LEFT JOIN scribe_notes')) {
                const [clinicianId] = params;
                const sessions = MOCK_DATA.scribe_sessions
                    .filter(s => s.clinician_id == clinicianId)
                    .sort((a, b) => b.created_at - a.created_at);
                return {
                    rows: sessions.map(s => {
                        const notes = MOCK_DATA.scribe_notes.filter(n => n.session_id == s.id);
                        return { ...s, notes: notes.map(n => ({ id: n.id, template_type: n.template_type, is_final: n.is_final, created_at: n.created_at })) };
                    })
                };
            }

            // ── Sessions: Get by ID ──
            if (q.includes('FROM scribe_sessions WHERE id')) {
                const [id, clinicianId] = params;
                const session = MOCK_DATA.scribe_sessions.find(s => s.id == id && s.clinician_id == clinicianId);
                return { rows: session ? [session] : [] };
            }

            // ── Sessions: Update status to 'noted' ──
            if (q.includes('UPDATE scribe_sessions SET status') && q.includes("'noted'")) {
                const [id] = params;
                const s = MOCK_DATA.scribe_sessions.find(s => s.id == id);
                if (s) { s.status = 'noted'; s.updated_at = new Date(); }
                return { rows: s ? [s] : [] };
            }

            // ── Sessions: Patch (transcript, status, etc.) ──
            if (q.startsWith('UPDATE scribe_sessions SET')) {
                // Last two params are always [id, clinicianId]
                const id = params[params.length - 2];
                const clinicianId = params[params.length - 1];
                const session = MOCK_DATA.scribe_sessions.find(s => s.id == id && s.clinician_id == clinicianId);
                if (session) {
                    // Match field params by position
                    const fieldParams = params.slice(0, -2);
                    if (q.includes('transcript')) session.transcript = fieldParams[0];
                    const statusIdx = fieldParams.findIndex(p => ['transcribed', 'noted', 'recording'].includes(p));
                    if (statusIdx >= 0) session.status = fieldParams[statusIdx];
                    if (q.includes('audio_duration_seconds')) {
                        const dur = fieldParams.find(p => typeof p === 'number');
                        if (dur !== undefined) session.audio_duration_seconds = dur;
                    }
                    session.updated_at = new Date();
                    return { rows: [session] };
                }
                return { rows: [] };
            }

            // ── Templates ──
            if (q.includes('FROM scribe_templates')) {
                if (params.length > 0) {
                    const [type] = params;
                    const tmpl = MOCK_DATA.scribe_templates.find(t => t.template_type === type);
                    return { rows: tmpl ? [tmpl] : [] };
                }
                return { rows: MOCK_DATA.scribe_templates };
            }

            // ── Notes: Create ──
            if (q.startsWith('INSERT INTO scribe_notes')) {
                const [sessionId, clinicianId, templateType, content, contentText] = params;
                const note = {
                    id: nextId(), session_id: sessionId, clinician_id: clinicianId,
                    template_type: templateType,
                    content: typeof content === 'string' ? JSON.parse(content) : content,
                    content_text: contentText,
                    is_final: false, finalized_at: null,
                    created_at: new Date(), updated_at: new Date()
                };
                MOCK_DATA.scribe_notes.push(note);
                return { rows: [note] };
            }

            // ── Notes: Finalize ──
            if (q.startsWith('UPDATE scribe_notes') && q.includes('is_final = true')) {
                const [id, clinicianId] = params;
                const note = MOCK_DATA.scribe_notes.find(n => n.id == id && n.clinician_id == clinicianId);
                if (note) {
                    note.is_final = true;
                    note.finalized_at = new Date();
                    note.updated_at = new Date();
                    return { rows: [note] };
                }
                return { rows: [] };
            }

            // ── Notes: Content Update ──
            if (q.startsWith('UPDATE scribe_notes')) {
                const [content, contentText, id, clinicianId] = params;
                const note = MOCK_DATA.scribe_notes.find(n => n.id == id && n.clinician_id == clinicianId);
                if (note) {
                    if (content) note.content = typeof content === 'string' ? JSON.parse(content) : content;
                    if (contentText) note.content_text = contentText;
                    note.updated_at = new Date();
                    return { rows: [note] };
                }
                return { rows: [] };
            }

            // ── Notes: Get with session join ──
            if (q.includes('FROM scribe_notes n') && q.includes('WHERE n.id = $1')) {
                const [id, clinicianId] = params;
                const note = MOCK_DATA.scribe_notes.find(n => n.id == id && n.clinician_id == clinicianId);
                if (note) {
                    const s = MOCK_DATA.scribe_sessions.find(ses => ses.id == note.session_id);
                    return { rows: [{ ...note, patient_name: s?.patient_name, patient_hn: s?.patient_hn, transcript: s?.transcript }] };
                }
                return { rows: [] };
            }

            // ── Notes: List ──
            if (q.includes('FROM scribe_notes n') && q.includes('ORDER BY n.created_at')) {
                const [clinicianId] = params;
                const notes = MOCK_DATA.scribe_notes.filter(n => n.clinician_id == clinicianId);
                return {
                    rows: notes.map(n => {
                        const s = MOCK_DATA.scribe_sessions.find(ses => ses.id == n.session_id);
                        return { ...n, patient_name: s?.patient_name, patient_hn: s?.patient_hn };
                    })
                };
            }

            // ── Handover: Today's notes ──
            if (q.includes('n.created_at >= CURRENT_DATE')) {
                const [clinicianId] = params;
                const notes = MOCK_DATA.scribe_notes.filter(n => n.clinician_id == clinicianId);
                return {
                    rows: notes.map(n => {
                        const s = MOCK_DATA.scribe_sessions.find(ses => ses.id == n.session_id);
                        return { ...n, patient_name: s?.patient_name, patient_hn: s?.patient_hn, audio_duration_seconds: s?.audio_duration_seconds || 0 };
                    })
                };
            }

            // ── Fallback ──
            console.warn('⚠️ [MockDB] Unhandled query:', q.substring(0, 120));
            return { rows: [] };
        },
        pool: null
    };
}

// ─── Real PostgreSQL Connection ───
function createRealDB() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    pool.on('connect', () => console.log('✅ Connected to PostgreSQL'));
    pool.on('error', (err) => console.error('❌ DB error:', err.message));

    return {
        query: (text, params) => pool.query(text, params),
        pool
    };
}

// ─── Auto-detect: try real DB, fall back to mock ───
let db;

if (!process.env.DATABASE_URL) {
    db = createMockDB();
} else {
    // Try connecting. If it fails within 5s, switch to mock.
    const realDB = createRealDB();
    db = realDB;

    // Test connection asynchronously
    realDB.query('SELECT 1').then(() => {
        console.log('✅ Database connection verified');
    }).catch((err) => {
        console.warn(`⚠️ Database unreachable (${err.code || err.message}) — switching to MockDB`);
        const mock = createMockDB();
        db.query = mock.query;
        db.pool = null;
    });
}

module.exports = db;
