'use strict';

/**
 * Safety-first, dependency-injected nurse follow-up agent foundation.
 *
 * No database, LINE, network or LLM side effects are imported here.
 * Adapters MUST enforce tenant authorization, durable atomic event claims,
 * action-level idempotency, and successful delivery receipts before rollout.
 * This module is NOT connected to live LINE traffic.
 */

const RESPONSE_CODES = new Set(['OK', 'NEED_CALLBACK', 'EMERGENCY_HELP', 'FREE_TEXT']);
const FOLLOWUP_DAYS = new Set([1, 3, 7, 14]);

function validateEvent(event) {
    if (!event || typeof event !== 'object') throw new Error('Event required');
    for (const field of ['eventId', 'tenantId', 'patientId']) {
        if (typeof event[field] !== 'string' || !event[field].trim()) {
            throw new Error(`Missing or invalid ${field}`);
        }
    }
    if (event.type === 'checkin_response') {
        if (!RESPONSE_CODES.has(event.responseCode)) {
            throw new Error('Unsupported response code: free text must be explicitly classified FREE_TEXT');
        }
    } else if (event.type === 'followup_due') {
        if (!FOLLOWUP_DAYS.has(event.day)) throw new Error('Unsupported follow-up day');
    } else {
        throw new Error('Unsupported event type');
    }
    return event;
}

function planActions(event, patient) {
    const canMessage = patient.enrollmentStatus === 'active' &&
        patient.messagingConsent === true && patient.lineVerified === true;

    if (event.type === 'followup_due') {
        return canMessage
            ? [{ tool: 'queueTemplate', args: { template: `FOLLOWUP_DAY_${event.day}` } }]
            : [{ tool: 'recordHold', args: { reason: 'Consent, verified LINE or active enrollment missing' } }];
    }

    const actions = [{ tool: 'recordCheckin', args: { responseCode: event.responseCode } }];
    switch (event.responseCode) {
        case 'OK':
            // An exact structured response only; no free-text clinical interpretation.
            if (canMessage) actions.push({ tool: 'queueTemplate', args: { template: 'CHECKIN_ACK' } });
            break;
        case 'NEED_CALLBACK':
            actions.push({ tool: 'createNurseTask', args: { priority: 'high', type: 'callback_requested' } });
            if (canMessage) actions.push({ tool: 'queueTemplate', args: { template: 'REVIEW_PENDING' } });
            break;
        case 'EMERGENCY_HELP':
            actions.push({ tool: 'createNurseTask', args: { priority: 'critical', type: 'emergency_help_requested' } });
            if (canMessage) actions.push({ tool: 'queueTemplate', args: { template: 'EMERGENCY_CONTACT_SERVICES' } });
            break;
        case 'FREE_TEXT':
            // Any free-text response goes to a human; no potentially unsafe low-risk inference.
            actions.push({ tool: 'createNurseTask', args: { priority: 'high', type: 'unclassified_patient_message' } });
            if (canMessage) actions.push({ tool: 'queueTemplate', args: { template: 'REVIEW_PENDING' } });
            break;
    }
    return actions;
}

function createNurseCopilot({ tools, store }) {
    if (!tools || !store) throw new Error('Tools and durable store adapters required');
    for (const method of ['loadPatient', 'recordDecision', 'recordCheckin',
        'recordHold', 'createNurseTask', 'queueTemplate']) {
        if (typeof tools[method] !== 'function') throw new Error(`Missing tool: ${method}`);
    }
    for (const method of ['claim', 'complete', 'fail']) {
        if (typeof store[method] !== 'function') throw new Error(`Missing store method: ${method}`);
    }

    return {
        async run(rawEvent) {
            const event = validateEvent(rawEvent);
            // The adapter must atomically claim events and permit retry of failed claims.
            const claim = await store.claim(event.tenantId, event.eventId);
            if (!claim || claim.acquired !== true) {
                return { status: 'duplicate_or_in_progress', eventId: event.eventId };
            }

            try {
                const patient = await tools.loadPatient({
                    tenantId: event.tenantId, patientId: event.patientId
                });
                if (!patient || patient.tenantId !== event.tenantId ||
                    patient.id !== event.patientId) {
                    throw new Error('Patient not found in authorized tenant');
                }

                const actions = planActions(event, patient);
                await tools.recordDecision({
                    tenantId: event.tenantId, patientId: event.patientId,
                    eventId: event.eventId, eventType: event.type,
                    decision: actions.map(a => a.tool), // no PHI in decisions
                    idempotencyKey: `${event.tenantId}:${event.eventId}:decision`
                });

                const receipts = [];
                for (let i = 0; i < actions.length; i++) {
                    const action = actions[i];
                    // Each real tool adapter MUST persistently deduplicate by this key.
                    const idempotencyKey = `${event.tenantId}:${event.eventId}:${i}:${action.tool}`;
                    const receipt = await tools[action.tool]({
                        tenantId: event.tenantId,
                        patientId: event.patientId,
                        eventId: event.eventId,
                        idempotencyKey,
                        ...action.args
                    });
                    if (!receipt || !receipt.id) {
                        throw new Error(`Tool ${action.tool} did not return a verifiable receipt`);
                    }
                    receipts.push({ tool: action.tool, id: receipt.id });
                }

                await store.complete(event.tenantId, event.eventId, receipts);
                return { status: 'completed', eventId: event.eventId, receipts };
            } catch (error) {
                // Never swallow a failure. Operational adapter should alert on repeated failure.
                try {
                    await store.fail(event.tenantId, event.eventId, error.message);
                } catch (markFailedError) {
                    error.failureRecordingError = markFailedError;
                }
                throw error;
            }
        }
    };
}

module.exports = { createNurseCopilot, planActions, validateEvent };
