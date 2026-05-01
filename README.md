# Hanna Care Intelligence

Hanna turns clinic visits into guided care.

> Hanna creates the documentation, care plan, LINE follow-up, and nurse priority list after each visit.

This repo contains platform/backend documentation and legacy components for the Hanna Care Intelligence ecosystem.

## Current strategy

Hanna is sold as **Care Intelligence**, not as standalone Scribe.

Scribe is the front door. The product is the full care loop:

```text
Visit → Documentation → Care plan → LINE follow-up → Risk signal → Nurse priority → Outcome report
```

## What Hanna sells

Hanna helps chronic care teams:

- document visits faster
- create care plans from each visit
- continue follow-up through LINE
- capture patient risk signals
- prioritize nurse attention
- report outcomes to leadership

## Locked packaging

| Package | Price | Purpose |
|---|---:|---|
| Hanna Pilot | ฿60,000/month for 90 days | Prove the care loop with one clinic or department |
| Hanna Care Intelligence | ฿85,000/month, billed annually | Annual department-level care intelligence system |
| Hanna Enterprise | From ฿250,000/month, annual only | Multi-department, hospital group, or payer rollout |

Do not use the old standalone Scribe Free/Pro/Clinic pricing as the main business model. Do not use the old ฿50,000/month annual price in new material.

## Core components

| Component | Role |
|---|---|
| Scribe | Captures the visit and creates clinician-reviewed documentation |
| Care plan | Converts the visit into patient-friendly next steps |
| LINE bot | Runs follow-up through a familiar patient channel |
| Risk engine | Converts symptoms, silence, vitals, and adherence into signals |
| Nurse dashboard | Shows who needs attention today |
| Reports | Prove follow-up activity, escalation, and operational value |

## Important documentation

| Document | Purpose |
|---|---|
| [`docs/PRODUCT_SPEC.md`](./docs/PRODUCT_SPEC.md) | Current product source of truth |
| [`docs/REGULATORY_POSTURE.md`](./docs/REGULATORY_POSTURE.md) | Regulatory and safety posture |
| [`docs/DEPLOYMENT_RUNBOOK.md`](./docs/DEPLOYMENT_RUNBOOK.md) | Deployment guidance |
| [`docs/FOLLOWUP_SYSTEM_GUIDE.md`](./docs/FOLLOWUP_SYSTEM_GUIDE.md) | Follow-up system guide |

## Product rule

If a feature or document does not support the care loop, pilot conversion, annual renewal, or clinical trust, simplify it, rewrite it, or remove it.

## Development

```bash
npm install
npm start
```

Environment variables depend on the deployed component and may include Supabase, LINE, AI provider, and auth credentials.

## Compliance posture

Hanna is supervised care infrastructure. AI drafts and organizes information; licensed care teams review, confirm, and act. Hanna should not be described as autonomous diagnosis or autonomous treatment.
