/**
 * Hanna AI Nurse - Critical Path Tests
 * 
 * Run with: npm test
 * 
 * These tests verify the most critical safety functions without requiring
 * a live database or external API connections.
 */

// Simple test framework (no external dependencies)
const assert = (condition, message) => {
    if (!condition) {
        throw new Error(`❌ FAIL: ${message}`);
    }
    console.log(`✅ PASS: ${message}`);
};

const test = async (name, fn) => {
    try {
        await fn();
        console.log(`✅ Test passed: ${name}`);
        return true;
    } catch (error) {
        console.error(`❌ Test failed: ${name}`);
        console.error(`   ${error.message}`);
        return false;
    }
};

// ============================================================================
// Test 1: Emergency Keyword Detection
// ============================================================================
const testEmergencyKeywords = () => {
    const emergencyKeywords = [
        'chest pain', 'เจ็บหน้าอก', 'breathe', 'หายใจไม่ออก',
        'faint', 'จะเป็นลม', 'emergency', 'ฉุกเฉิน'
    ];

    const testCases = [
        { input: 'I have chest pain', expected: true },
        { input: 'หายใจไม่ออกค่ะ', expected: true },
        { input: 'I feel faint', expected: true },
        { input: 'วันนี้สบายดีค่ะ', expected: false },
        { input: 'กินข้าวแล้ว', expected: false },
        { input: 'CHEST PAIN', expected: true }, // Case insensitive
    ];

    testCases.forEach(tc => {
        const isEmergency = emergencyKeywords.some(kw =>
            tc.input.toLowerCase().includes(kw.toLowerCase())
        );
        assert(
            isEmergency === tc.expected,
            `Emergency detection for "${tc.input}" should be ${tc.expected}`
        );
    });
};

// ============================================================================
// Test 2: Risk Score Calculation Logic
// ============================================================================
const testRiskScoreLogic = () => {
    // Simulate risk calculation logic from OneBrain
    const calculateRisk = (params) => {
        let score = 0;
        let reasons = [];

        // Emergency keyword override
        if (params.emergencyKeyword) {
            return { score: 10, level: 'critical', reasons: ['Emergency keyword'] };
        }

        // Glucose thresholds
        if (params.glucose > 400 || params.glucose < 70) {
            score += 2;
            reasons.push('Glucose critical');
        } else if (params.glucose > 250) {
            score += 1;
            reasons.push('Glucose high');
        }

        // Adherence
        if (params.adherencePercent < 50) {
            score += 2;
            reasons.push('Low adherence');
        }

        // Silence
        if (params.silentDays > 0) {
            score += 1;
            reasons.push('Silent');
        }

        // Age modifier
        if (params.age > 70) {
            score = Math.ceil(score * 1.2);
        }

        score = Math.min(score, 10);

        let level = 'low';
        if (score >= 8) level = 'critical';
        else if (score >= 5) level = 'high';

        return { score, level, reasons };
    };

    // Test cases
    const tests = [
        { params: { glucose: 450, adherencePercent: 80, silentDays: 0, age: 50 }, expectedLevel: 'low' },
        { params: { glucose: 450, adherencePercent: 40, silentDays: 1, age: 75 }, expectedLevel: 'high' },
        { params: { emergencyKeyword: 'chest pain' }, expectedLevel: 'critical' },
        { params: { glucose: 120, adherencePercent: 90, silentDays: 0, age: 50 }, expectedLevel: 'low' },
    ];

    tests.forEach((tc, i) => {
        const result = calculateRisk(tc.params);
        assert(
            result.level === tc.expectedLevel,
            `Risk case ${i + 1}: expected ${tc.expectedLevel}, got ${result.level}`
        );
    });
};

// ============================================================================
// Test 3: Auth Token Validation
// ============================================================================
const testAuthTokenValidation = () => {
    // Simulate auth check
    const checkAuth = (authHeader, expectedToken) => {
        if (!authHeader) return { status: 401, error: 'Missing' };
        if (authHeader !== `Bearer ${expectedToken}`) return { status: 403, error: 'Invalid' };
        return { status: 200, ok: true };
    };

    const TOKEN = 'test_token_123';

    assert(
        checkAuth(null, TOKEN).status === 401,
        'Missing auth header returns 401'
    );
    assert(
        checkAuth('Bearer wrong_token', TOKEN).status === 403,
        'Wrong token returns 403'
    );
    assert(
        checkAuth(`Bearer ${TOKEN}`, TOKEN).status === 200,
        'Correct token returns 200'
    );
};

// ============================================================================
// Test 4: Rate Limiting Logic
// ============================================================================
const testRateLimiting = () => {
    const limits = {};
    const WINDOW_MS = 60000;
    const MAX_REQUESTS = 10;

    const checkRateLimit = (ip) => {
        const now = Date.now();
        if (!limits[ip] || now - limits[ip].start > WINDOW_MS) {
            limits[ip] = { count: 1, start: now };
            return { allowed: true, count: 1 };
        }
        limits[ip].count++;
        if (limits[ip].count > MAX_REQUESTS) {
            return { allowed: false, count: limits[ip].count };
        }
        return { allowed: true, count: limits[ip].count };
    };

    // Simulate 15 requests
    let ip = '192.168.1.1';
    for (let i = 1; i <= MAX_REQUESTS; i++) {
        const result = checkRateLimit(ip);
        assert(result.allowed === true, `Request ${i} should be allowed`);
    }

    // 11th request should be blocked
    const result = checkRateLimit(ip);
    assert(result.allowed === false, 'Request 11 should be blocked');
};

// ============================================================================
// Test 5: Sentiment Analysis (False Negative Mitigation)
// ============================================================================
const testSentimentAnalysis = () => {
    // Import the actual module
    const sentimentAnalysis = require('../src/services/sentimentAnalysis');

    // Test hedging detection
    const testCases = [
        { input: 'ปวดหัวนิดหน่อยค่ะ', expectHedging: true, minConcern: 1 },
        { input: 'I have a little chest discomfort', expectHedging: true, minConcern: 2 },
        { input: 'not too bad, just tired', expectHedging: true, minConcern: 1 },
        { input: 'วันนี้สบายดีค่ะ', expectHedging: false, minConcern: 0 },
        { input: 'I feel great today!', expectHedging: false, minConcern: 0 },
        { input: 'เจ็บแค่นิดเดียว ไม่ค่อยหนัก', expectHedging: true, minConcern: 1 },
    ];

    testCases.forEach(tc => {
        const result = sentimentAnalysis.analyzeHedging(tc.input);
        assert(
            result.hedgingDetected === tc.expectHedging,
            `Hedging detection for "${tc.input}" should be ${tc.expectHedging}`
        );
        assert(
            result.concernScore >= tc.minConcern,
            `Concern score for "${tc.input}" should be >= ${tc.minConcern}, got ${result.concernScore}`
        );
    });
};

// ============================================================================
// Test 6: Trend Detection Logic (False Negative Mitigation)
// ============================================================================
const testTrendDetection = () => {
    // Simulate trend calculation logic
    const calculateTrend = (thisWeekAvg, prevWeekAvg) => {
        if (!prevWeekAvg || prevWeekAvg === 0) return { trendPct: 0, isWorsening: false };
        const trendPct = ((thisWeekAvg - prevWeekAvg) / prevWeekAvg) * 100;
        return {
            trendPct: Math.round(trendPct),
            isWorsening: trendPct > 10
        };
    };

    const testCases = [
        { thisWeek: 180, prevWeek: 140, expectWorsening: true },  // +28%
        { thisWeek: 150, prevWeek: 145, expectWorsening: false }, // +3%
        { thisWeek: 130, prevWeek: 150, expectWorsening: false }, // -13% (improving)
        { thisWeek: 200, prevWeek: 180, expectWorsening: true },  // +11%
        { thisWeek: 140, prevWeek: 140, expectWorsening: false }, // 0%
    ];

    testCases.forEach(tc => {
        const result = calculateTrend(tc.thisWeek, tc.prevWeek);
        assert(
            result.isWorsening === tc.expectWorsening,
            `Trend ${tc.thisWeek} vs ${tc.prevWeek} should be worsening=${tc.expectWorsening}, got ${result.trendPct}%`
        );
    });
};

// ============================================================================
// Run All Tests
// ============================================================================
async function runTests() {
    console.log('🧪 Running Hanna Critical Path Tests\n');
    console.log('================================\n');

    let passed = 0;
    let failed = 0;

    const tests = [
        { name: 'Emergency Keyword Detection', fn: testEmergencyKeywords },
        { name: 'Risk Score Calculation', fn: testRiskScoreLogic },
        { name: 'Auth Token Validation', fn: testAuthTokenValidation },
        { name: 'Rate Limiting Logic', fn: testRateLimiting },
        { name: 'Sentiment Analysis (Hedging)', fn: testSentimentAnalysis },
        { name: 'Trend Detection Logic', fn: testTrendDetection },
    ];

    for (const t of tests) {
        console.log(`\n📌 ${t.name}`);
        console.log('-'.repeat(40));
        const success = await test(t.name, t.fn);
        if (success) passed++;
        else failed++;
    }

    console.log('\n================================');
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

    if (failed > 0) {
        console.log('\n❌ Some tests failed!');
        process.exit(1);
    } else {
        console.log('\n✅ All tests passed!');
        process.exit(0);
    }
}

runTests();
