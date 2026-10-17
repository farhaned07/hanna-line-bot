'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
    createInterSystemsFhirAdapter, validateLocalFhirUrl,
    SYNTHETIC_SYSTEM, SYNTHETIC_VALUE
} = require('../src/agentic/intersystemsFhirAdapter');
const { createDemoApi } = require('../src/agentic/demoApi');
const { createSeeder } = require('../scripts/seed-hanna-iris-fhir');

const patient = {
    resourceType: 'Patient', id: '123',
    identifier: [{ system: SYNTHETIC_SYSTEM, value: SYNTHETIC_VALUE }]
};
const encounter = {
    resourceType: 'Encounter', id: 'enc-123', status: 'finished', subject: { reference: 'Patient/123' }
};
const observation = {
    resourceType: 'Observation', id: 'obs-123', status: 'final',
    subject: { reference: 'Patient/123' },
    code: { coding: [{ system: 'http://loinc.org', code: '8867-4' }] },
    effectiveDateTime: '2026-10-16T10:00:00+07:00',
    valueQuantity: { value: 112, system: 'http://unitsofmeasure.org', code: '/min' }
};
const condition = {
    resourceType: 'Condition', id: 'condition-123',
    subject: { reference: 'Patient/123' },
    code: { coding: [{ system: 'http://snomed.info/sct', code: '84114007' }] }
};

function fakeFhirFetch(overrides = {}) {
    const calls = [];
    const f = async (url, options) => {
        const parsed = new URL(url);
        const type = parsed.pathname.split('/').at(-1);
        calls.push({ type, url, options });
        if (overrides.fail) return { ok: false, status: 401 };
        const byType = { Patient: patient, Encounter: encounter,
            Observation: observation, Condition: condition };
        const resource = type === 'Patient' && overrides.noPatient ? null : byType[type];
        const entry = resource ? [{ resource }] : [];
        const bundle = { resourceType: 'Bundle', type: 'searchset', entry };
        return { ok: true, headers: { get: () => 'application/fhir+json' },
            json: async () => bundle };
    };
    f.calls = calls;
    return f;
}

test('rejects remote host, TLS endpoints, and credentials in local-demo URI', () => {
    assert.throws(() => validateLocalFhirUrl('https://hospital.example/fhir/r4'), /local|endpoint/);
    assert.throws(() => validateLocalFhirUrl('http://127.0.0.1:52773/admin'), /endpoint/);
    assert.throws(() => validateLocalFhirUrl('http://example.com:52773/fhir/r4'), /endpoint/);
    assert.throws(() => validateLocalFhirUrl('http://user:secret@127.0.0.1:52773/fhir/r4'), /endpoint/);
    assert.equal(validateLocalFhirUrl('http://127.0.0.1:52773/fhir/r4'),
        'http://127.0.0.1:52773/fhir/r4');
});

test('reads fixed synthetic patient, encounter, condition and heart rate through FHIR API', async () => {
    const mock = fakeFhirFetch();
    const adapter = createInterSystemsFhirAdapter({
        baseUrl: 'http://127.0.0.1:52773/fhir/r4',
        username: 'demo', password: 'test', fetchImpl: mock
    });
    const result = await adapter.readSyntheticDischarge();
    assert.equal(result.synthetic, true);
    assert.equal(result.patientFhirId, '123');
    assert.equal(result.encounterCompleted, true);
    assert.equal(result.heartRateBpm, 112);
    assert.equal(result.conditionContext, 'Synthetic cardiovascular follow-up');
    assert.equal(mock.calls.length, 4);
    assert.equal(mock.calls.every(x => x.options.method === 'GET'), true);
    assert.equal(mock.calls.every(x => x.options.redirect === 'error'), true);
    assert.equal(mock.calls.every(x => x.options.headers.Authorization.startsWith('Basic ')), true);
});

test('fails closed if synthetic marker cannot be verified', async () => {
    const adapter = createInterSystemsFhirAdapter({
        baseUrl: 'http://127.0.0.1:52773/fhir/r4',
        username: 'demo', password: 'test', fetchImpl: fakeFhirFetch({ noPatient: true })
    });
    await assert.rejects(adapter.readSyntheticDischarge(), /exactly one seeded synthetic/);
});

test('does not report connection success when upstream FHIR returns error', async () => {
    const adapter = createInterSystemsFhirAdapter({
        baseUrl: 'http://127.0.0.1:52773/fhir/r4',
        username: 'demo', password: 'test', fetchImpl: fakeFhirFetch({ fail: true })
    });
    const api = createDemoApi({ fhirAdapter: adapter });
    const resp = await api.handle({ method: 'POST', path: '/v1/demo/intersystems/sync' });
    assert.equal(resp.status, 502);
    const state = (await api.handle({ method: 'GET', path: '/v1/demo/state' })).body;
    assert.equal(state.intersystems.connected, false);
});

test('actually sourced FHIR observation changes synthetic patient-review result', async () => {
    const adapter = createInterSystemsFhirAdapter({
        baseUrl: 'http://127.0.0.1:52773/fhir/r4',
        username: 'demo', password: 'test', fetchImpl: fakeFhirFetch()
    });
    const api = createDemoApi({ fhirAdapter: adapter });
    const sync = await api.handle({ method: 'POST', path: '/v1/demo/intersystems/sync' });
    assert.equal(sync.status, 200);
    assert.equal(sync.body.record.dataSource, 'LIVE_LOCAL_FHIR_SERVER');
    await api.handle({ method: 'POST', path: '/v1/enrollments' });
    const checkin = await api.handle({
        method: 'POST', path: '/v1/events',
        body: { type: 'checkin_response', eventId: 'iris-checkin-1',
            medicationTaken: true, wellBeing: 'well', symptoms: ['none'] }
    });
    assert.equal(checkin.status, 201);
    assert.equal(checkin.body.assessment.level, 'high');
    assert.match(checkin.body.assessment.signals.join(' '), /InterSystems FHIR Observation: 112 bpm/);
    const state = (await api.handle({ method: 'GET', path: '/v1/demo/state' })).body;
    assert.equal(state.tasks[0].priority, 'high');
    assert.equal(state.intersystems.connected, true);
});

test('FHIR configuration is explicitly optional and not presented as connected', async () => {
    const api = createDemoApi();
    const status = await api.handle({ method: 'GET', path: '/v1/health' });
    assert.equal(status.body.intersystemsFhir, 'not-configured');
    const sync = await api.handle({ method: 'POST', path: '/v1/demo/intersystems/sync' });
    assert.equal(sync.status, 503);
});

test('idempotent FHIR seed creates only synthetic resources once', async () => {
    const resources = new Map();
    let creates = 0;
    const fetchImpl = async (url, opts) => {
        const type = new URL(url).pathname.split('/').at(-1);
        if (opts.method === 'GET') {
            const parsed = new URL(url);
            const id = parsed.searchParams.get('identifier');
            const found = Array.from(resources.values()).filter(x =>
                x.resourceType === type &&
                x.identifier?.some(i => i.system + '|' + i.value === id));
            return { ok: true, json: async () =>
                ({ resourceType: 'Bundle', type: 'searchset',
                    entry: found.map(resource => ({ resource })) }) };
        }
        const record = JSON.parse(opts.body);
        record.id = String(++creates);
        resources.set(record.resourceType + ':' + record.id, record);
        return { ok: true, json: async () => record };
    };
    const seeder = createSeeder({
        baseUrl: 'http://127.0.0.1:52773/fhir/r4',
        username: 'demo', password: 'test', fetchImpl
    });
    const first = await seeder.seed();
    const second = await seeder.seed();
    assert.equal(creates, 4);
    assert.equal(first.patient.created, true);
    assert.equal(second.patient.created, false);
    assert.equal(first.observation.id, second.observation.id);
});
