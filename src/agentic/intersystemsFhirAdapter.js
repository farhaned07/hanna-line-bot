'use strict';

/**
 * Read-only synthetic InterSystems IRIS for Health FHIR R4 adapter.
 * DEMO ONLY. The hostname is restricted to the local computer.
 * Never use for clinical assessment or real patient records.
 */
const SYNTHETIC_SYSTEM = 'https://hanna.care/demo/synthetic';
const SYNTHETIC_VALUE = 'hanna-patient-a';
const IDENTIFIER = SYNTHETIC_SYSTEM + '|' + SYNTHETIC_VALUE;

function validateLocalFhirUrl(input) {
    if (typeof input !== 'string') throw new Error('FHIR URL is required');
    const url = new URL(input);
    const hosts = new Set(['127.0.0.1', 'localhost', '[::1]']);
    if (url.protocol !== 'http:' || !hosts.has(url.hostname) ||
        url.username || url.password || url.search || url.hash ||
        url.pathname.replace(/\/$/, '') !== '/fhir/r4') {
        throw new Error('Demo FHIR endpoint must be http://127.0.0.1:<port>/fhir/r4');
    }
    return url.origin + '/fhir/r4';
}

function entries(bundle, resourceType) {
    if (!bundle || bundle.resourceType !== 'Bundle' || bundle.type !== 'searchset' ||
        !Array.isArray(bundle.entry)) {
        throw new Error('FHIR search did not return an expected searchset Bundle');
    }
    if (bundle.entry.length > 100) throw new Error('Unexpectedly large FHIR search result');
    return bundle.entry.map(x => x && x.resource).filter(x =>
        x && x.resourceType === resourceType && typeof x.id === 'string');
}

function hasIdentifier(resource, value = SYNTHETIC_VALUE, system = SYNTHETIC_SYSTEM) {
    return Array.isArray(resource?.identifier) && resource.identifier.some(i =>
        i?.system === system && i.value === value);
}

function normalizeRecord(patient, encounters, observations, conditions) {
    if (!hasIdentifier(patient)) throw new Error('FHIR patient is not the fixed synthetic demonstration record');
    if (!/^[A-Za-z0-9.\-]{1,64}$/.test(patient.id)) throw new Error('Invalid synthetic Patient ID');
    const patientRef = 'Patient/' + patient.id;
    const isPatient = r => r.subject?.reference === patientRef ||
        r.patient?.reference === patientRef;
    const finished = encounters.filter(e => e.status === 'finished' && isPatient(e));
    const obs = observations.filter(o => o.status === 'final' && isPatient(o) &&
        o.code?.coding?.some(code => code.system === 'http://loinc.org' && code.code === '8867-4') &&
        o.valueQuantity?.code === '/min' && o.valueQuantity?.system === 'http://unitsofmeasure.org' &&
        Number.isFinite(o.valueQuantity?.value));
    obs.sort((a,b) => String(b.effectiveDateTime||'').localeCompare(String(a.effectiveDateTime||'')));
    const rate = obs[0]?.valueQuantity?.value;
    const heartFailure = conditions.some(c => isPatient(c) &&
        c.code?.coding?.some(code => code.system === 'http://snomed.info/sct' && code.code === '84114007'));
    return {
        sourceSystem: 'InterSystems IRIS for Health (local FHIR sandbox)',
        dataSource: 'LIVE_LOCAL_FHIR_SERVER',
        synthetic: true,
        patientFhirId: patient.id,
        encounterFhirId: finished[0]?.id || null,
        encounterCompleted: finished.length > 0,
        conditionContext: heartFailure ? 'Synthetic cardiovascular follow-up' : 'No matching synthetic condition',
        heartRateBpm: rate == null ? null : rate,
        observationFhirId: obs[0]?.id || null,
        observedAt: obs[0]?.effectiveDateTime || null
    };
}

function createInterSystemsFhirAdapter({
    baseUrl, username, password, fetchImpl = global.fetch, timeoutMs = 4000
}) {
    const base = validateLocalFhirUrl(baseUrl);
    if (typeof username !== 'string' || !username ||
        typeof password !== 'string' || !password) {
        throw new Error('Explicit demo FHIR username and password required');
    }
    if (typeof fetchImpl !== 'function') throw new Error('fetch implementation required');
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    const safeTimeout = Math.min(Math.max(Number(timeoutMs) || 4000, 500), 10000);

    async function read(resourcePath, query = '') {
        if (!['Patient','Encounter','Observation','Condition'].includes(resourcePath)) {
            throw new Error('Unsupported read-only FHIR resource');
        }
        const url = base + '/' + resourcePath + '?' + query;
        const response = await fetchImpl(url, {
            method: 'GET', redirect: 'error', signal: AbortSignal.timeout(safeTimeout),
            headers: { Accept: 'application/fhir+json', Authorization: auth }
        });
        if (!response.ok) throw new Error('Local InterSystems FHIR request failed (HTTP ' + response.status + ')');
        const mime = response.headers?.get?.('content-type') || '';
        if (!mime.includes('json')) throw new Error('Unexpected FHIR content type');
        const contentLength = Number(response.headers?.get?.('content-length') || 0);
        if (contentLength > 2_000_000) throw new Error('Unexpectedly large FHIR result');
        const payload = await response.json();
        return entries(payload, resourcePath);
    }

    return {
        async readSyntheticDischarge() {
            const patients = await read('Patient', 'identifier=' + encodeURIComponent(IDENTIFIER) + '&_count=5');
            const matches = patients.filter(p => hasIdentifier(p));
            if (matches.length !== 1) throw new Error('Expected exactly one seeded synthetic FHIR patient');
            const patient = matches[0];
            const param = encodeURIComponent('Patient/' + patient.id);
            const [encounters, observations, conditions] = await Promise.all([
                read('Encounter', 'patient=' + param + '&_count=20'),
                read('Observation', 'patient=' + param + '&_count=50'),
                read('Condition', 'patient=' + param + '&_count=20')
            ]);
            return normalizeRecord(patient, encounters, observations, conditions);
        }
    };
}

module.exports = {
    createInterSystemsFhirAdapter, validateLocalFhirUrl,
    normalizeRecord, hasIdentifier, SYNTHETIC_SYSTEM, SYNTHETIC_VALUE
};
