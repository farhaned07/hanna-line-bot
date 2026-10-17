'use strict';

/**
 * Seed ONLY a locally hosted InterSystems IRIS FHIR R4 sandbox.
 * Writes four explicitly synthetic resources. Never use against live hospitals.
 * Requires explicit HANNA_IRIS_FHIR_URL, USER and PASSWORD environment variables.
 */
const {
    validateLocalFhirUrl, hasIdentifier, SYNTHETIC_SYSTEM, SYNTHETIC_VALUE
} = require('../src/agentic/intersystemsFhirAdapter');

const SYSTEM = SYNTHETIC_SYSTEM;
const patientIdentifier = { system: SYSTEM, value: SYNTHETIC_VALUE };
const encounterIdentifier = { system: SYSTEM, value: 'hanna-demo-encounter-a' };
const observationIdentifier = { system: SYSTEM, value: 'hanna-demo-heart-rate-a' };
const conditionIdentifier = { system: SYSTEM, value: 'hanna-demo-condition-a' };

function createSeeder({ baseUrl, username, password, fetchImpl = global.fetch }) {
    const base = validateLocalFhirUrl(baseUrl);
    if (!username || !password) throw new Error('Explicit local FHIR sandbox credentials required');
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    const headers = {
        Accept: 'application/fhir+json',
        Authorization: auth
    };
    async function request(method, resourceType, { id, identifier, resource } = {}) {
        if (!['Patient', 'Encounter', 'Observation', 'Condition'].includes(resourceType)) {
            throw new Error('Unsupported synthetic FHIR resource');
        }
        const url = base + '/' + resourceType +
            (identifier ? '?identifier=' + encodeURIComponent(identifier.system + '|' + identifier.value) : '');
        const response = await fetchImpl(url, {
            method, redirect: 'error', signal: AbortSignal.timeout(10000),
            headers: { ...headers, ...(resource ? { 'Content-Type': 'application/fhir+json', Prefer: 'return=representation' } : {}) },
            ...(resource ? { body: JSON.stringify(resource) } : {})
        });
        if (!response.ok) throw new Error('FHIR ' + method + ' ' + resourceType + ' returned HTTP ' + response.status);
        const body = await response.json();
        return body;
    }
    async function ensure(resourceType, identifier, createResource) {
        const result = await request('GET', resourceType, { identifier });
        if (result.resourceType !== 'Bundle' || result.type !== 'searchset') {
            throw new Error('FHIR lookup returned an unexpected response');
        }
        const matches = (result.entry || []).map(x => x.resource).filter(x =>
            x?.resourceType === resourceType && hasIdentifier(x, identifier.value, identifier.system));
        if (matches.length > 1) throw new Error('Duplicate synthetic resource; manual cleanup required');
        if (matches.length === 1) return { id: matches[0].id, created: false };
        const saved = await request('POST', resourceType, { resource: createResource });
        if (saved.resourceType !== resourceType || !saved.id) {
            throw new Error('FHIR server did not return the created resource with its ID');
        }
        return { id: saved.id, created: true };
    }
    async function seed() {
        const tag = [{ system: SYSTEM, code: 'synthetic-only', display: 'Hanna hackathon synthetic' }];
        const patient = await ensure('Patient', patientIdentifier, {
            resourceType: 'Patient', meta: { tag }, active: true,
            identifier: [patientIdentifier],
            name: [{ use: 'usual', family: 'Synthetic', given: ['Hanna Patient A'] }]
        });
        const ref = { reference: 'Patient/' + patient.id };
        const encounter = await ensure('Encounter', encounterIdentifier, {
            resourceType: 'Encounter', meta: { tag }, identifier: [encounterIdentifier],
            status: 'finished', class: {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                code: 'AMB', display: 'ambulatory'
            },
            subject: ref,
            period: { start: '2026-10-16T09:00:00+07:00', end: '2026-10-16T12:00:00+07:00' }
        });
        const observation = await ensure('Observation', observationIdentifier, {
            resourceType: 'Observation', meta: { tag }, identifier: [observationIdentifier],
            status: 'final', category: [{
                coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }]
            }],
            code: {
                coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }]
            },
            subject: ref, effectiveDateTime: '2026-10-16T11:00:00+07:00',
            valueQuantity: { value: 112, unit: 'beats/minute', system: 'http://unitsofmeasure.org', code: '/min' }
        });
        const condition = await ensure('Condition', conditionIdentifier, {
            resourceType: 'Condition', meta: { tag }, identifier: [conditionIdentifier],
            clinicalStatus: {
                coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }]
            },
            verificationStatus: {
                coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed' }]
            },
            code: { coding: [{ system: 'http://snomed.info/sct', code: '84114007', display: 'Heart failure' }] },
            subject: ref
        });
        return { syntheticOnly: true, patient, encounter, observation, condition };
    }
    return { seed };
}

if (require.main === module) {
    createSeeder({
        baseUrl: process.env.HANNA_IRIS_FHIR_URL,
        username: process.env.HANNA_IRIS_USER,
        password: process.env.HANNA_IRIS_PASSWORD
    }).seed().then(result => {
        console.log('Seeded synthetic InterSystems FHIR resources (no real patients):');
        console.log(JSON.stringify(result, null, 2));
    }).catch(error => {
        console.error('Synthetic FHIR seed failed:', error.message);
        process.exitCode = 1;
    });
}

module.exports = { createSeeder };
