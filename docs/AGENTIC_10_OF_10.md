# Hannah Nurse Copilot: definition of 10/10 and safe upgrade

## Product boundary

An agentic, LINE-first post-discharge follow-up and nurse task-routing system.
Autonomy applies to consented administrative messaging and workflow coordination,
NOT medical diagnosis, medication adjustment, autonomous clinical triage, or decisions
to withhold emergency escalation.

**Status:** initial additive prototype foundation. Not integrated with live traffic.
No claim of clinical validation, production readiness, or passing CI.

## Definition of 10/10 (release gates, not a subjective rating)

### Gate A: repeatable synthetic-patient prototype
1. Enroll and verify a synthetic patient's LINE identity and hospital tenant.
2. Run a configured discharge follow-up schedule with approved message templates.
3. Capture structured replies, missing replies, and free text without silently discarding them.
4. Patient requests for emergency help always create an actionable critical task and display
   a locally approved emergency-contact template; never silently cap/suppress critical tasks.
5. All unclassified free text routes to nurse review; missing observations are never marked safe.
6. Nurse can acknowledge, own, resolve, and audit tasks end-to-end.
7. Duplicate events and retry attempts do not duplicate nurse tasks or patient sends.
8. All steps have traceable evidence; failure-injection and synthetic end-to-end tests pass.
9. Zero false "uptime", "crises prevented", or "capacity multiplier" claims from placeholders.
10. Demonstrate actual nurse-workflow timing and completion measurements.

### Gate B: hospital pilot (requires Gate A)
- Clinician-approved protocols, language, and escalation expectations.
- Thai PDPA review, hospital data-processing agreements, access policies and consent.
- Tested authentication/authorization and enforced tenant isolation on every query.
- Secret rotation, dependency review, abuse protection, backups, and verified recovery.
- Durable jobs, retries, timeouts, dead-letter handling, operational alerts, runbooks and SLOs.
- A human-staffed escalation pathway and coverage-hours disclosure.
- Prospective monitored study with measured alert precision, missed escalations,
  task resolution times, patient comprehension and nurse time saved.

### Gate C: production (requires pilot evidence)
- Independent security assessment, clinical risk management, disaster recovery exercises,
  approved language/localization, privacy assessment, regulated-product classification,
  and formally accepted hospital operational risk.

## Agent execution model

Event -> verify tenant/patient -> atomically claim event -> plan allowable actions ->
write decision audit -> execute allowlisted tools -> verify receipts -> complete event.

On any error, mark failed, surface failure, and retry idempotently after remediation.
No model-generated messages or clinical decisions are sent to patients automatically.

The initial module is `src/agentic/nurseCopilot.js`. It has no live dependencies.
Integration adapters must implement:
- `store.claim(tenantId, eventId)`: atomic durable idempotency claim.
- `store.complete(tenantId, eventId, receipts)`, `store.fail(tenantId, eventId, error)`.
- `tools.loadPatient({tenantId, patientId})`: enforce tenant and patient authorization.
- `tools.recordDecision(...)`: durable audit record.
- `tools.recordCheckin(...)`: durable check-in/event record.
- `tools.createNurseTask(...)`: persistent task, unique idempotency key.
- `tools.queueTemplate(...)`: permitted, approved template queue with unique idempotency
   key; patient consent and verified LINE identity must be rechecked in adapter.
- `tools.recordHold(...)`: persistent hold/reason record.

Each action returns `{ id: durableReceiptId }`. Adapters must enforce idempotency on
their side; a process-memory map is NOT sufficient for a real hospital system.
Follow-up messages must not dispatch directly inside the agent orchestration step.

## Known blockers in the current repository

- `OneBrain.calculateRisk` returns low risk for missing summary data.
- `OneBrain.analyzePatient` logs and swallows processing failures.
- Critical task cap can suppress urgent alerts, creating a dangerous failure mode.
- Some nurse infrastructure metrics are hardcoded, not observed.
- Existing tests include reimplementations/mocks of risk logic instead of production-path coverage.
- Legacy system-wide nurse auth and default LINE tenant enrollment require hardening.

**Do not enable this module in production or replace current workflows with it
until adapter design, authorization, transactional semantics, clinical protocols,
and actual end-to-end tests have been reviewed.**

## Execution roadmap

1. Agent core and synthetic unit tests (this branch).
2. Durable Postgres event/action ledger and tenant-isolated adapters.
3. Feature-flagged shadow execution and verified LINE sandbox demo.
4. Nurse task lifecycle and nurse-approved response workflow.
5. Observability, failure injection, security gates, measured nurse workload.
6. Clinical governance and controlled supervised hospital pilot.

## Local unit test

```sh
node --test tests/agentic-nurse-copilot.test.js
```
