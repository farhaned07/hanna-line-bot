'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createDemoApi, assessSyntheticSignals } = require('../src/agentic/demoApi');

const invoke = (api, method, path, body = {}) => api.handle({ method, path, body });

test('API starts synthetic and un-enrolled', async () => {
    const api = createDemoApi();
    const r = await invoke(api, 'GET', '/v1/demo/state');
    assert.equal(r.status, 200);
    assert.equal(r.body.syntheticOnly, true);
    assert.equal(r.body.patient, null);
});

test('hospital enrollment schedules four follow-ups', async () => {
    const api = createDemoApi();
    const r = await invoke(api, 'POST', '/v1/enrollments');
    assert.equal(r.status, 201);
    assert.deepEqual(r.body.followupSchedule.map(x => x.day), [1, 3, 7, 14]);
    assert.equal(r.body.patient.id, 'demo-patient-001');
});

test('scheduled follow-up queues simulated LINE, not live send', async () => {
    const api = createDemoApi();
    await invoke(api, 'POST', '/v1/enrollments');
    const r = await invoke(api, 'POST', '/v1/events',
        { type: 'followup_due', day: 1, eventId: 'day1' });
    assert.equal(r.status, 201);
    const state = (await invoke(api, 'GET', '/v1/demo/state')).body;
    assert.equal(state.outbox[0].template, 'FOLLOWUP_DAY_1');
    assert.equal(state.outbox[0].delivery, 'SIMULATED_NOT_SENT');
});

test('concerning check-in creates a high priority task and stored assessment', async () => {
    const api = createDemoApi();
    await invoke(api, 'POST', '/v1/enrollments');
    const response = await invoke(api, 'POST', '/v1/events', {
        type: 'checkin_response', eventId: 'checkin1',
        medicationTaken: false, wellBeing: 'unwell', symptoms: ['fatigue']
    });
    assert.equal(response.status, 201);
    const state = (await invoke(api, 'GET', '/v1/demo/state')).body;
    assert.equal(state.assessment.level, 'high');
    assert.equal(state.tasks.length, 1);
    assert.equal(state.tasks[0].priority, 'high');
    assert.equal(state.checkins.length, 1);
});

test('emergency-help signal creates critical task', async () => {
    const api = createDemoApi();
    await invoke(api, 'POST', '/v1/enrollments');
    const response = await invoke(api, 'POST', '/v1/events', {
        type: 'checkin_response', eventId: 'critical1',
        emergencyHelp: true, symptoms: ['shortness_of_breath']
    });
    assert.equal(response.status, 201);
    const state = (await invoke(api, 'GET', '/v1/demo/state')).body;
    assert.equal(state.assessment.level, 'critical');
    assert.equal(state.tasks[0].priority, 'critical');
    assert.equal(state.outbox[0].template, 'EMERGENCY_CONTACT_SERVICES');
});

test('missing information is unknown and requires nurse review, never routine', async () => {
    const api = createDemoApi();
    await invoke(api, 'POST', '/v1/enrollments');
    await invoke(api, 'POST', '/v1/events',
        { type: 'checkin_response', eventId: 'unknown1' });
    const state = (await invoke(api, 'GET', '/v1/demo/state')).body;
    assert.equal(state.assessment.level, 'unknown');
    assert.equal(state.tasks[0].priority, 'high');
});

test('explicit structured well check-in creates no nurse task', async () => {
    const api = createDemoApi();
    await invoke(api, 'POST', '/v1/enrollments');
    await invoke(api, 'POST', '/v1/events', {
        type: 'checkin_response', eventId: 'ok1',
        medicationTaken: true, wellBeing: 'well', symptoms: ['none']
    });
    const state = (await invoke(api, 'GET', '/v1/demo/state')).body;
    assert.equal(state.assessment.level, 'routine');
    assert.equal(state.tasks.length, 0);
    assert.equal(state.outbox[0].template, 'CHECKIN_ACK');
});

test('duplicate event replays result without duplicate nurse tasks', async () => {
    const api = createDemoApi();
    await invoke(api, 'POST', '/v1/enrollments');
    const event = { type: 'checkin_response', eventId: 'duplicate1',
        medicationTaken: false, wellBeing: 'unwell' };
    assert.equal((await invoke(api, 'POST', '/v1/events', event)).status, 201);
    const replay = await invoke(api, 'POST', '/v1/events', event);
    assert.equal(replay.status, 200);
    assert.equal(replay.body.replayed, true);
    const state = (await invoke(api, 'GET', '/v1/demo/state')).body;
    assert.equal(state.tasks.length, 1);
    assert.equal(state.checkins.length, 1);
});

test('nurse must acknowledge before resolving; resolution audited', async () => {
    const api = createDemoApi();
    await invoke(api, 'POST', '/v1/enrollments');
    await invoke(api, 'POST', '/v1/events', {
        type: 'checkin_response', eventId: 'task1', medicationTaken: false
    });
    const state = (await invoke(api, 'GET', '/v1/demo/state')).body;
    const url = '/v1/tasks/' + state.tasks[0].id;
    assert.equal((await invoke(api, 'POST', url + '/resolve')).status, 400);
    assert.equal((await invoke(api, 'POST', url + '/acknowledge')).body.task.status, 'acknowledged');
    assert.equal((await invoke(api, 'POST', url + '/resolve')).body.task.status, 'resolved');
    assert.equal((await invoke(api, 'GET', '/v1/demo/state')).body.timeline.some(x => x.kind === 'nurse'), true);
});

test('rejects arbitrary patient references and invalid signal codes', async () => {
    const api = createDemoApi();
    await invoke(api, 'POST', '/v1/enrollments');
    assert.equal((await invoke(api, 'POST', '/v1/events', {
        type: 'checkin_response', patientId: 'real-patient', eventId: 'bad'
    })).status, 400);
    assert.equal((await invoke(api, 'POST', '/v1/events', {
        type: 'checkin_response', symptoms: ['random'], eventId: 'bad2'
    })).status, 400);
    assert.throws(() => assessSyntheticSignals({ medicationTaken: 'maybe' }), /boolean/);
});

test('reset destroys ephemeral demo state', async () => {
    const api = createDemoApi();
    await invoke(api, 'POST', '/v1/enrollments');
    assert.equal((await invoke(api, 'POST', '/v1/demo/reset')).body.patient, null);
});
