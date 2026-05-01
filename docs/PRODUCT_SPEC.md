# Hanna — Care Intelligence Product Specification

> **Version**: 3.0  
> **Date**: May 1, 2026  
> **Status**: Active source of truth  
> **Strategy**: Care Intelligence-first

---

## 1. Product definition

Hanna is **Care Intelligence** for chronic care teams.

**Locked positioning:**

> Turn clinic visits into guided care.

**Supporting line:**

> Hanna creates the documentation, care plan, LINE follow-up, and nurse priority list after each visit.

Hanna is not sold as a standalone AI scribe, chatbot, dashboard, or remote monitoring tool. Those are components of one care intelligence system.

---

## 2. What Hanna sells

Hanna sells the care loop after a clinic visit:

```text
Visit → Documentation → Care plan → LINE follow-up → Risk signal → Nurse priority → Outcome report
```

The buyer is paying for:

- reduced documentation burden
- guided care plans after each visit
- LINE-based patient follow-up
- visibility between visits
- exception-based nurse workflow
- monthly leadership reporting

---

## 3. Product hierarchy

### 3.1 Hanna Care Intelligence

This is the product.

It includes:

- clinician-reviewed note workflow
- care plan generation
- LINE follow-up handoff
- risk signal capture
- nurse priority queue
- monthly leadership reports
- setup and workflow support

### 3.2 Hanna Scribe

Scribe is the front door into Care Intelligence.

It captures the clinical visit and creates the structured note used to generate the care plan and downstream follow-up. It should not be positioned as the primary standalone product unless explicitly approved later.

### 3.3 LINE Follow-up

LINE is the patient channel. It should feel natural for Thai patients and require no new app download.

### 3.4 Nurse Dashboard

The nurse dashboard answers one question:

> Who needs attention today?

It should avoid analytics clutter and prioritize exception-based action.

### 3.5 Reporting

Reports exist to prove value to leadership.

They should show:

- patient follow-up activity
- response rates
- missed check-ins
- risk signals
- nurse review activity
- escalations
- 90-day pilot outcomes

---

## 4. Locked packaging and pricing

| Package | Price | Purpose |
|---|---:|---|
| **Hanna Pilot** | **฿60,000/month for 90 days** | Prove the care loop with one clinic or department |
| **Hanna Care Intelligence** | **฿85,000/month, billed annually** | Annual department-level care intelligence system |
| **Hanna Enterprise** | **From ฿250,000/month, annual only** | Multi-department, hospital group, or payer rollout |

Do not use the old annual price of ฿50,000/month in new sales or product documentation.

Do not lead with Free/Pro/Clinic Scribe pricing. That creates the wrong comparison and weakens the enterprise Care Intelligence offer.

---

## 5. Ideal buyer

Primary early buyer:

- chronic care clinic
- private hospital department
- NCD clinic
- post-discharge or follow-up program
- care team with nurse capacity pressure

Best first pilot:

```text
One department
50–200 patients
One measurable follow-up problem
90 days
Monthly report
```

---

## 6. Product experience standard

Hanna must feel:

- medical-grade
- calm
- reliable
- minimal
- useful within the first session
- low-friction for clinicians and nurses

Avoid:

- feature sprawl
- heavy dashboards
- generic AI claims
- standalone scribe positioning
- complicated setup flows
- overbuilt analytics before pilot proof

---

## 7. Core user journeys

### Doctor journey

```text
Open Scribe → Capture visit → Review note → Approve care plan → Send follow-up handoff
```

Goal: reduce documentation burden and create a structured care plan without extra admin work.

### Patient journey

```text
Receive LINE follow-up → Answer check-in → Share symptom/adherence update → Escalate only when needed
```

Goal: continue care without app download or complicated portals.

### Nurse journey

```text
Open priority queue → Review risk signals → Contact patients who need attention → Mark action taken
```

Goal: focus on exceptions, not manually chase every patient.

### Leadership journey

```text
Review monthly report → Understand follow-up performance → Decide whether to continue or expand
```

Goal: prove operational value and justify annual contract.

---

## 8. System components

### Scribe app

Purpose: visit capture and note generation.

Current standard:

- mobile-first PWA
- minimal, medical-grade UI
- quick capture flow
- structured clinical note
- care plan handoff

### Backend API

Purpose: shared platform logic.

Responsibilities:

- auth
- session storage
- note generation
- care plan generation
- LINE follow-up orchestration
- risk signal processing
- dashboard APIs
- reporting data

### LINE bot

Purpose: patient follow-up channel.

Responsibilities:

- check-ins
- reminders
- patient replies
- adherence signals
- symptom escalation

### Nurse dashboard

Purpose: exception-first workflow.

Responsibilities:

- priority list
- patient state
- risk flags
- review status
- follow-up activity

### Landing page

Purpose: sell the annual Care Intelligence system.

Current hero:

> Turn clinic visits into guided care.

---

## 9. Repository map

| Repo | Role | Status |
|---|---|---|
| `hanna-landing` | Public website | Active |
| `hanna-scribe` | Scribe PWA | Active component |
| `hanna-dashboard` | Care intelligence dashboard | Active component |
| `hanna-backend` | Backend services | Active component |
| `hanna-line-bot` | LINE follow-up and legacy platform docs | Active but needs continued cleanup |
| `hanna-nurse-dashboard` | Older nurse dashboard | Review before using |
| `Hanna-Ai-Nurse` | Older/legacy surface | Review before using |
| `Fastcare-Hanna-Ai` | Legacy concept repo | Archive candidate |

---

## 10. Documentation policy

Important docs must reinforce the current strategy:

```text
Care Intelligence first.
Scribe is the front door.
Guided care is the promise.
Pilot converts to annual.
```

Remove or rewrite documents that lead with:

- Scribe-first strategy
- Free/Pro/Clinic pricing as the main business
- old ฿50,000 annual pricing
- generic AI Studio / Vite template language
- broad product-suite language that creates confusion

---

## 11. Definition of done

A Hanna feature is done when it supports at least one part of the care loop:

```text
Visit → Documentation → Care plan → LINE follow-up → Risk signal → Nurse priority → Outcome report
```

And when it meets these standards:

- works on mobile and desktop
- has loading, empty, and error states
- reduces user friction
- matches the Hanna visual system
- avoids unnecessary clicks
- supports the pilot-to-annual business model

---

## 12. Product rule

If a feature does not help a buyer understand, trust, operate, or renew Hanna Care Intelligence, it should be hidden, simplified, or removed.
