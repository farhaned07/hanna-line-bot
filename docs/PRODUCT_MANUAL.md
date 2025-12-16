# Hanna Product Manual

**Version**: 1.0  
**Date**: December 17, 2025  
**Classification**: Internal - Founder/Operator Reference  
**Status**: Production Ready

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [User Journeys](#3-user-journeys)
4. [Interface & Wireframe Explanation](#4-interface--wireframe-explanation)
5. [Intelligence Layer](#5-intelligence-layer)
6. [Data & Memory Model](#6-data--memory-model)
7. [Operational Capabilities](#7-operational-capabilities)
8. [Deployment & Environment](#8-deployment--environment-overview)
9. [Demo Walkthrough](#9-demo-walkthrough)
10. [Glossary & Mental Model](#10-glossary--mental-model)

---

## 1. Product Overview

### What Problem Hanna Solves

Healthcare systems in Thailand face a critical constraint: **nurse scarcity**. With chronic disease growing rapidly among an aging population, a small team of nurses cannot physically monitor hundreds of patients daily. The traditional model requires nurses to review all patient data, leading to:

- **Alert fatigue**: Too many notifications, all treated equally
- **Missed signals**: Critical issues buried in routine data
- **Burnout**: Nurses overwhelmed by administrative burden

### What Hanna Is

Hanna is a **nurse force multiplier** — a hybrid intelligence system that:

1. **Collects data systematically** from patients via LINE chat and voice
2. **Assesses risk deterministically** using a transparent scoring formula
3. **Prioritizes exceptions** so nurses see only what requires human judgment

Hanna enables one nurse to effectively monitor 10x more patients by surfacing only the patients who need attention, with full context for immediate action.

### What Hanna Is NOT

- ❌ **NOT a medical triage system** — Hanna does not diagnose or prescribe
- ❌ **NOT a replacement for nurses** — Nurses make all clinical decisions
- ❌ **NOT an autonomous agent** — Every escalation goes to a human
- ❌ **NOT a chatbot for general conversation** — Purpose-built for health monitoring

### Why It Is Structured This Way

The architecture reflects three core principles:

1. **Safety First**: Emergency keywords bypass all logic and immediately escalate
2. **Transparency**: Risk scores use a deterministic formula (not a black box)
3. **Human-in-the-Loop**: Nurses always have final authority

---

## 2. System Architecture Overview

### Layer Model

```
╔═══════════════════════════════════════════════════════════════════╗
║  LAYER 1: USER-FACING SURFACES                                    ║
║  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ║
║  │  LINE Chat Bot  │  │  LIFF Voice App  │  │  Nurse Dashboard │  ║
║  │  (Rich Menu)    │  │  (call.html)     │  │  (React SPA)     │  ║
║  └────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘  ║
╠═══════════╪════════════════════╪═════════════════════╪════════════╣
║  LAYER 2: INTELLIGENCE                               │            ║
║           ▼                    ▼                     │            ║
║  ┌─────────────────────────────────────────┐         │            ║
║  │           OneBrain Service              │         │            ║
║  │  - Risk Calculation (0-10)              │         │            ║
║  │  - Task Generation                      │         │            ║
║  │  - Deduplication Logic                  │         │            ║
║  └────────────────────┬────────────────────┘         │            ║
║                       │                              │            ║
║  ┌────────────────────▼────────────────────┐         │            ║
║  │         Groq Llama 3.3 70B              │◀────────┘            ║
║  │  - Response Generation                  │                      ║
║  │  - Context Understanding                │                      ║
║  └─────────────────────────────────────────┘                      ║
╠═══════════════════════════════════════════════════════════════════╣
║  LAYER 3: DATA / MEMORY                                           ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │                 Supabase PostgreSQL                         │  ║
║  │  chronic_patients │ patient_state │ nurse_tasks │ audit_log │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
╠═══════════════════════════════════════════════════════════════════╣
║  LAYER 4: EXTERNAL INTEGRATIONS                                   ║
║  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────────┐  ║
║  │ LINE API  │  │  LiveKit  │  │  EdgeTTS  │  │  Groq Cloud   │  ║
║  └───────────┘  └───────────┘  └───────────┘  └───────────────┘  ║
╚═══════════════════════════════════════════════════════════════════╝
```

### Component Communication

| From | To | Data | Protocol |
|------|-----|------|----------|
| LINE | Backend | Webhook events | HTTPS POST |
| Backend | Supabase | SQL queries | PostgreSQL |
| Backend | Groq | Chat prompts | REST API |
| LIFF | Backend | Voice text | REST API |
| Backend | EdgeTTS | Text for synthesis | HTTP |
| Dashboard | Backend | API requests | REST + Bearer Token |

### Where State Lives

| State | Storage | TTL |
|-------|---------|-----|
| Patient profile | `chronic_patients` table | Permanent |
| Current risk | `patient_state` table | Updated on each analysis |
| Conversation | In-memory (per request) | Request duration |
| Tasks | `nurse_tasks` table | Until resolved |
| Audit trail | `audit_log` table | Permanent (legal requirement) |

### Where Decisions Are Made

| Decision | Location | Logic |
|----------|----------|-------|
| Emergency detection | `router.js` | Keyword matching (immediate) |
| Risk score | `OneBrain.js` | Deterministic formula |
| Task creation | `OneBrain.js` | Threshold + deduplication |
| Response text | Groq API | AI generation with system prompt |
| Clinical action | Nurse Dashboard | Human decision |

---

## 3. User Journeys

### 3.1 Patient Journey

#### Entry Point
1. Patient adds Hanna LINE Official Account (@hanna)
2. `follow` event triggers onboarding flow
3. PDPA consent flex message displayed
4. Upon consent, patient becomes `active`

#### Daily Interaction Modes

**Text Chat Flow:**
```
Patient: Types message in LINE
    ↓
Backend: router.js receives webhook
    ↓
Router: Checks for emergency keywords
    ↓
[If Emergency]: Immediate 1669 response + CRITICAL task
[If Normal]: Message → Groq → AI response → LINE reply
    ↓
OneBrain: Analyzes patient, updates risk score
    ↓
[If Risk ≥ 5]: Creates nurse task
```

**Voice Call Flow:**
```
Patient: Taps "โทรหาฮันนา" in Rich Menu
    ↓
LIFF: Opens call.html in LINE browser
    ↓
LiveKit: Connects WebRTC room
    ↓
Patient: Speaks (Web Speech API → text)
    ↓
Backend: /api/voice/chat processes text
    ↓
Groq: Generates response
    ↓
EdgeTTS: Generates Thai audio (Premwadee voice)
    ↓
LIFF: Plays audio to patient
```

#### Data Collected
- Vital readings (blood pressure, glucose, weight)
- Medication adherence (yes/no/skipped)
- Symptom descriptions
- Voice transcripts

#### Responses Received
- AI-generated Thai responses (warm, professional tone)
- Flex cards for structured input
- Quick replies for common actions
- Emergency guidance when needed

#### Escalation Logic
| Trigger | Action |
|---------|--------|
| Emergency keyword | Score = 10, Critical task, 1669 prompt |
| Risk ≥ 8 | Critical task created |
| Risk 5-7 | High task created |
| Risk 0-4 | No task (routine) |

### 3.2 Nurse Journey

#### Dashboard Entry
1. Navigate to Vercel dashboard URL
2. Enter Bearer token (VITE_NURSE_TOKEN)
3. System validates token
4. Redirect to Mission Control

#### Mission Control View
- **Metrics Row**: Active patients, Pending actions, Resolved today, Check-ins
- **Critical Alert Banner**: Flashes red if critical tasks exist
- **Triage Queue**: Top priority tasks with patient context
- **AI Log**: Recent OneBrain activities

#### Patient Review
1. Click patient name in task card
2. View patient profile, vitals history, conversation log
3. See OneBrain's risk reasoning
4. Review suggested action

#### Decision Actions
| Action | Effect |
|--------|--------|
| Call Patient | Opens phone dialer (future: LiveKit call) |
| Call Ambulance | Records decision, prompts 1669 guidance |
| Resolve | Opens resolution modal for outcome logging |

#### Resolution Flow
1. Click "Resolve" on task
2. Select outcome: Stable / Escalated / ER / False Alarm
3. Optionally add notes
4. Submit → Task marked complete
5. Audit log records resolution

---

## 4. Interface & Wireframe Explanation

### 4.1 LINE Chat Interface

**What the user sees:**
- Standard LINE chat with Hanna avatar
- Text messages with Thai responses
- Flex cards for structured interactions
- Quick reply buttons for common actions
- Rich Menu (6 buttons) at bottom

**Rich Menu Layout:**

| Row | Button 1 | Button 2 | Button 3 |
|-----|----------|----------|----------|
| Top | 🎙️ โทรหาฮันนา | ❤️ เช็คสุขภาพ | 📊 บันทึกค่า |
| Bottom | 💊 บันทึกกินยา | 👤 โปรไฟล์ของฉัน | ℹ️ ช่วยเหลือ |

**Button Actions:**
- **โทรหาฮันนา**: Opens LIFF voice call app
- **เช็คสุขภาพ**: Triggers health summary message
- **บันทึกค่า**: Opens vitals input flow (BP/Glucose)
- **บันทึกกินยา**: Logs medication taken
- **โปรไฟล์ของฉัน**: Shows patient profile card
- **ช่วยเหลือ**: Lists available commands

### 4.2 LIFF Voice Interface (call.html)

**What the user sees:**
- Dark gradient background (premium feel)
- Green circular avatar with stethoscope emoji
- Pulsing animation when Hanna is speaking
- Status text: "กำลังเชื่อมต่อ...", "พูดได้เลยค่ะ", "กำลังคิด..."
- Transcript box showing conversation
- Red "วางสาย" button to end call

**UI Elements:**
| Element | Purpose |
|---------|---------|
| Avatar circle | Visual representation of Hanna |
| Pulse animation | Indicates AI is processing/speaking |
| Status text | Current state feedback |
| Transcript box | Shows what was said/heard |
| End call button | Disconnects and closes LIFF |

### 4.3 Nurse Mission Control Dashboard

**Page Structure:**

**Login Page:**
- Simple token input
- "Sign In" button
- Error message for invalid token

**Mission Control (Home):**
- Header: "Mission Control" title
- Critical Alert Banner (red, pulsing if critical exists)
- Metrics: Active Patients | Pending Actions | Resolved Today | Check-ins
- Two-column layout:
  - Left: Triage Queue (priority tasks)
  - Right: AI Activity Log + Risk Distribution

**Monitoring View:**
- Filter tabs: All | Critical | High | Pending
- Full task table with columns: Priority, Patient, Trigger, Time, Actions
- Click-through to patient detail

**Patient Detail:**
- Patient header: Name, age, conditions
- Risk indicator (color-coded)
- Vitals chart (7-day trend)
- Conversation history
- Action buttons

---

## 5. Intelligence Layer

### Inputs Received

OneBrain receives data from multiple sources:

| Source | Data Type | Trigger |
|--------|-----------|---------|
| LINE Message | Text content | Every message |
| Voice Transcript | Text from STT | Every voice interaction |
| Vitals Entry | BP/Glucose values | User reports |
| Medication Log | Taken/Skipped | User reports |
| Silence Timer | Time since last contact | Scheduler |

### Data Structuring

OneBrain structures patient context as:
```javascript
{
  patient: {
    id: 123,
    name: "คุณสมหญิง",
    age: 65,
    condition: "Diabetes Type 2"
  },
  healthSummary: {
    averageGlucose: 180,
    adherencePercent: 75,
    totalCheckIns: 5,
    lastVitals: { ... }
  },
  triggerEvent: "chat:น้ำตาล 180"
}
```

### Risk Assessment

**The Formula (Deterministic):**

| Factor | Points | Condition |
|--------|--------|-----------|
| Emergency Keyword | +10 (Override) | Chest pain, breathing, fainting |
| Vital Danger | +2 | BP >180/110, Glucose >400 or <70 |
| Missed Meds | +2 | >3 consecutive days |
| Worsening Trend | +1 | 3+ days trending worse |
| Silence | +1 | >48 hours no contact |
| Age Modifier | ×1.2 | If age > 70 |

**Level Thresholds:**
- 0-4: Low (Green) — No action
- 5-7: High (Orange) — Task created
- 8-10: Critical (Red) — Immediate task

### Summary Generation

For each patient, OneBrain generates:
- Risk score (0-10)
- Risk level (low/high/critical)
- Reasons array (human-readable explanations)

### Nurse Support

The dashboard displays:
- **Trigger**: What caused this alert
- **Context**: Recent vitals, medication history
- **Brain Suggestion**: Recommended action (informational only)

### What OneBrain Does NOT Do

- ❌ Does NOT diagnose medical conditions
- ❌ Does NOT prescribe medications or dosages
- ❌ Does NOT make treatment decisions
- ❌ Does NOT automatically contact patients
- ❌ Does NOT override nurse judgment

### Where Humans Are Always In Control

| Situation | Human Authority |
|-----------|-----------------|
| All clinical decisions | Nurse decides action |
| Emergency response | Patient/Nurse calls 1669 |
| Task resolution | Nurse marks outcome |
| Patient escalation | Nurse contacts doctor |
| System tuning | Admin adjusts thresholds |

---

## 6. Data & Memory Model

### What Data Is Stored

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `chronic_patients` | Patient registry | line_user_id, name, age, condition, enrollment_status |
| `patient_state` | Current risk snapshot | risk_score, risk_level, risk_reasoning, last_assessment |
| `nurse_tasks` | Action queue | patient_id, priority, status, reason, created_at |
| `vitals_log` | Health measurements | type, value (JSON), source, recorded_at |
| `chat_history` | Conversation record | role, content, message_type |
| `audit_log` | Legal trail | actor, action, details, timestamp |
| `check_ins` | Daily interactions | glucose, notes, created_at |

### When Data Is Stored

| Event | Data Written |
|-------|--------------|
| User sends message | chat_history row |
| User reports vitals | vitals_log row |
| OneBrain analyzes | patient_state update, audit_log row |
| Task created | nurse_tasks row, audit_log row |
| Task resolved | nurse_tasks update, audit_log row |

### Data Retention

| Data Type | Retention |
|-----------|-----------|
| Patient profile | Permanent (until deletion request) |
| Vitals log | Permanent |
| Chat history | Permanent |
| Audit log | Permanent (legal requirement) |
| Tasks | Permanent (historical analysis) |

### Voice Data

- **Transcripts**: Stored as chat_history (text only)
- **Audio files**: NOT stored permanently (privacy)
- **Voice responses**: Generated on-demand, not cached

---

## 7. Operational Capabilities

### Concurrent Users

**Design Intent:**
- LINE webhook handles bursts via Railway scaling
- Database connections pooled via Supabase
- No hard-coded user limits

**Practical Capacity:**
- Railway free tier: Suitable for pilot (50-100 patients)
- Railway pro: Scales to thousands with autoscaling

### Nurse-to-Patient Scaling

The system is designed for **1 nurse : 100+ patients** ratio through:
- Exception-based alerting (only show what matters)
- Risk prioritization (critical first)
- Context enrichment (no data lookup needed)

### Monitoring vs Response

| Capability | Implementation |
|------------|----------------|
| Passive monitoring | Scheduler checks silent patients |
| Active response | Nurse-initiated via dashboard |
| Automated alerts | OneBrain creates tasks |
| Manual outreach | Nurse decides when to call |

### Reliability Expectations

| Service | Expected Uptime | Fallback |
|---------|-----------------|----------|
| Railway backend | 99.9% | None (single instance) |
| Supabase database | 99.95% | Graceful error messages |
| Groq API | 99% | Fallback text response |
| LiveKit | 99.9% | "Call failed" message |
| LINE API | 99.99% | Retries built-in |

### Known Limitations

1. **No offline mode**: Requires internet for all interactions
2. **Thai language only**: AI optimized for Thai speakers
3. **Single nurse pool**: No multi-team support yet
4. **No video**: Voice only, no video calls
5. **Manual deployment**: No CI/CD pipeline

### Dependencies

| External Service | Criticality |
|------------------|-------------|
| LINE Platform | Critical (no fallback) |
| Supabase | Critical (data storage) |
| Groq | High (has fallback text) |
| LiveKit | Medium (voice optional) |
| EdgeTTS | Medium (voice optional) |

### Failure Modes

| Failure | User Impact | Recovery |
|---------|-------------|----------|
| Backend down | All services unavailable | Railway auto-restart |
| Database down | Data not saved | Error shown, manual retry |
| Groq timeout | AI response delayed | Fallback generic response |
| LiveKit failure | Voice call doesn't work | User prompted to type instead |

---

## 8. Deployment & Environment Overview

### Where the System Is Deployed

| Component | Platform | Region |
|-----------|----------|--------|
| Backend API | Railway | US-West (default) |
| Nurse Dashboard | Vercel | Edge (global) |
| Database | Supabase | Singapore (ap-southeast-1) |
| Voice | LiveKit Cloud | Auto-route |

### What Runs Where

**Railway (hanna-line-bot-production.up.railway.app):**
- Express.js server
- LINE webhook handler
- OneBrain service
- Voice API endpoints
- Nurse API endpoints
- LIFF static files (call.html)

**Vercel (hanna-nurse-dashboard):**
- React SPA
- Tailwind CSS
- API calls to Railway backend

**Supabase:**
- PostgreSQL database
- Connection pooling (pgbouncer)
- Real-time subscriptions (available, not used)

### Environment Separation

Currently, there is **one environment: Production**.

| Aspect | Production |
|--------|------------|
| Backend URL | hanna-line-bot-production.up.railway.app |
| Database | hozputqagilvsbilojgr.supabase.co |
| LINE Bot | @hanna (official) |
| LIFF ID | 2008593893-Bj5k3djg |

### What "Production" Means

- Real patient data
- Real LINE channels
- Real nurse access
- Audit logging enabled
- No test data mixage

---

## 9. Demo Walkthrough

### Prerequisites
- Access to LINE app (user role)
- Access to Nurse Dashboard URL (nurse role)
- Test patient already enrolled

### Demo Script (5 minutes)

#### Part 1: Patient Experience (2 min)

1. **Open LINE**
   - Show Hanna chat
   - Point out Rich Menu (6 buttons)

2. **Demonstrate Text Chat**
   - Type: "สวัสดีค่ะ"
   - Wait for AI response (warm Thai greeting)
   - Explain: "Every message goes through Groq Llama 3.3"

3. **Demonstrate Vitals Input**
   - Tap "บันทึกค่า" in Rich Menu
   - Select "Blood Pressure" or "Glucose"
   - Show instruction card
   - Type: "น้ำตาล 180"
   - Explain: "This is logged and analyzed"

4. **Demonstrate Voice Call** (if working)
   - Tap "โทรหาฮันนา"
   - Show LIFF loading
   - Wait for connection (green circle)
   - Say: "สวัสดีค่ะ วันนี้เป็นอย่างไรบ้าง"
   - Wait for audio response
   - Tap "วางสาย" to end

#### Part 2: Emergency Detection (1 min)

1. **Trigger Emergency**
   - Type: "เจ็บหน้าอก" (chest pain)
   - Show immediate response: "🚨 กรุณาโทร 1669 ทันที"
   - Explain: "Emergency keywords bypass AI, go directly to critical"

#### Part 3: Nurse Dashboard (2 min)

1. **Open Dashboard**
   - Navigate to Vercel URL
   - Login with token

2. **Show Mission Control**
   - Point out metrics
   - Show Critical Alert Banner (if exists)
   - Explain: "This is exception-based — we only show what needs attention"

3. **Review Task**
   - Click on a task card
   - Show patient context
   - Show Brain suggestion
   - Explain: "Nurse sees WHY this patient needs attention"

4. **Demonstrate Resolution**
   - Click "Resolve"
   - Select outcome
   - Explain: "This closes the loop and improves the system"

### Demo Tips

- Keep it moving — don't wait too long for responses
- Emphasize the "exception-based" philosophy
- Show the human-in-the-loop clearly
- Have backup screenshots if services are slow

---

## 10. Glossary & Mental Model

### Glossary

| Term | Definition |
|------|------------|
| **OneBrain** | The central intelligence service that calculates risk scores and creates nurse tasks |
| **Risk Score** | A 0-10 number indicating patient urgency (higher = more urgent) |
| **Task** | An actionable item for a nurse on the dashboard |
| **LIFF** | LINE Front-end Framework — web apps inside LINE |
| **Rich Menu** | The 6-button navigation at the bottom of LINE chat |
| **Flex Card** | A structured message format in LINE with buttons and layout |
| **Mission Control** | The nurse dashboard home page with real-time overview |
| **Triage Queue** | The prioritized list of patients needing attention |
| **Active Nudge** | Proactive outreach to silent patients |
| **De-duplication** | Logic preventing multiple tasks for same patient within 4 hours |
| **Edge TTS** | Microsoft's text-to-speech service (Thai voice: Premwadee) |
| **LiveKit** | WebRTC service for real-time voice |
| **Groq** | AI inference service running Llama 3.3 70B |
| **Supabase** | PostgreSQL database-as-a-service |
| **Railway** | Cloud platform hosting the backend |
| **Vercel** | Cloud platform hosting the dashboard |

### Key Concepts

**Force Multiplication**: Enabling one nurse to effectively monitor 100+ patients by surfacing only exceptions.

**Exception-Based**: Don't show everything; show only what requires human judgment.

**Deterministic Risk**: The scoring formula is transparent and reproducible, not a black box.

**Human-in-the-Loop**: AI assists; humans decide. No automated clinical actions.

**Audit Trail**: Every risk calculation and task resolution is logged for legal compliance.

---

### If You Remember Only One Mental Model

> **"Hanna is a filter, not a brain."**
>
> Patients talk to Hanna throughout the day. Most interactions are routine. Hanna's job is to **filter** those interactions down to the exceptions that require a nurse's attention.
>
> The nurse never sees "Patient X said hello." They only see "Patient X reported chest pain" — with full context, pre-analyzed, ready for action.
>
> **Hanna amplifies nurse capacity. It does not replace nurse judgment.**

---

*End of Product Manual*
