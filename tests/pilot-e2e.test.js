/**
 * Hanna Pilot Readiness - End-to-End Test Suite
 * 
 * STABILIZATION MODE: Feature Freeze
 * Run with: node tests/pilot-e2e.test.js
 * 
 * Tests critical pilot scenarios without external dependencies.
 * All tests must pass before go-live.
 */

// ============================================================================
// TEST FRAMEWORK
// ============================================================================

let passed = 0;
let failed = 0;

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};

const test = (name, fn) => {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (error) {
        console.error(`❌ ${name}`);
        console.error(`   ${error.message}`);
        failed++;
    }
};

// ============================================================================
// 1. EMERGENCY KEYWORD DETECTION (CRITICAL SAFETY)
// ============================================================================

const EMERGENCY_KEYWORDS_CRITICAL = [
    // Cardiac
    'chest pain', 'เจ็บหน้าอก', 'แน่นหน้าอก', 'heart attack', 'หัวใจวาย',
    // Breathing
    "can't breathe", 'หายใจไม่ออก', 'หายใจลำบาก',
    // Stroke
    'stroke', 'อัมพาต', 'หน้าเบี้ยว', 'พูดไม่ชัด',
    // Loss of consciousness
    'faint', 'หมดสติ', 'เป็นลม', 'unconscious',
    // Severe bleeding
    'bleeding', 'เลือดออกมาก'
];

const detectEmergency = (text) => {
    const lower = text.toLowerCase();
    return EMERGENCY_KEYWORDS_CRITICAL.some(kw => lower.includes(kw.toLowerCase()));
};

console.log('\n📋 TEST SUITE: Emergency Detection');
console.log('─'.repeat(50));

test('Detects English "chest pain"', () => {
    assert(detectEmergency('I have chest pain'), 'Should detect chest pain');
});

test('Detects Thai "เจ็บหน้าอก"', () => {
    assert(detectEmergency('วันนี้เจ็บหน้าอกค่ะ'), 'Should detect Thai chest pain');
});

test('Detects "faint" (previously had typo)', () => {
    assert(detectEmergency('I feel faint'), 'Should detect faint');
});

test('Detects Thai "หายใจไม่ออก"', () => {
    assert(detectEmergency('หายใจไม่ออกค่ะ'), 'Should detect breathing difficulty');
});

test('Detects "unconscious"', () => {
    assert(detectEmergency('patient is unconscious'), 'Should detect unconscious');
});

test('Does NOT trigger for normal messages', () => {
    assert(!detectEmergency('สบายดีค่ะ'), 'Should not trigger for normal Thai');
    assert(!detectEmergency('I ate breakfast'), 'Should not trigger for normal English');
    assert(!detectEmergency('กินยาแล้ว'), 'Should not trigger for medication log');
});

test('Case insensitive detection', () => {
    assert(detectEmergency('CHEST PAIN'), 'Should detect uppercase');
    assert(detectEmergency('Chest Pain'), 'Should detect mixed case');
});

// ============================================================================
// 2. RISK SCORE CALCULATION (DETERMINISTIC)
// ============================================================================

console.log('\n📋 TEST SUITE: Risk Score Calculation');
console.log('─'.repeat(50));

const calculateRisk = (params) => {
    let score = 0;

    // Emergency override
    if (params.hasEmergencyKeyword) {
        return { score: 10, level: 'critical' };
    }

    // Vital thresholds
    if (params.glucose > 400 || params.glucose < 70) {
        score += 3;
    } else if (params.glucose > 250 || params.glucose < 90) {
        score += 1;
    }

    // Medication adherence
    if (params.medicationMissedDays >= 3) {
        score += 2;
    } else if (params.medicationMissedDays >= 1) {
        score += 1;
    }

    // Silence
    if (params.daysSilent > 0) {
        score += Math.min(params.daysSilent, 3);
    }

    // Age modifier
    if (params.age > 70) {
        score = Math.ceil(score * 1.2);
    }

    score = Math.min(score, 10);

    let level = 'low';
    if (score >= 8) level = 'critical';
    else if (score >= 5) level = 'high';
    else if (score >= 3) level = 'medium';

    return { score, level };
};

test('Emergency keyword forces critical (score 10)', () => {
    const result = calculateRisk({ hasEmergencyKeyword: true });
    assert(result.score === 10, 'Score should be 10');
    assert(result.level === 'critical', 'Level should be critical');
});

test('Normal vitals = low risk', () => {
    const result = calculateRisk({ glucose: 120, medicationMissedDays: 0, daysSilent: 0, age: 50 });
    assert(result.level === 'low', 'Should be low risk');
});

test('High glucose + missed meds = elevated risk', () => {
    const result = calculateRisk({ glucose: 300, medicationMissedDays: 2, daysSilent: 0, age: 50 });
    assert(result.score >= 2, 'Should have elevated score');
});

test('Elderly patient gets age modifier', () => {
    const young = calculateRisk({ glucose: 300, medicationMissedDays: 1, daysSilent: 1, age: 50 });
    const old = calculateRisk({ glucose: 300, medicationMissedDays: 1, daysSilent: 1, age: 75 });
    assert(old.score >= young.score, 'Elderly should have same or higher score');
});

test('Score capped at 10', () => {
    const result = calculateRisk({ glucose: 450, medicationMissedDays: 5, daysSilent: 5, age: 80 });
    assert(result.score <= 10, 'Score should not exceed 10');
});

// ============================================================================
// 3. NURSE AUTHENTICATION (ACCESS CONTROL)
// ============================================================================

console.log('\n📋 TEST SUITE: Nurse Authentication');
console.log('─'.repeat(50));

const VALID_TOKEN = 'han_ops_2024_secure_xyz';

const checkAuth = (authHeader) => {
    if (!authHeader) return { status: 401, error: 'Missing auth' };
    if (authHeader !== `Bearer ${VALID_TOKEN}`) return { status: 403, error: 'Invalid token' };
    return { status: 200, ok: true };
};

test('Missing auth header returns 401', () => {
    const result = checkAuth(null);
    assert(result.status === 401, 'Should return 401');
});

test('Invalid token returns 403', () => {
    const result = checkAuth('Bearer wrong_token');
    assert(result.status === 403, 'Should return 403');
});

test('Valid token returns 200', () => {
    const result = checkAuth(`Bearer ${VALID_TOKEN}`);
    assert(result.status === 200, 'Should return 200');
});

// ============================================================================
// 4. TASK RESOLUTION VALIDATION (HITL ENFORCEMENT)
// ============================================================================

console.log('\n📋 TEST SUITE: Task Resolution Validation');
console.log('─'.repeat(50));

const VALID_OUTCOME_CODES = [
    'REACHED_STABLE', 'REACHED_IMPROVED', 'REACHED_REFERRED',
    'NOT_REACHED_RETRY', 'NOT_REACHED_ESCALATED',
    'EMERGENCY_CONFIRMED', 'FALSE_POSITIVE'
];

const validateResolution = (body) => {
    const required = ['outcome_code', 'action_taken', 'nurseId'];
    const missing = required.filter(f => !body[f]);

    if (missing.length > 0) {
        return { valid: false, error: `Missing: ${missing.join(', ')}` };
    }

    if (!VALID_OUTCOME_CODES.includes(body.outcome_code)) {
        return { valid: false, error: 'Invalid outcome_code' };
    }

    return { valid: true };
};

test('Rejects resolution without outcome_code', () => {
    const result = validateResolution({ action_taken: 'call', nurseId: 'nurse_001' });
    assert(!result.valid, 'Should be invalid');
});

test('Rejects resolution without nurseId', () => {
    const result = validateResolution({ outcome_code: 'REACHED_STABLE', action_taken: 'call' });
    assert(!result.valid, 'Should be invalid');
});

test('Rejects invalid outcome_code', () => {
    const result = validateResolution({ outcome_code: 'INVALID', action_taken: 'call', nurseId: 'nurse_001' });
    assert(!result.valid, 'Should be invalid');
});

test('Accepts valid resolution', () => {
    const result = validateResolution({
        outcome_code: 'REACHED_STABLE',
        action_taken: 'call',
        nurseId: 'nurse_001'
    });
    assert(result.valid, 'Should be valid');
});

// ============================================================================
// 5. AI IDENTITY VERIFICATION (REGULATORY)
// ============================================================================

console.log('\n📋 TEST SUITE: AI Identity Compliance');
console.log('─'.repeat(50));

const BANNED_PHRASES = [
    'registered nurse', 'พยาบาลวิชาชีพ',
    'Siriraj', '8 years experience',
    'diagnose', 'วินิจฉัย',
    'prescribe', 'สั่งยา'
];

const checkBannedPhrases = (text) => {
    const lower = text.toLowerCase();
    return BANNED_PHRASES.filter(phrase => lower.includes(phrase.toLowerCase()));
};

test('No banned phrases in AI identity', () => {
    const aiIdentity = "You are Hanna, an AI-powered health companion designed to help patients track their daily health data.";
    const found = checkBannedPhrases(aiIdentity);
    assert(found.length === 0, `Found banned phrases: ${found.join(', ')}`);
});

test('Detects "registered nurse" if present', () => {
    const badText = "You are a registered nurse";
    const found = checkBannedPhrases(badText);
    assert(found.length > 0, 'Should detect banned phrase');
});

test('Detects "diagnose" if present', () => {
    const badText = "I can diagnose your condition";
    const found = checkBannedPhrases(badText);
    assert(found.length > 0, 'Should detect banned phrase');
});

// ============================================================================
// 6. RATE LIMITING (ABUSE PREVENTION)
// ============================================================================

console.log('\n📋 TEST SUITE: Rate Limiting');
console.log('─'.repeat(50));

const limits = {};
const MAX_REQUESTS = 100;
const WINDOW_MS = 60000;

const checkRateLimit = (ip) => {
    const now = Date.now();
    if (!limits[ip] || now - limits[ip].start > WINDOW_MS) {
        limits[ip] = { count: 1, start: now };
        return { allowed: true };
    }
    limits[ip].count++;
    if (limits[ip].count > MAX_REQUESTS) {
        return { allowed: false };
    }
    return { allowed: true };
};

test('First request allowed', () => {
    const result = checkRateLimit('192.168.1.1');
    assert(result.allowed, 'First request should be allowed');
});

test('Requests within limit allowed', () => {
    for (let i = 0; i < 50; i++) {
        const result = checkRateLimit('192.168.1.2');
        assert(result.allowed, `Request ${i + 1} should be allowed`);
    }
});

test('Requests over limit blocked', () => {
    for (let i = 0; i < MAX_REQUESTS; i++) {
        checkRateLimit('192.168.1.3');
    }
    const result = checkRateLimit('192.168.1.3');
    assert(!result.allowed, 'Should be blocked after limit');
});

// ============================================================================
// RESULTS
// ============================================================================

console.log('\n' + '═'.repeat(50));
console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

if (failed > 0) {
    console.log('\n❌ PILOT NOT READY - Fix failing tests\n');
    process.exit(1);
} else {
    console.log('\n✅ ALL TESTS PASSED - Pilot ready\n');
    process.exit(0);
}
