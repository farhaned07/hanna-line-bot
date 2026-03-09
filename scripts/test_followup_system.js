/**
 * Follow-up System E2E Tests
 * 
 * Tests the complete follow-up enrollment and messaging flow
 * Run: node scripts/test_followup_system.js
 */

require('dotenv').config();
const db = require('../src/services/db');
const followupService = require('../src/services/followup');
const followupScheduler = require('../src/services/followupScheduler');

// Test configuration
const TEST_PATIENT = {
    patientName: 'Test Patient',
    patientHn: 'TEST001',
    patientPhone: '0812345678',
    patientAge: 55,
    patientCondition: 'Diabetes Type 2',
    followupProgram: 'chronic_care'
};

let testEnrollmentId = null;
let testsPassed = 0;
let testsFailed = 0;

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function assert(condition, message) {
    if (condition) {
        testsPassed++;
        log(`  ✓ ${message}`, 'green');
        return true;
    } else {
        testsFailed++;
        log(`  ✗ ${message}`, 'red');
        return false;
    }
}

async function cleanup() {
    log('\n🧹 Cleaning up test data...', 'yellow');
    
    if (testEnrollmentId) {
        await db.query('DELETE FROM followup_enrollments WHERE id = $1', [testEnrollmentId]);
    }
    
    await db.query('DELETE FROM followup_enrollments WHERE patient_hn = $1', [TEST_PATIENT.patientHn]);
    await db.query('DELETE FROM followup_messages WHERE enrollment_id IN (SELECT id FROM followup_enrollments WHERE patient_hn = $1)', [TEST_PATIENT.patientHn]);
    await db.query('DELETE FROM patient_responses WHERE enrollment_id IN (SELECT id FROM followup_enrollments WHERE patient_hn = $1)', [TEST_PATIENT.patientHn]);
    
    log('  ✓ Cleanup complete', 'green');
}

async function testDatabaseTables() {
    log('\n📊 Test 1: Database Tables Exist', 'blue');
    
    try {
        const tables = ['followup_enrollments', 'followup_messages', 'patient_responses', 'followup_templates'];
        
        for (const table of tables) {
            const result = await db.query(
                `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`,
                [table]
            );
            assert(result.rows[0].exists, `${table} table exists`);
        }
        
        return true;
    } catch (err) {
        log(`  ✗ Database test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testEnrollment() {
    log('\n📝 Test 2: Patient Enrollment', 'blue');
    
    try {
        // Create a mock clinician ID
        const mockClinicianId = '00000000-0000-0000-0000-000000000001';
        
        // Enroll patient
        const enrollment = await followupService.enrollPatient({
            ...TEST_PATIENT,
            scribeNoteId: '00000000-0000-0000-0000-000000000001',
            clinicianId: mockClinicianId
        });
        
        testEnrollmentId = enrollment.id;
        
        assert(enrollment.id, 'Enrollment created with ID');
        assert(enrollment.patient_name === TEST_PATIENT.patientName, 'Patient name matches');
        assert(enrollment.patient_hn === TEST_PATIENT.patientHn, 'HN matches');
        assert(enrollment.status === 'active', 'Status is active');
        assert(enrollment.current_day === 0, 'Current day is 0');
        
        // Verify messages were scheduled
        const messagesResult = await db.query(
            `SELECT COUNT(*) FROM followup_messages WHERE enrollment_id = $1`,
            [testEnrollmentId]
        );
        
        const messageCount = parseInt(messagesResult.rows[0].count);
        assert(messageCount === 4, `4 messages scheduled (got ${messageCount})`);
        
        return true;
    } catch (err) {
        log(`  ✗ Enrollment test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testMessageScheduling() {
    log('\n📅 Test 3: Message Scheduling', 'blue');
    
    try {
        const messagesResult = await db.query(
            `SELECT message_day, scheduled_for, message_template 
             FROM followup_messages 
             WHERE enrollment_id = $1 
             ORDER BY message_day ASC`,
            [testEnrollmentId]
        );
        
        assert(messagesResult.rows.length === 4, '4 messages found');
        
        // Check Day 1
        const day1 = messagesResult.rows[0];
        assert(day1.message_day === 1, 'Day 1 message exists');
        assert(day1.message_template === 'day1_welcome_th', 'Day 1 template is correct');
        
        // Check Day 3
        const day3 = messagesResult.rows[1];
        assert(day3.message_day === 3, 'Day 3 message exists');
        
        // Check Day 7
        const day7 = messagesResult.rows[2];
        assert(day7.message_day === 7, 'Day 7 message exists');
        
        // Check Day 14
        const day14 = messagesResult.rows[3];
        assert(day14.message_day === 14, 'Day 14 message exists');
        
        return true;
    } catch (err) {
        log(`  ✗ Message scheduling test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testTemplates() {
    log('\n📄 Test 4: Message Templates', 'blue');
    
    try {
        const templatesResult = await db.query(
            `SELECT COUNT(*) FROM followup_templates WHERE is_active = TRUE`
        );
        
        const templateCount = parseInt(templatesResult.rows[0].count);
        assert(templateCount >= 8, `At least 8 templates exist (got ${templateCount})`);
        
        // Check specific templates
        const day1Template = await followupService.getTemplate(1, 'th');
        assert(day1Template !== null, 'Day 1 Thai template exists');
        assert(day1Template.message_body.includes('สวัสดีค่ะ'), 'Day 1 template has Thai greeting');
        
        const day14Template = await followupService.getTemplate(14, 'en');
        assert(day14Template !== null, 'Day 14 English template exists');
        assert(day14Template.message_body.includes('Congratulations'), 'Day 14 template has congratulations');
        
        return true;
    } catch (err) {
        log(`  ✗ Templates test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testSentimentAnalysis() {
    log('\n🧠 Test 5: Sentiment Analysis', 'blue');
    
    try {
        // Test positive sentiment
        const positiveResult = followupService.analyzeSentiment('สบายดี 😊 ดีมาก');
        assert(positiveResult.label === 'positive', 'Positive text detected');
        assert(positiveResult.score > 0, 'Positive score');
        
        // Test negative sentiment
        const negativeResult = followupService.analyzeSentiment('ไม่สบาย 😔 แย่มาก');
        assert(negativeResult.label === 'negative', 'Negative text detected');
        assert(negativeResult.score < 0, 'Negative score');
        
        // Test neutral sentiment
        const neutralResult = followupService.analyzeSentiment('ปกติ');
        assert(neutralResult.label === 'neutral', 'Neutral text detected');
        
        return true;
    } catch (err) {
        log(`  ✗ Sentiment analysis test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testStats() {
    log('\n📊 Test 6: Statistics & Analytics', 'blue');
    
    try {
        const mockClinicianId = '00000000-0000-0000-0000-000000000001';
        const stats = await followupService.getClinicianStats(mockClinicianId);
        
        assert(stats !== null, 'Stats returned');
        assert(parseInt(stats.total_enrollments) >= 1, 'At least 1 enrollment counted');
        
        return true;
    } catch (err) {
        log(`  ✗ Stats test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testScheduler() {
    log('\n⏰ Test 7: Scheduler Function', 'blue');
    
    try {
        // Run scheduler (won't send actual messages since scheduled_for is in future)
        const result = await followupScheduler.runFollowupScheduler();
        
        assert(result !== null, 'Scheduler ran successfully');
        assert(typeof result.sentCount === 'number', 'Sent count returned');
        assert(typeof result.failedCount === 'number', 'Failed count returned');
        
        return true;
    } catch (err) {
        log(`  ✗ Scheduler test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testDuplicateEnrollment() {
    log('\n🚫 Test 8: Duplicate Enrollment Prevention', 'blue');
    
    try {
        const mockClinicianId = '00000000-0000-0000-0000-000000000002';
        
        // Try to enroll same patient again
        try {
            await followupService.enrollPatient({
                ...TEST_PATIENT,
                scribeNoteId: '00000000-0000-0000-0000-000000000002',
                clinicianId: mockClinicianId
            });
            assert(false, 'Should have thrown error for duplicate enrollment');
            return false;
        } catch (err) {
            assert(err.message.includes('already enrolled'), 'Duplicate error thrown');
            return true;
        }
    } catch (err) {
        log(`  ✗ Duplicate prevention test failed: ${err.message}`, 'red');
        return false;
    }
}

async function runAllTests() {
    log('\n' + '='.repeat(60), 'yellow');
    log('🏥 HANNA FOLLOW-UP SYSTEM - E2E TESTS', 'yellow');
    log('='.repeat(60), 'yellow');
    
    try {
        await testDatabaseTables();
        await testEnrollment();
        await testMessageScheduling();
        await testTemplates();
        await testSentimentAnalysis();
        await testStats();
        await testScheduler();
        await testDuplicateEnrollment();
        
    } catch (err) {
        log(`\n❌ Test suite error: ${err.message}`, 'red');
        console.error(err);
    }
    
    await cleanup();
    
    // Summary
    log('\n' + '='.repeat(60), 'yellow');
    log('📊 TEST SUMMARY', 'yellow');
    log('='.repeat(60), 'yellow');
    log(`  Total:  ${testsPassed + testsFailed}`, 'blue');
    log(`  Passed: ${testsPassed}`, 'green');
    log(`  Failed: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green');
    log('='.repeat(60), 'yellow');
    
    if (testsFailed === 0) {
        log('\n✅ ALL TESTS PASSED!\n', 'green');
        process.exit(0);
    } else {
        log('\n❌ SOME TESTS FAILED\n', 'red');
        process.exit(1);
    }
}

// Run tests
runAllTests().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
