# Hanna OneBrain API — October 18 synthetic demo

## What the audience should understand in 60 seconds

> Hospitals discharge patients with a plan, but follow-up information is scattered.
> Hanna connects a hospital event, the patient's response over LINE, OneBrain
> workflow assessment, and a nurse's action — through one API.

This demo is a **local, nonclinical simulation**. It contains only the fixed
synthetic record "Patient A". The REST API and agent orchestration are real
working code. The LINE interaction, the risk evaluation policy, and hospital
connection are simulated. It does not run the existing production OneBrain risk
implementation and does not integrate with InterSystems.

## Start (requires a computer with Node.js 18+)

From a fresh terminal:

```sh
git clone --branch feat/agentic-nurse-copilot-foundation --single-branch https://github.com/farhaned07/hanna-line-bot.git
cd hanna-line-bot
node --test tests/agentic-nurse-copilot.test.js tests/agentic-demo-api.test.js
node scripts/hanna-api-demo.js
```

Open **http://127.0.0.1:4178** in your browser. No npm install,
LINE credentials, Groq key, Supabase, or external network is required after
cloning. The server listens on loopback only.

For a repository already cloned:

```sh
git fetch origin feat/agentic-nurse-copilot-foundation
git switch feat/agentic-nurse-copilot-foundation
node --test tests/agentic-nurse-copilot.test.js tests/agentic-demo-api.test.js
node scripts/hanna-api-demo.js
```

Avoid running anything in production or merging the branch as a demo shortcut.
Do not send any real patient data through this API.

## Click sequence (60–90 seconds)

1. **Discharge & enroll:** creates Patient A using POST /v1/enrollments and schedules follow-ups.
2. **Send Day 1 follow-up:** POST /v1/events queues a *simulated* LINE reminder.
3. **Patient reports a problem:** POST /v1/events sends missed medication and feeling
   unwell; a conservative synthetic OneBrain-like rule classifies it for review.
4. **Nurse acknowledges:** the newly created high-priority task is claimed.
5. **Nurse resolves:** the review outcome is recorded and the next follow-up remains scheduled.
6. Optionally show **emergency-help signal**, which creates a new critical task without
   treating it as a real emergency service.

The lower panel shows the REST request and JSON response for each action.

## API surface implemented in the synthetic demo

| Endpoint | Purpose |
|---|---|
| GET /v1/health | Demo-only status |
| POST /v1/enrollments | Fixed synthetic patient enrollment |
| POST /v1/events | Simulated patient check-ins and follow-up due events |
| GET /v1/patients/demo-patient-001/assessment | Last synthetic assessment |
| GET /v1/tasks | Nurse task queue |
| POST /v1/tasks/{id}/acknowledge | Demonstration task acknowledgment |
| POST /v1/tasks/{id}/resolve | Demonstration task resolution |
| GET /v1/demo/state | Demo snapshot |
| POST /v1/demo/reset | Wipe ephemeral demo data |

## Claims you may make

- "This demonstrates a working local REST API and the patient-to-nurse
  orchestration path."
- "The logic for synthetic check-in events, prioritized tasks, escalation
  request, acknowledgments and resolutions is executable and testable."
- "The existing Hanna repository has real LINE messaging, follow-up and
  OneBrain components; those integrations are NOT activated in this demo."

## Claims you must NOT make

- "Hanna is live-integrated with InterSystems."
- "Clinical risk scores are validated or safe for unsupervised medical triage."
- "These are actual LINE messages to a patient."
- "Hospital staff have been notified."
- "The demo is a deployed, production-grade, authenticated multi-tenant API."
- "Hanna has already reduced readmissions or nurse workload."

## Commercial-product build sequence

1. Define stable event, assessment, task and audit resource schemas;
   publish OpenAPI and authentication protocol.
2. Refactor actual OneBrain into a versioned, testable, clinically reviewed
   policy engine; remove unsafe defaults and suppressed urgent alerts.
3. Replace in-memory stores with Postgres idempotency constraints, durable
   event queue/outbox, transactional writes, retries and dead-letter handling.
4. Implement secure hospital tenant isolation, roles, patient consent,
   staff assignment and auditable task ownership.
5. Integrate LINE sandbox and a FHIR/InterSystems test environment (not a live
   hospital), and run failure-injection/e2e coverage.
6. Clinical governance, local approvals, security review, pilot operational
   monitoring, real workflow ROI measurement.

## Demo-specific safety details

- Loopback-only listener at 127.0.0.1; refuses NODE_ENV=production.
- No real LINE, email or hospital API activity.
- Fixed synthetic patient record; rejects arbitrary patient IDs in events.
- Risk demonstrations are explicit synthetic rules, not production risk scoring.
- Limited HTTP JSON payload size; does not require secrets or authentication.
- Persistent stores, production authorizations and clinical risk controls are
  intentionally not implemented by this demo server.

The API demo is a **proof of workflow**, not a hospital integration or a
clinical safety demonstration.
