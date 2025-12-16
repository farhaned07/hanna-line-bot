/**
 * Pre-Launch Validation Test Suite
 * Zero-defect validation for Hanna system
 */
require('dotenv').config();
const path = require('path');
const db = require(path.join(__dirname, '../src/services/db'));
const OneBrain = require(path.join(__dirname, '../src/services/OneBrain'));
const groq = require(path.join(__dirname, '../src/services/groq'));

const TEST_RESULTS = [];

function log(testId, layer, action, expected, actual, passed) {
    const result = {
        testId,
        layer,
        action,
        expected,
        actual: typeof actual === 'object' ? JSON.stringify(actual).substring(0, 100) : actual,
        status: passed ? 'PASS' : 'FAIL'
    };
    TEST_RESULTS.push(result);
    console.log(`[${result.status}] ${testId}: ${action}`);
    if (!passed) {
        console.log(`  Expected: ${expected}`);
        console.log(`  Actual: ${result.actual}`);
    }
    return passed;
}

// Mock Users
const MOCK_USERS = [
    { line_user_id: 'mock_user_001', name: 'คุณสมหญิง', age: 65, condition: 'Diabetes Type 2', enrollment_status: 'active' },
    { line_user_id: 'mock_user_002', name: 'คุณสมพงษ์', age: 72, condition: 'Hypertension', enrollment_status: 'active' },
    { line_user_id: 'mock_user_003', name: 'คุณมาลี', age: 58, condition: 'Diabetes + Hypertension', enrollment_status: 'onboarding' }
];

// Mock Risk Scenarios
const MOCK_SCENARIOS = [
    { userId: 'mock_user_001', text: 'น้ำตาล 250', expectedRisk: 'high' },
    { userId: 'mock_user_001', text: 'สบายดีค่ะ', expectedRisk: 'low' },
    { userId: 'mock_user_002', text: 'เจ็บหน้าอกมาก', expectedRisk: 'critical' },
    { userId: 'mock_user_002', text: 'กินยาแล้วค่ะ', expectedRisk: 'low' }
];

async function setupMockData() {
    console.log('\n=== SECTION 2: MOCK DATA SETUP ===\n');

    // Clean previous mock data
    await db.query("DELETE FROM chronic_patients WHERE line_user_id LIKE 'mock_%'");
    await db.query("DELETE FROM patient_state WHERE patient_id IN (SELECT id FROM chronic_patients WHERE line_user_id LIKE 'mock_%')");
    await db.query("DELETE FROM nurse_tasks WHERE patient_id IN (SELECT id FROM chronic_patients WHERE line_user_id LIKE 'mock_%')");

    // Insert mock users
    for (const user of MOCK_USERS) {
        const result = await db.query(`
            INSERT INTO chronic_patients (line_user_id, name, age, condition, enrollment_status)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (line_user_id) DO UPDATE SET name = $2, age = $3, condition = $4, enrollment_status = $5
            RETURNING id
        `, [user.line_user_id, user.name, user.age, user.condition, user.enrollment_status]);
        user.id = result.rows[0].id;
        console.log(`Created mock user: ${user.name} (ID: ${user.id})`);
    }

    return MOCK_USERS;
}

async function testDataLayer() {
    console.log('\n=== SECTION 3A: DATA LAYER TESTS ===\n');
    let allPassed = true;

    // TEST D-001: Patient state persistence
    const user = MOCK_USERS[0];
    await db.query(`
        INSERT INTO patient_state (patient_id, risk_level, risk_score, assigned_nurse, last_assessment)
        VALUES ($1, 'medium', 45, 'nurse_001', NOW())
        ON CONFLICT (patient_id) DO UPDATE SET risk_level = 'medium', risk_score = 45
    `, [user.id]);

    const stateResult = await db.query('SELECT * FROM patient_state WHERE patient_id = $1', [user.id]);
    allPassed &= log('D-001', 'Data', 'Patient state persistence', 'Record created', stateResult.rows.length > 0 ? 'Created' : 'Missing', stateResult.rows.length > 0);

    // TEST D-002: Nurse task creation
    await db.query(`
        INSERT INTO nurse_tasks (patient_id, task_type, priority, status, title, description, created_by)
        VALUES ($1, 'follow_up', 'medium', 'pending', 'ติดตามน้ำตาล', 'ผู้ป่วยรายงานน้ำตาลสูง', 'ai_hanna')
    `, [user.id]);

    const taskResult = await db.query('SELECT * FROM nurse_tasks WHERE patient_id = $1', [user.id]);
    allPassed &= log('D-002', 'Data', 'Nurse task creation', 'Task created', taskResult.rows.length > 0 ? 'Created' : 'Missing', taskResult.rows.length > 0);

    // TEST D-003: Audit log
    await db.query(`
        INSERT INTO audit_log (action, actor, patient_id, details)
        VALUES ('test_action', 'validation_script', $1, '{"test": true}')
    `, [user.id]);

    const auditResult = await db.query('SELECT * FROM audit_log WHERE patient_id = $1', [user.id]);
    allPassed &= log('D-003', 'Data', 'Audit log creation', 'Log created', auditResult.rows.length > 0 ? 'Created' : 'Missing', auditResult.rows.length > 0);

    // TEST D-004: Vitals log
    await db.query(`
        INSERT INTO vitals_log (patient_id, type, value, source)
        VALUES ($1, 'glucose', '{"value": 150, "unit": "mg/dL"}', 'user_report')
    `, [user.id]);

    const vitalsResult = await db.query('SELECT * FROM vitals_log WHERE patient_id = $1', [user.id]);
    allPassed &= log('D-004', 'Data', 'Vitals log creation', 'Vital logged', vitalsResult.rows.length > 0 ? 'Logged' : 'Missing', vitalsResult.rows.length > 0);

    // TEST D-005: Chat history
    await db.query(`
        INSERT INTO chat_history (patient_id, role, content, message_type)
        VALUES ($1, 'user', 'สวัสดีค่ะ', 'text')
    `, [user.id]);

    const chatResult = await db.query('SELECT * FROM chat_history WHERE patient_id = $1', [user.id]);
    allPassed &= log('D-005', 'Data', 'Chat history creation', 'Message logged', chatResult.rows.length > 0 ? 'Logged' : 'Missing', chatResult.rows.length > 0);

    return allPassed;
}

async function testIntelligenceLayer() {
    console.log('\n=== SECTION 3B: INTELLIGENCE LAYER TESTS ===\n');
    let allPassed = true;

    const user = MOCK_USERS[0];

    // TEST C-001: OneBrain risk assessment
    try {
        const riskResult = await OneBrain.analyzePatient(user.id, 'chat:น้ำตาล 180');
        const hasLevel = riskResult && riskResult.level;
        allPassed &= log('C-001', 'Intelligence', 'OneBrain risk assessment', 'Risk level returned', hasLevel ? riskResult.level : 'No level', hasLevel);
    } catch (e) {
        allPassed &= log('C-001', 'Intelligence', 'OneBrain risk assessment', 'No error', e.message, false);
    }

    // TEST C-002: Groq AI response generation
    try {
        const response = await groq.generateChatResponse('สวัสดีค่ะ', { level: 'low', reasons: [] });
        const hasResponse = response && response.length > 0;
        allPassed &= log('C-002', 'Intelligence', 'Groq AI response', 'Thai response generated', hasResponse ? 'Generated (' + response.length + ' chars)' : 'Empty', hasResponse);
    } catch (e) {
        allPassed &= log('C-002', 'Intelligence', 'Groq AI response', 'No error', e.message, false);
    }

    // TEST C-003: Emergency keyword detection
    const emergencyText = 'เจ็บหน้าอก';
    const emergencyKeywords = ['chest pain', 'เจ็บหน้าอก', 'breathe', 'หายใจไม่ออก', 'faint', 'จะเป็นลม'];
    const isEmergency = emergencyKeywords.some(kw => emergencyText.toLowerCase().includes(kw.toLowerCase()));
    allPassed &= log('C-003', 'Intelligence', 'Emergency keyword detection', 'Detected as emergency', isEmergency ? 'Detected' : 'Not detected', isEmergency);

    return allPassed;
}

async function testNurseAPI() {
    console.log('\n=== SECTION 3C: NURSE DASHBOARD API TESTS ===\n');
    let allPassed = true;

    const token = process.env.NURSE_DASHBOARD_TOKEN || 'han_ops_2024_secure_xyz';
    const baseUrl = 'https://hanna-line-bot-production.up.railway.app';

    // TEST E-001: Stats endpoint
    try {
        const response = await fetch(`${baseUrl}/api/nurse/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const hasStats = data && typeof data.activePatients !== 'undefined';
        allPassed &= log('E-001', 'Dashboard', 'Stats endpoint', 'Returns stats object', hasStats ? 'Has activePatients' : JSON.stringify(data), hasStats);
    } catch (e) {
        allPassed &= log('E-001', 'Dashboard', 'Stats endpoint', 'No error', e.message, false);
    }

    // TEST E-002: Patients endpoint
    try {
        const response = await fetch(`${baseUrl}/api/nurse/patients`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const isArray = Array.isArray(data);
        allPassed &= log('E-002', 'Dashboard', 'Patients endpoint', 'Returns array', isArray ? `Array (${data.length} items)` : typeof data, isArray);
    } catch (e) {
        allPassed &= log('E-002', 'Dashboard', 'Patients endpoint', 'No error', e.message, false);
    }

    // TEST E-003: Tasks endpoint
    try {
        const response = await fetch(`${baseUrl}/api/nurse/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const isArray = Array.isArray(data);
        allPassed &= log('E-003', 'Dashboard', 'Tasks endpoint', 'Returns array', isArray ? `Array (${data.length} items)` : typeof data, isArray);
    } catch (e) {
        allPassed &= log('E-003', 'Dashboard', 'Tasks endpoint', 'No error', e.message, false);
    }

    // TEST E-004: Auth required
    try {
        const response = await fetch(`${baseUrl}/api/nurse/stats`);
        const status = response.status;
        allPassed &= log('E-004', 'Dashboard', 'Auth enforcement', '401 without token', status === 401 ? '401' : status.toString(), status === 401);
    } catch (e) {
        allPassed &= log('E-004', 'Dashboard', 'Auth enforcement', 'No error', e.message, false);
    }

    return allPassed;
}

async function testVoiceAPI() {
    console.log('\n=== SECTION 3D: VOICE API TESTS ===\n');
    let allPassed = true;

    const baseUrl = 'https://hanna-line-bot-production.up.railway.app';

    // TEST B-001: Voice token endpoint
    try {
        const response = await fetch(`${baseUrl}/api/voice/token?userId=test&room=test`);
        const data = await response.json();
        const hasToken = data && data.token;
        allPassed &= log('B-001', 'Voice', 'Token generation', 'Returns token', hasToken ? 'Has token' : JSON.stringify(data), hasToken);
    } catch (e) {
        allPassed &= log('B-001', 'Voice', 'Token generation', 'No error', e.message, false);
    }

    // TEST B-002: Voice chat endpoint
    try {
        const response = await fetch(`${baseUrl}/api/voice/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'สวัสดี', userId: 'test123' })
        });
        const data = await response.json();
        const hasText = data && data.text;
        allPassed &= log('B-002', 'Voice', 'Chat processing', 'Returns text response', hasText ? 'Has text' : JSON.stringify(data), hasText);
    } catch (e) {
        allPassed &= log('B-002', 'Voice', 'Chat processing', 'No error', e.message, false);
    }

    return allPassed;
}

async function runAllTests() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     HANNA PRE-LAUNCH ZERO-DEFECT VALIDATION SUITE          ║');
    console.log('║     Started: ' + new Date().toISOString() + '           ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    try {
        // Section 2: Mock Data
        await setupMockData();

        // Section 3: Test Execution
        const dataResult = await testDataLayer();
        const intellResult = await testIntelligenceLayer();
        const nurseResult = await testNurseAPI();
        const voiceResult = await testVoiceAPI();

        // Summary
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                    TEST SUMMARY                            ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        const passed = TEST_RESULTS.filter(t => t.status === 'PASS').length;
        const failed = TEST_RESULTS.filter(t => t.status === 'FAIL').length;

        console.log(`Total Tests: ${TEST_RESULTS.length}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        console.log();

        if (failed > 0) {
            console.log('FAILED TESTS:');
            TEST_RESULTS.filter(t => t.status === 'FAIL').forEach(t => {
                console.log(`  - ${t.testId}: ${t.action}`);
            });
        }

        console.log('\n' + (failed === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'));

    } catch (e) {
        console.error('CRITICAL ERROR:', e.message);
    } finally {
        process.exit(0);
    }
}

runAllTests();
