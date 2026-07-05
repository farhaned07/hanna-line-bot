# Hanna Care Intelligence — LINE Follow-up Bot

LINE bot component for **Hanna Care Intelligence**, focused on patient follow-up, care-plan delivery, and care-team visibility after a clinic visit.

This repository represents one component of the broader Hanna care loop.

## Product context

Hanna is built around the idea that the clinical visit should not end when the patient leaves the room. The system turns a visit into structured documentation, a patient-friendly care plan, and a follow-up path that care teams can monitor.

```text
Visit → Documentation → Care plan → LINE follow-up → Risk signal → Nurse priority → Outcome report
```

## What this component does

- Connects patient follow-up to a familiar messaging channel
- Supports care-plan delivery after a visit
- Helps capture follow-up signals that may need nurse attention
- Fits into a supervised clinical workflow rather than replacing care-team judgment

## What this demonstrates

- Healthcare workflow decomposition into deployable components
- Messaging-channel integration for clinical follow-up
- Product thinking around continuity of care
- Practical architecture for pilot-ready healthcare AI systems

## System role

```text
Scribe / visit capture
        ↓
Structured note + care plan
        ↓
LINE follow-up bot
        ↓
Risk signal / nurse dashboard / reporting
```

## Development

```bash
npm install
npm start
```

Environment variables depend on the deployment target and may include LINE, database, AI provider, and authentication credentials.

## Compliance posture

Hanna is supervised care infrastructure. AI drafts, organizes, and routes information for review. Licensed clinicians and care teams remain responsible for confirmation, escalation, diagnosis, and treatment decisions.

## Portfolio note

This project shows my forward-deployed engineering approach: break a real healthcare operation into usable system components, then design the technical path from workflow to pilot-ready software.
