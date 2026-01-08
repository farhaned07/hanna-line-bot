# Hanna AI Codebase Analysis

**Generated**: December 2024  
**Project**: Hanna AI Nurse - Hybrid Intelligence Network for Chronic Disease Management  
**Language**: JavaScript (Node.js) + React  
**Database**: PostgreSQL (Supabase)

---

## 📋 Executive Summary

Hanna is a **nurse force multiplier** system for chronic disease management in Thailand. It combines:
- **LINE Bot** (asynchronous messaging)
- **Voice Interface** (LiveKit WebRTC + EdgeTTS)
- **AI Risk Engine** (OneBrain powered by Groq Llama 3.3 70B)
- **Nurse Dashboard** (React + Tailwind)
- **Autonomous Agent System** (separate daemon)

**Architecture**: Express.js backend (Railway) → Supabase PostgreSQL → React dashboard (Vercel)

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Patient Touchpoints                       │
│  ┌──────────────────┐         ┌──────────────────────────┐  │
│  │   LINE App       │         │   LIFF Voice (WebRTC)    │  │
│  │   (Rich Menu)    │         │   EdgeTTS (Thai)         │  │
│  └────────┬─────────┘         └─────────────┬────────────┘  │
└───────────┼──────────────────────────────────┼───────────────┘
            │                                  │
            ▼                                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Railway Backend (Express.js)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Router → OneBrain → Groq → Task Queue              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
    ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
    │  Supabase   │ │  LiveKit    │ │  Agent       │
    │  PostgreSQL │ │  (Voice)    │ │  Daemon      │
    └─────────────┘ └─────────────┘ └──────────────┘
            │
            ▼
    ┌──────────────────────┐
    │  Vercel Dashboard    │
    │  (React + Tailwind)  │
    └──────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Backend API** | Express.js (Node.js) | REST API, LINE webhook handler |
| **Database** | PostgreSQL (Supabase) | Patient data, tasks, audit logs |
| **AI Engine** | Groq SDK (Llama 3.3 70B) | Risk analysis, conversational AI |
| **Voice** | LiveKit Cloud + EdgeTTS | Real-time Thai voice conversations |
| **Frontend** | React 18 + Tailwind CSS | Nurse dashboard (SPA) |
| **Messaging** | LINE Messaging API | Patient interaction |
| **Deployment** | Railway (backend) + Vercel (frontend) | Cloud hosting |

---

## 📁 Project Structure

```
hanna-line-bot-1/
├── src/                          # Main backend application
│   ├── handlers/                 # Event handlers
│   │   ├── webhook.js           # LINE webhook dispatcher
│   │   ├── router.js            # Message routing & commands
│   │   ├── onboarding.js        # Patient onboarding flow
│   │   └── healthData.js        # Health summary aggregation
│   ├── services/                 # Core services
│   │   ├── OneBrain.js          # Risk calculation engine
│   │   ├── groq.js              # AI chat & transcription
│   │   ├── db.js                # PostgreSQL connection pool
│   │   ├── line.js              # LINE API wrapper
│   │   ├── livekitService.js    # Voice token generation
│   │   ├── edgeTtsAdapter.js    # Thai TTS (Premwadee voice)
│   │   ├── conversationHistory.js # Conversation memory
│   │   └── report.js            # PDF health reports
│   ├── routes/                   # API endpoints
│   │   ├── nurse.js             # Dashboard API (protected)
│   │   ├── voice.js             # Voice chat API
│   │   ├── admin.js             # Admin commands
│   │   └── agents.js            # Agent control
│   ├── worker/                   # Background workers
│   │   └── agent.js             # Voice conversation agent
│   ├── config/                   # Configuration
│   │   └── prompts.js           # AI system prompts
│   ├── scheduler.js             # Cron jobs (check-ins, nudges)
│   └── index.js                 # Express app entry point
│
├── client/                       # Nurse Dashboard (React SPA)
│   ├── src/
│   │   ├── pages/               # Dashboard pages
│   │   │   ├── DashboardHome.jsx    # Mission control
│   │   │   ├── MonitoringView.jsx   # Task queue
│   │   │   ├── Patients.jsx         # Patient list
│   │   │   ├── PatientDetail.jsx    # Patient details
│   │   │   ├── Analytics.jsx        # Analytics
│   │   │   └── Payments.jsx         # B2B placeholder
│   │   ├── components/          # Reusable components
│   │   ├── hooks/               # React hooks
│   │   ├── lib/                 # API client, Supabase
│   │   └── styles/              # Tailwind tokens
│   └── dist/                    # Built static files (served by Express)
│
├── agents/                       # Autonomous Agent System (separate daemon)
│   ├── core/                    # Shared utilities
│   ├── operations/              # Ops agents (Argus, Prism, Nova)
│   ├── revenue/                 # Revenue agents (Falcon, Closer, Titan)
│   ├── executive/               # Executive agent (Friday)
│   ├── scheduler.js             # Agent cron scheduler
│   └── config.js                # Feature flags
│
├── public/                       # Static assets
│   └── call.html                # LIFF voice interface
│
├── migrations/                   # Database schema migrations
├── scripts/                      # Utility scripts
└── docs/                         # Documentation

```

---

## 🔑 Core Components Deep Dive

### 1. OneBrain Service (`src/services/OneBrain.js`)

**Purpose**: Central risk calculation and task generation engine

**Key Functions**:
- `analyzePatient(patientId, triggerEvent)` - Main analysis loop
- `calculateRisk(patient)` - Risk score (0-10) calculation
- `generateTasks(patient, risk)` - Nurse task creation with deduplication
- `updatePatientState(patientId, risk)` - Persist risk state

**Risk Calculation Formula**:
```
+3: Emergency keyword (chest pain, breathing issues)
+2: Vital danger (BP >180, Glucose >400/<70)
+2: Missed meds > 3 days
+1: High trend
+1: Silence > 48h
Age modifier: +20% if age > 70
```

**Safeguards**:
- **Alert Fatigue Cap**: Max 15 critical tasks visible
- **Deduplication**: Max 1 task per patient per 4 hours (unless emergency)
- **Audit Logging**: All risk calculations logged to `audit_log` table

**Risk Levels**:
- `critical`: Score ≥ 8
- `high`: Score ≥ 5
- `low`: Score < 5

---

### 2. Message Router (`src/handlers/router.js`)

**Purpose**: Routes LINE messages to appropriate handlers

**Key Features**:

#### Emergency Detection (Tier 2)
- **CRITICAL**: Chest pain, breathing issues, stroke symptoms → Immediate 1669 protocol
- **HIGH**: Urgent but non-life-threatening → Nurse callback

#### Rich Menu Commands
- `โทรหาฮันนา` → LIFF voice call
- `เช็คสุขภาพ` → Health check-in
- `บันทึกค่า` → Log vitals (BP/glucose)
- `บันทึกกินยา` → Medication tracking
- `โปรไฟล์ของฉัน` → Health summary
- `ช่วยเหลือ` → Help menu

#### AI-Powered Conversations
- All non-command messages → Groq Llama 3.3 70B
- Includes conversation history (last 20 messages)
- Patient context injection
- Risk-aware tone calibration

#### Audio Handling
- LINE audio messages → Groq Whisper transcription
- Text → OneBrain analysis → Groq response → EdgeTTS → Audio reply

---

### 3. Conversation History (`src/services/conversationHistory.js`)

**Purpose**: Persistent conversation memory for contextual AI

**Features**:
- Saves all user/assistant messages to `conversation_history` table
- Retrieves last 20 messages for context injection
- 30-day retention policy
- GDPR/PDPA compliance (delete patient history)

**Message Types**:
- `text`: LINE text messages
- `audio`: LINE audio messages
- `voice`: LIFF voice conversations

---

### 4. Scheduler (`src/scheduler.js`)

**Purpose**: Automated patient engagement and monitoring

**Cron Jobs**:
- **08:00**: Morning check-in (glucose reminders)
- **14:00**: Active nudge (silent patients > 24h)
- **19:00**: Evening medication reminder
- **Every 15m**: Escalation check (critical tasks > 1h)
- **Every 5m**: Capacity monitor (queue overload detection)
- **Every 1h**: Post-resolution recheck (24h follow-up)

**Escalation Protocol**:
- T+0m: Task created on dashboard
- T+60m: L1 escalation (nurse notification)
- T+120m: L2 escalation (clinical director)

**Capacity Monitoring**:
- Warning: 20 pending tasks
- Overload: 30 pending tasks → Alert supervisor

---

### 5. Nurse Dashboard API (`src/routes/nurse.js`)

**Purpose**: Protected API for React dashboard

**Authentication**: Bearer token (`NURSE_DASHBOARD_TOKEN`)

**Endpoints**:
- `GET /api/nurse/stats` - Dashboard metrics
- `GET /api/nurse/tasks` - Task queue (prioritized)
- `GET /api/nurse/patients` - Patient list
- `GET /api/nurse/patients/:id` - Patient details + history
- `GET /api/nurse/monitoring-status` - Real-time patient grid
- `GET /api/nurse/infrastructure-health` - System health metrics
- `GET /api/nurse/ai-log` - AI decision transparency
- `GET /api/nurse/trends` - 7-day analytics
- `POST /api/nurse/tasks/:id/resolve` - Case resolution (mandatory fields)

**Task Resolution Workflow**:
1. Nurse resolves with `outcome_code`, `action_taken`, `clinical_notes`
2. Task status → `resolved` (not `closed`)
3. 24h recheck scheduled
4. Recheck passes → Status → `closed`

---

### 6. Voice Interface (`src/routes/voice.js`)

**Purpose**: Real-time voice conversations via LiveKit

**Flow**:
1. User opens LIFF → `call.html` loads
2. Browser Web Speech API → STT (client-side)
3. Text → `/api/voice/chat` → Groq Llama 3.3 → Response
4. Response → EdgeTTS → Base64 audio → Browser playback

**Endpoints**:
- `GET /api/voice/token` - Generate LiveKit token
- `POST /api/voice/chat` - Process voice query

**Rate Limiting**: 10 requests/minute per IP

---

### 7. Agent System (`agents/`)

**Purpose**: Autonomous AI agents (separate process)

**Architecture**:
- Runs via `agents-daemon.js` (independent from main app)
- Feature flags via `.env.agents`
- Dry-run mode for testing
- Read-only initially

**Agent Categories**:
- **Operations**: Argus (monitoring), Prism (analysis), Nova (operations)
- **Revenue**: Falcon (lead qualification), Closer (deals), Titan (revenue)
- **Executive**: Friday (reporting)

**Status**: Phase 0 (infrastructure setup)

---

## 🗄️ Database Schema

### Core Tables

**`chronic_patients`**
- Patient registry (UUID primary key)
- LINE user ID (unique)
- Enrollment status: `onboarding`, `trial`, `active`, `expired`
- PDPA consent fields

**`patient_state`**
- Current risk score (0-10)
- Risk level: `low`, `high`, `critical`
- Risk reasoning (JSONB)
- Last assessment timestamp

**`nurse_tasks`**
- Task queue for nurses
- Priority: `critical`, `high`, `normal`
- Status: `pending`, `resolved`, `closed`
- Outcome codes, action taken, clinical notes

**`check_ins`**
- Daily health check-ins
- Vitals: glucose, BP (systolic/diastolic)
- Medication taken (boolean)
- Symptoms (text)

**`vitals_log`**
- Historical vitals data
- Type: `glucose`, `blood_pressure`
- Value (JSONB)
- Source: `line`, `voice`, `manual`

**`conversation_history`**
- Persistent conversation memory
- Role: `user`, `assistant`, `system`
- Message type: `text`, `audio`, `voice`
- Metadata (JSONB)

**`audit_log`**
- Legal audit trail
- Actor, action, patient_id, details (JSONB)
- Timestamp

**`nurse_logs`**
- Structured nurse actions
- Task ID, patient ID, nurse ID
- Action type, notes (JSONB)

**`case_rechecks`**
- 24h post-resolution rechecks
- Scheduled at, checked at, result

**`escalation_log`**
- Escalation tracking
- Escalation level (1, 2)
- Notification type, sent timestamp

**`capacity_events`**
- Queue overload detection
- Event type, queue size, threshold

---

## 🔐 Security & Compliance

### Authentication
- **LINE Webhook**: Signature verification (LINE SDK middleware)
- **Dashboard API**: Bearer token (`NURSE_DASHBOARD_TOKEN`)
- **Rate Limiting**: Per-IP rate limits (API: 100/min, Voice: 10/min)

### Data Protection
- **PDPA Compliance**: Consent fields in `chronic_patients`
- **Audit Trail**: All actions logged to `audit_log`
- **Right to be Forgotten**: `deletePatientHistory()` function
- **Data Retention**: 30-day conversation history policy

### Safety Safeguards
- **Alert Fatigue Cap**: Max 15 critical tasks
- **Deduplication**: Prevents task spam
- **Fallback Responses**: Rule-based when AI unavailable
- **Escalation Protocol**: Automated escalation if tasks ignored

---

## 🚀 Deployment

### Production Environment

| Service | Platform | URL |
|---------|----------|-----|
| Backend API | Railway | `hanna-line-bot-production.up.railway.app` |
| Dashboard | Vercel | (from hanna-nurse-dashboard repo) |
| Database | Supabase | PostgreSQL (transaction pooler: port 6543) |
| Voice | LiveKit Cloud | `fastcare-319g1krm.livekit.cloud` |

### Environment Variables

**Required**:
- `LINE_CHANNEL_SECRET`, `LINE_CHANNEL_ACCESS_TOKEN`, `LIFF_ID`
- `GROQ_API_KEY`
- `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- `DATABASE_URL` (Supabase connection string)
- `NURSE_DASHBOARD_TOKEN`

**Optional**:
- `ADMIN_SECRET` (for admin commands)
- `BASE_URL` (for LIFF callbacks)

---

## 📊 Key Features

### Patient-Facing (LINE)
- ✅ Voice conversations (Thai)
- ✅ Vitals logging (BP, glucose)
- ✅ Medication tracking
- ✅ Emergency detection (1669 protocol)
- ✅ Health summaries
- ✅ Rich menu navigation

### Nurse-Facing (Dashboard)
- ✅ Mission Control (real-time metrics)
- ✅ Task queue (prioritized)
- ✅ Patient monitoring grid
- ✅ Patient detail views
- ✅ Case resolution workflow
- ✅ Analytics & trends
- ✅ Infrastructure health

### System Features
- ✅ Conversation memory (30-day retention)
- ✅ Risk scoring (0-10 scale)
- ✅ Task deduplication
- ✅ Escalation protocol
- ✅ Capacity monitoring
- ✅ Post-resolution rechecks
- ✅ Audit logging

---

## 🔧 Technical Debt & Areas for Improvement

### 1. **Error Handling**
- Some services lack comprehensive error handling
- Fallback mechanisms are present but could be more robust

### 2. **Testing**
- Limited test coverage (`tests/critical-paths.test.js` exists but minimal)
- No unit tests for core services
- Integration tests would improve reliability

### 3. **Agent System**
- Still in Phase 0 (infrastructure only)
- Agents are disabled by default (feature flags)
- Needs production readiness assessment

### 4. **Database Queries**
- Some queries could be optimized (e.g., `monitoring-status` endpoint)
- Missing indexes on frequently queried columns
- Consider connection pooling optimization

### 5. **Voice Interface**
- Client-side STT (Web Speech API) is browser-dependent
- No server-side fallback for STT
- EdgeTTS rate limits not handled

### 6. **Monitoring & Observability**
- Limited logging (mostly console.log)
- No structured logging (e.g., Winston, Pino)
- No metrics collection (Prometheus, Datadog)
- Health checks are basic

### 7. **Security**
- Admin commands use simple secret matching
- No rate limiting on admin endpoints
- Dashboard auth is token-based (no expiration/refresh)

### 8. **Code Organization**
- Some files are large (e.g., `router.js` ~630 lines)
- Could benefit from more modularization
- Service layer could be more consistent

---

## 📈 Performance Considerations

### Current Optimizations
- ✅ Database connection pooling (pg Pool)
- ✅ Rate limiting (API and voice)
- ✅ Deduplication (prevents spam)
- ✅ Conversation history limit (20 messages)
- ✅ Cleanup jobs for old data

### Potential Improvements
- Add Redis for caching (patient state, health summaries)
- Implement database query result caching
- Add CDN for static assets
- Optimize dashboard API queries (add indexes)
- Consider read replicas for analytics queries

---

## 🎯 Business Logic Highlights

### Risk Calculation
- Multi-factor risk scoring (vitals, adherence, silence, age)
- Emergency keyword detection triggers immediate escalation
- Positive signals (streaks, trends) are tracked

### Task Generation
- OneBrain generates tasks based on risk level
- Deduplication prevents alert fatigue
- Critical tasks capped at 15 (with supervisor notification)

### Case Resolution
- Mandatory fields: `outcome_code`, `action_taken`, `nurseId`
- 24h recheck scheduled automatically
- Cases don't close until recheck passes

### Patient Engagement
- Proactive nudges for silent patients
- Morning check-ins (8 AM)
- Evening medication reminders (7 PM)
- Escalation for ignored critical tasks

---

## 🔄 Data Flow Examples

### 1. Patient sends "เจ็บหน้าอก" (chest pain)
```
LINE → webhook.js → router.js (emergency detection)
  → OneBrain.analyzePatient(CRITICAL_EMERGENCY)
  → Risk score = 10
  → Task created (priority: critical)
  → LINE reply: "โทร 1669 ทันที"
  → Dashboard shows alert
```

### 2. Voice conversation
```
User speaks → Web Speech API (STT)
  → POST /api/voice/chat
  → Groq Llama 3.3 (with conversation history)
  → EdgeTTS (Thai Premwadee)
  → Base64 audio → Browser playback
  → Conversation saved to DB
```

### 3. Nurse resolves task
```
POST /api/nurse/tasks/:id/resolve
  → Task status = 'resolved'
  → Nurse log created
  → Recheck scheduled (+24h)
  → Audit log entry
  → 24h later: Recheck runs
  → If no new alerts: Task status = 'closed'
```

---

## 📚 Documentation

**Available Documentation**:
- `README.md` - Project overview
- `ARCHITECTURE.md` - Technical architecture
- `WIREFRAME.md` - UX specification
- `docs/PRODUCT_MANUAL.md` - Product documentation
- `docs/DEPLOYMENT.md` - Deployment guide
- `agents/README.md` - Agent system overview

**Missing Documentation**:
- API documentation (OpenAPI/Swagger)
- Database schema documentation (beyond comments)
- Contributing guide
- Code style guide

---

## 🎓 Learning Points

1. **Hybrid Intelligence**: Combines rule-based logic (emergency detection) with AI (conversations, risk scoring)
2. **Safety-First Design**: Multiple safeguards (caps, deduplication, escalation)
3. **Audit Trail**: Comprehensive logging for legal defensibility
4. **Graceful Degradation**: Fallback responses when AI unavailable
5. **Conversation Memory**: Context-aware AI responses
6. **Thai Language Support**: Native Thai TTS and conversation handling

---

## 🚦 Next Steps Recommendations

### High Priority
1. **Add comprehensive testing** (unit + integration)
2. **Implement structured logging** (Winston/Pino)
3. **Add API documentation** (OpenAPI/Swagger)
4. **Optimize database queries** (add indexes, query optimization)
5. **Improve error handling** (consistent error responses)

### Medium Priority
1. **Agent system production readiness**
2. **Monitoring & observability** (metrics, alerts)
3. **Security hardening** (token refresh, rate limiting)
4. **Performance optimization** (caching, query optimization)
5. **Code refactoring** (modularize large files)

### Low Priority
1. **Documentation improvements**
2. **Developer experience** (local setup scripts)
3. **CI/CD pipeline** (automated testing)
4. **Internationalization** (if expanding beyond Thailand)

---

**End of Analysis**



