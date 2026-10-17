# InterSystems x MIT Hacking Medicine Thailand 2026 — Hanna demo

## What wins the technology-fit argument

**Hanna OneBrain API**: hospital FHIR context + patient LINE check-in (simulated) ->
conservative, auditable OneBrain-like workflow -> assigned nurse task -> documented action.

The InterSystems Challenge evaluates innovation, real-world impact, genuine use of
InterSystems technology and technical coherence. It supports cardiovascular and
oncology tracks. Hanna's first wedge is **cardiovascular post-discharge follow-up**.

Official challenge:
https://developer.intersystems.com/intersystems-challenge-mit-hacking-medicine-in-thailand-2026/

Official V2 FHIR/AI kit:
https://github.com/intersystems-community/FHIR-AI-Hackathon-Kit

This branch has a real, read-only InterSystems FHIR R4 **HTTP adapter**.
The connector is optional. The demo remains usable offline, but without a running
IRIS instance it does NOT count as having actually used InterSystems technology.

## Two modes

### Mode A — offline fallback (no hospital infrastructure)

```sh
node scripts/hanna-api-demo.js
```

Open http://127.0.0.1:4178. This proves the executable Hanna REST API and nurse
workflow only. The UI explicitly marks InterSystems FHIR as **not connected**.

### Mode B — recommended InterSystems demo (needs Docker)

**1. Start official InterSystems IRIS for Health FHIR sandbox.**

In a separate directory:

```sh
git clone --branch V2 --single-branch https://github.com/intersystems-community/FHIR-AI-Hackathon-Kit.git
cd FHIR-AI-Hackathon-Kit
./docker-iris-fhir/start.sh
```

Official kit prerequisites: **Docker and Python**. The kit's start.sh sets up
InterSystems IRIS for Health at `http://127.0.0.1:52773/fhir/r4`,
creates its FHIR service, and loads the provided synthetic data.

**IMPORTANT security precaution**: Before starting Docker, change the two host
port mappings in the kit's `docker-iris-fhir/docker-compose.yml` from
`1972:1972` and `52773:52773` to
`127.0.0.1:1972:1972` and `127.0.0.1:52773:52773`, respectively.
This limits access to your own laptop. The official kit uses illustrative default
SuperUser/SYS sandbox credentials; do not expose those to a public network.
**Never connect this hackathon seed script to a hospital or production server.**

**2. Configure Hanna's local demo.**

In your Hanna clone on branch `feat/agentic-nurse-copilot-foundation`:

```sh
export HANNA_IRIS_FHIR_URL=http://127.0.0.1:52773/fhir/r4
export HANNA_IRIS_USER=SuperUser
export HANNA_IRIS_PASSWORD=SYS
node scripts/seed-hanna-iris-fhir.js
node scripts/hanna-api-demo.js
```

Use the **actual** sandbox credentials if you changed them. Do not commit
credentials to the repository. On PowerShell use `$env:VARIABLE="value"`
instead of `export VARIABLE=value`.

**3. Run the browser demo.**

Open **http://127.0.0.1:4178**, then:

1. Click **Connect InterSystems IRIS**.
2. Verify the FHIR panel reads **LIVE LOCAL FHIR**, an actual FHIR Patient ID,
   synthetic completed encounter, and heart rate from FHIR Observation.
3. Click **Discharge & enroll**.
4. Click **Send Day 1 follow-up** (LINE message is simulated).
5. Click **Patient reports a problem**. OneBrain's synthetic demo policy
   sees the LINE-like check-in AND FHIR heart-rate context.
6. Click **Nurse acknowledges** then **Nurse resolves**.
7. If helpful, show JSON output in the API trace.

Expected seeded resources: Patient, Encounter, Observation (heart rate 112 bpm)
and Condition (synthetic heart failure). These are fictitious and carry the
`https://hanna.care/demo/synthetic` identifier.

The demo **never actually sends LINE messages**. The browser and local API
are working, the InterSystems FHIR read is real **if** the sandbox is connected,
and the risk evaluation is explicitly synthetic and **not** the production
OneBrain implementation or clinically validated decision support.

## API endpoints

- `POST /v1/demo/intersystems/sync`: verifies the marked synthetic FHIR
  Patient resource via InterSystems, reads Encounter, Observation and Condition,
  and displays normalized provenance.
- `POST /v1/enrollments`: starts fixed synthetic patient follow-up.
- `POST /v1/events`: schedules a LINE-like follow-up or records structured response.
- `GET /v1/patients/demo-patient-001/assessment`: returns synthetic assessment
  and observed signal provenance.
- `GET /v1/tasks`: returns nurse tasks.
- `POST /v1/tasks/:id/acknowledge` and `/resolve`: records nurse actions.

No arbitrary hospital patient IDs, external FHIR hosts, live clinical decisions,
or cloud deployments are supported in this demo.

## Why the FHIR connection matters

Without FHIR, the frontend could just be rearranging a chatbot conversation.

With an actual local InterSystems IRIS FHIR server:
- IRIS stores standard **Patient**, **Encounter**, **Condition**, **Observation** data.
- Hanna fetches only the fixed **synthetic** patient using the InterSystems FHIR API.
- OneBrain's *demonstration* policy adds the FHIR observation to the LINE-derived
  signal set and generates a nurse-review task.
- A nurse's actions close the loop in Hanna's API.

This is an interoperability demonstration, **not** an InterSystems partnership,
hospital deployment, or clinically proven predictive-risk system.

## Presentation — concise

> A patient leaves the hospital after a cardiovascular admission. The care team
> loses visibility between appointments.
>
> Hanna is an API-first care intelligence layer. We pull discharge context from
> InterSystems FHIR, check in over LINE, combine patient signals with hospital
> context in OneBrain, and give nurses prioritized actions to close the loop.
>
> We're starting with post-discharge cardiovascular follow-up. The same API
> architecture could support other care programs and patient channels.

## Evidence still missing for a commercial pilot

- Clinical expert review and validated escalation policies.
- Secure hospital-level auth, signed events, consent checks and full data governance.
- A reliable transaction and delivery ledger, not in-memory demo storage.
- End-to-end testing against a real IRIS deployment and live LINE sandbox.
- Hospital workflow integration and measurable staff time savings.

### Official resources

- Challenge: https://developer.intersystems.com/intersystems-challenge-mit-hacking-medicine-in-thailand-2026/
- FHIR AI kit V2: https://github.com/intersystems-community/FHIR-AI-Hackathon-Kit/tree/V2
- The official kit's native setup: `docker-iris-fhir/start.sh`
- Official FHIR R4 service path: `/fhir/r4`, HTTP port 52773

**Important:** InterSystems mentors are available during the event. Ask them to
verify the FHIR server endpoint, read/write permissions, and a safe synthetic
FHIR use case — rather than working with real patient records.
