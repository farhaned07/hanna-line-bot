'use strict';

// SYNTHETIC-ONLY DEMONSTRATION API. No live LINE, PHI, or clinical decisions.
// Uses the real agentic orchestration foundation with in-memory demo adapters.
const { createNurseCopilot } = require('./nurseCopilot');

const TENANT = 'demo-hospital';
const PATIENT = 'demo-patient-001';

function assessSyntheticSignals(input, fhirContext = null) {
    const allowed = new Set(['none', 'fatigue', 'headache', 'chest_pain', 'shortness_of_breath', 'other']);
    const symptoms = input.symptoms == null ? [] : input.symptoms;
    if (!Array.isArray(symptoms) || symptoms.length > 8 ||
        symptoms.some(s => typeof s !== 'string' || !allowed.has(s))) {
        throw new Error('Invalid symptom codes for synthetic demo');
    }
    if (input.medicationTaken !== undefined && typeof input.medicationTaken !== 'boolean') {
        throw new Error('medicationTaken must be boolean');
    }
    if (input.wellBeing !== undefined && !['well', 'unwell', 'unknown'].includes(input.wellBeing)) {
        throw new Error('Invalid wellBeing value');
    }
    if (input.emergencyHelp !== undefined && typeof input.emergencyHelp !== 'boolean') {
        throw new Error('emergencyHelp must be boolean');
    }
    const signals = [];
    if (input.medicationTaken === false) signals.push('Patient reported missed medication');
    if (input.wellBeing === 'unwell') signals.push('Patient reports feeling unwell');
    for (const s of symptoms) if (s !== 'none') signals.push('Reported symptom: ' + s.replaceAll('_', ' '));
    if (input.emergencyHelp === true) signals.push('Patient explicitly requested emergency help');
    const fhirHeartRate = fhirContext && Number.isFinite(fhirContext.heartRateBpm)
        ? fhirContext.heartRateBpm : null;
    if (fhirHeartRate !== null) {
        signals.push('InterSystems FHIR Observation: ' + fhirHeartRate + ' bpm (synthetic)');
    }

    // Conservative demonstration policy, NOT production OneBrain or a clinical risk model.
    if (input.emergencyHelp === true ||
        symptoms.includes('chest_pain') || symptoms.includes('shortness_of_breath')) {
        return {
            level: 'critical', action: 'urgent_nurse_review',
            signals, rule: 'demo-emergency-review-policy-v1',
            note: 'Synthetic escalation example; not a validated clinical prediction'
        };
    }
    if (input.medicationTaken === false || input.wellBeing === 'unwell' ||
        symptoms.some(s => s !== 'none') || (fhirHeartRate !== null && fhirHeartRate >= 110)) {
        return {
            level: 'high', action: 'nurse_review',
            signals, rule: 'demo-concern-review-policy-v1',
            note: 'Synthetic review recommendation; not a validated clinical prediction'
        };
    }
    if (input.medicationTaken === true && input.wellBeing === 'well' &&
        (symptoms.length === 0 || (symptoms.length === 1 && symptoms[0] === 'none'))) {
        return {
            level: 'routine', action: 'acknowledge', signals: ['Structured routine response'],
            rule: 'demo-structured-ok-policy-v1',
            note: 'No concern found in limited demo inputs; does not establish clinical safety'
        };
    }
    return {
        level: 'unknown', action: 'nurse_review',
        signals: signals.length ? signals : ['Insufficient check-in information'],
        rule: 'demo-uncertainty-review-policy-v1',
        note: 'Missing information requires review; never considered low risk'
    };
}

function createDemoApi({ fhirAdapter = null } = {}) {
    let state;
    const claims = new Map();
    const actionReceipts = new Map();
    const pendingInputs = new Map();
    const pendingAssessments = new Map();
    const completedEvents = new Map();
    let sequence = 0;

    const nextId = prefix => prefix + '-' + String(++sequence).padStart(3, '0');
    const timestamp = () => new Date().toISOString();
    function timeline(kind, description) {
        state.timeline.push({ id: nextId('log'), at: timestamp(), kind, description });
    }
    function reset() {
        state = {
            demo: true, syntheticOnly: true, patient: null,
            followupSchedule: [], assessment: null, checkins: [],
            tasks: [], outbox: [], timeline: [],
            intersystems: { configured: !!fhirAdapter, connected: false, record: null }
        };
        sequence = 0;
        claims.clear();
        actionReceipts.clear();
        pendingInputs.clear();
        pendingAssessments.clear();
        completedEvents.clear();
        timeline('reset', 'Demonstration data reset; no hospital or LINE systems connected');
    }
    reset();

    function receipt(args, operation) {
        const key = args.idempotencyKey;
        if (!key) throw new Error('Missing durable-action idempotency key');
        if (actionReceipts.has(key)) return actionReceipts.get(key);
        const result = { id: nextId('receipt') };
        operation();
        actionReceipts.set(key, result);
        return result;
    }

    const tools = {
        async loadPatient({ tenantId, patientId }) {
            if (tenantId !== TENANT || patientId !== PATIENT) return null;
            return state.patient && { ...state.patient };
        },
        async recordDecision(args) {
            return receipt(args, () => timeline('decision', 'OneBrain workflow plan recorded: ' + args.decision.join(', ')));
        },
        async recordCheckin(args) {
            return receipt(args, () => {
                const input = pendingInputs.get(args.eventId);
                if (!input) throw new Error('No associated demonstration check-in');
                state.checkins.push({ id: args.eventId, recordedAt: timestamp(),
                    medicationTaken: input.medicationTaken == null ? null : input.medicationTaken,
                    wellBeing: input.wellBeing || 'unknown',
                    symptoms: input.symptoms || [] });
                timeline('line', 'Simulated LINE response received and saved');
            });
        },
        async recordHold(args) {
            return receipt(args, () => timeline('hold', 'Follow-up paused: ' + args.reason));
        },
        async createNurseTask(args) {
            return receipt(args, () => {
                const assessment = pendingAssessments.get(args.eventId);
                const task = {
                    id: nextId('task'), patientId: PATIENT, status: 'pending',
                    priority: args.priority, taskType: args.type, createdAt: timestamp(),
                    reason: assessment ? assessment.signals.join('; ') : 'Review requested',
                    owner: null, resolvedAt: null
                };
                state.tasks.push(task);
                timeline('task', task.priority.toUpperCase() + ' nurse task created: ' + task.id);
            });
        },
        async queueTemplate(args) {
            return receipt(args, () => {
                if (!state.patient || !state.patient.messagingConsent || !state.patient.lineVerified) {
                    throw new Error('Patient does not have verified LINE consent');
                }
                state.outbox.push({ id: nextId('msg'), channel: 'LINE_SIMULATED',
                    delivery: 'SIMULATED_NOT_SENT', template: args.template, at: timestamp() });
                timeline('line', 'LINE template queued in simulator: ' + args.template);
            });
        }
    };

    const store = {
        async claim(tenantId, eventId) {
            const key = tenantId + ':' + eventId;
            if (claims.get(key) === 'running' || claims.get(key) === 'complete') {
                return { acquired: false };
            }
            claims.set(key, 'running');
            return { acquired: true };
        },
        async complete(tenantId, eventId) { claims.set(tenantId + ':' + eventId, 'complete'); },
        async fail(tenantId, eventId) { claims.set(tenantId + ':' + eventId, 'failed'); }
    };
    const copilot = createNurseCopilot({ tools, store });

    function snapshot() {
        return JSON.parse(JSON.stringify(state));
    }
    const response = (status, body) => ({ status, body });
    const badRequest = message => response(400, { error: message });
    const notFound = () => response(404, { error: 'Unknown demo API endpoint' });

    async function handle({ method = 'GET', path = '/', body = {} }) {
        if (method === 'POST' && path === '/v1/demo/reset') {
            reset();
            return response(200, snapshot());
        }
        if (method === 'GET' && path === '/v1/demo/state') {
            return response(200, snapshot());
        }
        if (method === 'GET' && path === '/v1/health') {
            return response(200, {
                ok: true, mode: 'synthetic-local-demo',
                intersystemsFhir: state.intersystems.connected ? 'connected-local-sandbox' :
                    (state.intersystems.configured ? 'configured-not-connected' : 'not-configured'),
                line: 'simulated'
            });
        }
        if (method === 'POST' && path === '/v1/demo/intersystems/sync') {
            if (!fhirAdapter) {
                return response(503, { error: 'InterSystems adapter not configured. Start the official IRIS FHIR sandbox and set HANNA_IRIS_FHIR_URL, HANNA_IRIS_USER and HANNA_IRIS_PASSWORD.' });
            }
            try {
                const record = await fhirAdapter.readSyntheticDischarge();
                // Only normalized, explicitly synthetic metadata enters the demo state.
                if (!record || record.synthetic !== true || record.dataSource !== 'LIVE_LOCAL_FHIR_SERVER') {
                    throw new Error('Unexpected FHIR adapter provenance');
                }
                state.intersystems = { configured: true, connected: true, record };
                timeline('intersystems', 'Read synthetic Patient, Encounter and Observation from local InterSystems FHIR server');
                return response(200, { connected: true, record, simulated: true });
            } catch (error) {
                state.intersystems = { configured: true, connected: false, record: null };
                return response(502, { error: 'Cannot verify synthetic InterSystems FHIR patient in local sandbox' });
            }
        }
        if (method === 'POST' && path === '/v1/enrollments') {
            if (state.patient) return response(200, { patient: state.patient, alreadyEnrolled: true });
            // Fixed synthetic test record; no arbitrary PII is accepted.
            state.patient = {
                id: PATIENT, tenantId: TENANT, displayName: 'Patient A (Synthetic)',
                enrollmentStatus: 'active', messagingConsent: true, lineVerified: true,
                condition: 'Synthetic discharge follow-up'
            };
            state.followupSchedule = [1, 3, 7, 14].map(day => ({ day, status: 'scheduled' }));
            timeline('hospital', 'Hospital API enrolled a synthetic patient; follow-ups scheduled');
            return response(201, { patient: state.patient, followupSchedule: state.followupSchedule });
        }
        if (method === 'POST' && path === '/v1/events') {
            if (!state.patient) return badRequest('Enroll the synthetic patient first');
            if (body == null || typeof body !== 'object' || Array.isArray(body)) return badRequest('Invalid event body');
            if (body.patientId != null && body.patientId !== PATIENT) return badRequest('Only synthetic demo patient supported');
            const eventId = body.eventId || nextId('event');
            if (typeof eventId !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(eventId)) {
                return badRequest('Invalid eventId');
            }
            if (completedEvents.has(eventId)) {
                return response(200, { ...completedEvents.get(eventId), replayed: true });
            }
            const isDue = body.type === 'followup_due';
            if (isDue && ![1, 3, 7, 14].includes(body.day)) return badRequest('Invalid follow-up day');
            if (!isDue && body.type !== 'checkin_response') return badRequest('Supported event types: checkin_response, followup_due');
            let assessment;
            try {
                if (!isDue) assessment = assessSyntheticSignals(
                    body, state.intersystems.connected ? state.intersystems.record : null);
            }
            catch (err) { return badRequest(err.message); }
            const event = {
                tenantId: TENANT, patientId: PATIENT, eventId,
                type: isDue ? 'followup_due' : 'checkin_response'
            };
            if (isDue) event.day = body.day;
            else event.responseCode = assessment.level === 'critical' ? 'EMERGENCY_HELP' :
                assessment.level === 'routine' ? 'OK' :
                assessment.level === 'unknown' ? 'FREE_TEXT' : 'NEED_CALLBACK';

            pendingInputs.set(eventId, body);
            if (assessment) pendingAssessments.set(eventId, assessment);
            try {
                const execution = await copilot.run(event);
                if (execution.status !== 'completed') {
                    return response(409, { status: execution.status, eventId });
                }
                if (assessment) {
                    state.assessment = { ...assessment, eventId, assessedAt: timestamp(),
                        source: 'SYNTHETIC_RULES_NOT_PRODUCTION_ONEBRAIN' };
                    timeline('onebrain', 'Simulated OneBrain policy: ' +
                        assessment.level.toUpperCase() + ' → ' + assessment.action);
                } else {
                    timeline('schedule', 'Scheduled follow-up day ' + body.day + ' processed');
                    state.followupSchedule = state.followupSchedule.map(f =>
                        f.day === body.day ? { ...f, status: 'simulated' } : f);
                }
                const result = { eventId, status: 'completed', assessment: assessment || null,
                    receipts: execution.receipts, simulated: true };
                completedEvents.set(eventId, result);
                return response(201, result);
            } finally {
                pendingInputs.delete(eventId);
                pendingAssessments.delete(eventId);
            }
        }
        if (method === 'GET' && path === '/v1/patients/' + PATIENT + '/assessment') {
            return state.assessment ? response(200, state.assessment) :
                response(404, { error: 'No synthetic assessment yet' });
        }
        if (method === 'GET' && path === '/v1/tasks') {
            return response(200, { tasks: state.tasks });
        }
        const taskMatch = path.match(/^\/v1\/tasks\/(task-[0-9]+)\/(acknowledge|resolve)$/);
        if (method === 'POST' && taskMatch) {
            const task = state.tasks.find(t => t.id === taskMatch[1]);
            if (!task) return notFound();
            const action = taskMatch[2];
            if (action === 'acknowledge') {
                if (task.status === 'resolved') return badRequest('Task is already resolved');
                task.status = 'acknowledged';
                task.owner = 'Demo Nurse';
                timeline('nurse', 'Demo Nurse acknowledged ' + task.id);
            } else {
                if (task.status !== 'acknowledged') return badRequest('Nurse must acknowledge before resolving');
                task.status = 'resolved';
                task.resolvedAt = timestamp();
                timeline('nurse', 'Demo Nurse reviewed and resolved ' + task.id);
                timeline('followup', 'Next follow-up remains scheduled in the demo');
            }
            return response(200, { task });
        }
        return notFound();
    }

    return { handle, snapshot };
}

module.exports = { createDemoApi, assessSyntheticSignals, TENANT, PATIENT };
