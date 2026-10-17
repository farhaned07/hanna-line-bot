'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createNurseCopilot } = require('../src/agentic/nurseCopilot');

function setup(overrides = {}) {
    const calls = [];
    const claims = new Map();
    const patient = {
        id: 'patient-1', tenantId: 'hospital-1',
        enrollmentStatus: 'active', messagingConsent: true, lineVerified: true,
        ...overrides
    };
    const store = {
        async claim(tenant, event) {
            const key = `${tenant}:${event}`;
            if (claims.get(key) === 'complete' || claims.get(key) === 'running') return { acquired: false };
            claims.set(key, 'running');
            return { acquired: true };
        },
        async complete(tenant, event) { claims.set(`${tenant}:${event}`, 'complete'); },
        async fail(tenant, event) { claims.set(`${tenant}:${event}`, 'failed'); }
    };
    const tools = { async loadPatient() { return patient; } };
    for (const name of ['recordDecision', 'recordCheckin', 'recordHold',
        'createNurseTask', 'queueTemplate']) {
        tools[name] = async args => {
            calls.push({ name, ...args });
            return { id: `receipt-${calls.length}` };
        };
    }
    return { agent: createNurseCopilot({ store, tools }), calls, tools, claims };
}
const base = { tenantId: 'hospital-1', patientId: 'patient-1', type: 'checkin_response' };

test('structured OK runs recorded check-in and approved acknowledgment', async () => {
    const h = setup();
    const result = await h.agent.run({ ...base, eventId: 'ok-1', responseCode: 'OK' });
    assert.equal(result.status, 'completed');
    assert.deepEqual(h.calls.map(c => c.name), ['recordDecision', 'recordCheckin', 'queueTemplate']);
    assert.equal(h.calls[2].template, 'CHECKIN_ACK');
});

test('explicit emergency requests never get suppressed by a task cap', async () => {
    const h = setup();
    await h.agent.run({ ...base, eventId: 'emergency-1', responseCode: 'EMERGENCY_HELP' });
    assert.equal(h.calls.find(c => c.name === 'createNurseTask').priority, 'critical');
    assert.equal(h.calls.find(c => c.name === 'queueTemplate').template, 'EMERGENCY_CONTACT_SERVICES');
});

test('all unclassified free text goes to nurse review, not a low-risk classification', async () => {
    const h = setup();
    await h.agent.run({ ...base, eventId: 'text-1', responseCode: 'FREE_TEXT' });
    assert.equal(h.calls.find(c => c.name === 'createNurseTask').priority, 'high');
});

test('no consent or verified LINE means no automated outbound messages', async () => {
    const h = setup({ messagingConsent: false });
    await h.agent.run({ ...base, eventId: 'no-consent-1', responseCode: 'NEED_CALLBACK' });
    assert.equal(h.calls.some(c => c.name === 'queueTemplate'), false);
    assert.equal(h.calls.some(c => c.name === 'createNurseTask'), true);
});

test('follow-up due without consent is held', async () => {
    const h = setup({ lineVerified: false });
    await h.agent.run({ ...base, eventId: 'due-1', type: 'followup_due', day: 3 });
    assert.equal(h.calls.find(c => c.name === 'recordHold').reason.includes('Consent'), true);
    assert.equal(h.calls.some(c => c.name === 'queueTemplate'), false);
});

test('duplicate events do not repeat work', async () => {
    const h = setup();
    const event = { ...base, eventId: 'dup-1', responseCode: 'OK' };
    await h.agent.run(event);
    const count = h.calls.length;
    assert.equal((await h.agent.run(event)).status, 'duplicate_or_in_progress');
    assert.equal(h.calls.length, count);
});

test('tenant mismatch fails closed', async () => {
    const h = setup({ tenantId: 'other-hospital' });
    await assert.rejects(h.agent.run({ ...base, eventId: 'tenant-1', responseCode: 'OK' }), /authorized tenant/);
    assert.equal(h.calls.length, 0);
});

test('tool errors are propagated and event marked failed', async () => {
    const h = setup();
    h.tools.createNurseTask = async () => { throw new Error('database unavailable'); };
    await assert.rejects(h.agent.run({ ...base, eventId: 'failure-1', responseCode: 'NEED_CALLBACK' }), /database unavailable/);
    assert.equal(h.claims.get('hospital-1:failure-1'), 'failed');
});

test('rejects unsupported responses and malformed events before side effects', async () => {
    const h = setup();
    await assert.rejects(h.agent.run({ ...base, eventId: 'bad-1', responseCode: 'SOMEWHAT_OK' }), /Unsupported response code/);
    assert.equal(h.calls.length, 0);
});
