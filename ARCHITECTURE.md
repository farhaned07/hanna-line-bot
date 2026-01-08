# Hanna System Architecture

**Version**: 3.0 (Production)  
**Last Updated**: December 17, 2025  
**Status**: GO-LIVE Ready

---

## Overview

Hanna is a **Supervised Care Intelligence System** designed to be a **nurse force multiplier**.

It solves the capacity constraint of human nurses by:
1.  **Automating Data Collection**: Using LINE and Voice AI to gather patient data 24/7.
2.  **Centralizing Intelligence**: The **OneBrain™** engine assesses risk and detects exceptions.
3.  **Prioritizing Focus**: The **Nurse Command Center** ensures human nurses only spend time on patients who need it *now*.

**Strategic Goal**: Allow one nurse to safely manage 500+ chronic patients.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PATIENT TOUCHPOINTS                          │
│  ┌──────────────────┐         ┌─────────────────────────────┐   │
│  │   LINE App       │         │   LIFF Voice (call.html)    │   │
│  │   (Rich Menu)    │         │   LiveKit WebRTC            │   │
│  └────────┬─────────┘         └─────────────┬───────────────┘   │
└───────────┼─────────────────────────────────┼───────────────────┘
            │                                 │
            ▼                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RAILWAY BACKEND                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Message Router (router.js)                               │   │
│  │  - Emergency keyword detection                            │   │
│  │  - Onboarding flow                                        │   │
│  │  - Rich Menu actions                                      │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │  OneBrain Service (OneBrain.js)                          │   │
│  │  - Risk calculation (0-10 score)                         │   │
│  │  - Task generation with deduplication                    │   │
│  │  - Alert fatigue safeguards                              │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│  ┌──────────────┐  ┌──────▼───────┐  ┌──────────────────────┐   │
│  │ Groq API     │  │ EdgeTTS      │  │ LiveKit Service      │   │
│  │ (Llama 3.3)  │  │ (Premwadee)  │  │ (Token Generation)   │   │
│  │ - AI Chat    │  │ - Thai TTS   │  │ - WebRTC Audio       │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
            │                                      │
            ▼                                      ▼
┌─────────────────────────────┐  ┌────────────────────────────────┐
│   SUPABASE DATABASE         │  │   VERCEL DASHBOARD             │
│   - chronic_patients        │  │   - Mission Control            │
│   - patient_state           │  │   - Monitoring View            │
│   - nurse_tasks             │  │   - Patient Detail             │
│   - vitals_log              │  │   - React + Tailwind           │
│   - chat_history            │  │                                │
│   - audit_log               │  │                                │
└─────────────────────────────┘  └────────────────────────────────┘
```

---

## Component Details

### 1. The Interface: LINE Bot (Asynchronous)

**Purpose**: "The Invisible App". Handles daily check-ins, vitals logging, and safety alerts.

**Rich Menu (6 Buttons)**:
| Button | Action |
|--------|--------|
| โทรหาฮันนา | LIFF voice call |
| เช็คสุขภาพ | Health summary |
| บันทึกค่า | Log vitals |
| บันทึกกินยา | Log medication |
| โปรไฟล์ของฉัน | View profile |
| ช่วยเหลือ | Help commands |

**Key Features**:
- **Emergency Detection**: "Chest Pain" → Immediate 1669 Protocol + CRITICAL task
- **AI Responses**: All messages go through Groq Llama 3.3 for contextual replies
- **Active Nudge**: Proactive push to silent patients

### 2. The Engine: OneBrain + Hanna Voice

**Purpose**: Systematic data collection and risk assessment for nurse force multiplication.

**Voice Technology Stack**:
| Component | Service | Purpose |
|-----------|---------|---------|
| STT | Web Speech API (Browser) | User speech → text |
| Reasoning | Groq Llama 3.3 70B | Generate response |
| TTS | Microsoft EdgeTTS | Text → Thai audio (Premwadee) |
| Transport | LiveKit Cloud | WebRTC real-time audio |

**Voice Flow**:
1. User opens LIFF → `call.html` loads
2. User speaks → Web Speech API transcribes
3. Text → `/api/voice/chat` → Groq generates response
4. Response → EdgeTTS → Base64 audio
5. Audio plays in browser

### 3. The Control: Nurse Dashboard

**Purpose**: "Exception Management" — Nurses see only what needs attention.

**Technology**: React 18, Tailwind CSS 3, Vite 5, deployed on Vercel

**Pages**:
1. **Login** - Bearer token auth (VITE_NURSE_TOKEN)
2. **Mission Control** - Real-time metrics, critical alerts
3. **Monitoring View** - Full task queue with filters
4. **Patient List** - All enrolled patients
5. **Patient Detail** - Individual patient view
6. **Payments** - B2B placeholder

**Workflow**:
1. OneBrain creates Task (Critical/High)
2. Dashboard shows alert
3. Nurse clicks 'Call' or 'Resolve'
4. Feedback logged → Loop closed

---

## Database Schema (Supabase PostgreSQL)

### Core Tables

```sql
-- Patient Registry
CREATE TABLE chronic_patients (
    id SERIAL PRIMARY KEY,
    line_user_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    age INTEGER,
    condition VARCHAR(255),
    enrollment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Risk State (OneBrain Memory)
CREATE TABLE patient_state (
    patient_id INTEGER PRIMARY KEY REFERENCES chronic_patients(id),
    current_risk_score INTEGER DEFAULT 0,
    risk_level VARCHAR(20),
    risk_reasoning JSONB,
    risk_score INTEGER DEFAULT 0,
    assigned_nurse VARCHAR(255),
    last_assessment TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Nurse Task Queue
CREATE TABLE nurse_tasks (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES chronic_patients(id),
    task_type VARCHAR(50),
    priority VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    reason TEXT,
    context JSONB,
    title VARCHAR(255),
    description TEXT,
    created_by VARCHAR(100),
    resolved_by VARCHAR(100),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vitals Log
CREATE TABLE vitals_log (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES chronic_patients(id),
    type VARCHAR(50),
    value JSONB,
    source VARCHAR(50),
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Chat History
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES chronic_patients(id),
    role VARCHAR(20),
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Legal Audit Trail
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    actor VARCHAR(100),
    action VARCHAR(100),
    patient_id INTEGER,
    details JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 🛡️ Reliability & Safety Layer

### Failure Modes & Fallbacks
| Component | Failure Scenario | Automated Fallback |
|-----------|------------------|-------------------:|
| **Groq API** | Timeout / 500 | Fallback response: "กรุณาลองใหม่อีกครั้งค่ะ" |
| **LiveKit Voice** | Connection Dropped | User sees error message, can type instead |
| **Supabase DB** | Timeout | Logged error, graceful degradation |
| **LINE Webhook** | Signature fail | Request rejected (security) |

### Safeguards (Alert Fatigue)
- **Cap**: Max 15 CRITICAL tasks visible at any time
- **De-duplication**: Same patient = Max 1 task per 4 hours (unless Emergency)
- **Feedback Loop**: High false-positive rate triggers admin notification

### Escalation Protocol
- **T+0m**: Task Created on Dashboard
- **T+60m**: Unresolved? Ping Nurse
- **T+120m**: SMS Supervisor
- **T+180m**: SMS Clinical Director + Incident Log

---

## 🚀 Deployment Configuration

### Production Environment

| Service | Platform | URL |
|---------|----------|-----|
| Backend API | Railway | `hanna-line-bot-production.up.railway.app` |
| Nurse Dashboard | Vercel | (from hanna-nurse-dashboard repo) |
| Database | Supabase | `hozputqagilvsbilojgr.supabase.co` |
| Voice | LiveKit Cloud | `fastcare-319g1krm.livekit.cloud` |

### Required Environment Variables

```bash
# LINE Integration
LINE_CHANNEL_SECRET=xxx
LINE_CHANNEL_ACCESS_TOKEN=xxx
LIFF_ID=2008593893-Bj5k3djg

# AI & Voice
GROQ_API_KEY=xxx
LIVEKIT_URL=wss://fastcare-319g1krm.livekit.cloud
LIVEKIT_API_KEY=xxx
LIVEKIT_API_SECRET=xxx

# Database
DATABASE_URL=postgresql://xxx

# Dashboard
NURSE_DASHBOARD_TOKEN=han_ops_2024_secure_xyz

# Dashboard Frontend (Vercel)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_NURSE_TOKEN=xxx
VITE_API_URL=https://hanna-line-bot-production.up.railway.app
```

---

## Repository Structure

```
hanna-line-bot/
├── src/
│   ├── handlers/       # Message routing, onboarding
│   ├── services/       # OneBrain, Groq, LiveKit, LINE
│   ├── routes/         # API endpoints (nurse, voice)
│   └── config/         # Prompts, configuration
├── client/             # Nurse Dashboard (React)
├── public/             # LIFF assets (call.html)
├── migrations/         # SQL schema files
└── scripts/            # Utilities
```
