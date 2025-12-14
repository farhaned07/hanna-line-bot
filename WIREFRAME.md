# Hanna AI Nurse - Insurer-Led Care Model Wireframe

**Last Updated**: December 14, 2024
**Version**: 3.0 - B2B Insurer Model

---

## 🎯 User Personas (Hierarchical)

### 1. Insurer / Employer (Economic Buyer)
- **Goal**: Reduce PMPM costs, prevent high-cost claims (ER visits, hospitalizations), manage population risk.
- **Role**: Provider of the service entitlement.

### 2. Clinical Oversight Team (Risk Owner)
- **Goal**: Monitor top 5-10% risk cases, approve care escalations, audit AI decisions.
- **Role**: "Human in the loop" for safety and compliance.

### 3. Patient (Care Recipient)
- **Goal**: Stay healthy at home, manage chronic condition, feel supported.
- **Role**: End user of the service (free to them).

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    PATIENT TOUCHPOINTS                   │
│                                                          │
│  ┌──────────────┐              ┌──────────────┐         │
│  │  LINE Chat   │◄────────────►│  Hanna Web   │         │
│  │     Bot      │   LIFF Link  │  (Gemini Live)│        │
│  └──────────────┘              └──────────────┘         │
│       │                              │                   │
│       │ Webhook                      │ WebSocket         │
│       ▼                              ▼                   │
│  ┌──────────────────────────────────────────┐           │
│  │         Hanna Backend Server             │           │
│  │  • Message Router                        │           │
│  │  • Claims Prevention Logic (ROI Engine)  │           │
│  │  • Gemini Live Service (Gated)           │           │
│  │  • Database (Supabase PostgreSQL)        │           │
│  └──────────────────────────────────────────┘           │
│       │                              │                   │
│       ▼                              ▼                   │
│  ┌──────────────────────────────────────────┐           │
│  │      Clinical Oversight Console          │           │
│  │    (Risk Alerts & Exception Mgmt)        │           │
│  └──────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Patient Journey

### Phase 1: Insurer Enrollment (1-Click Activation)

**Concept**: Insurer pre-registers patient data. User only needs to confirm identity.

```
┌─────────────────────────────────────────┐
│  User clicks link from Insurer SMS      │
│  "คุณ[ชื่อจริง] มีสิทธิ์ดูแลสุขภาพ..."    │
│  ↓                                      │
│  [Follow Event Triggered]               │
│  ↓                                      │
│  🔒 Identity Confirmation               │
│  "คุณคือ [ชื่อ-นามสกุล]                 │
│   เกิดวันที่ [วว/ดด/ปปปป] ใช่ไหมคะ?"    │
│  [ใช่ ถูกต้อง ✅]  [ไม่ใช่]              │
│  ↓                                      │
│  If [ใช่]:                              │
│  🔒 PDPA Consent                        │
│  "ประกันของคุณ [ชื่อ] มอบสิทธิ์ให้ฮันนา... │
│   [ยินยอมรับบริการ ✅] [ไม่ยอมรับ]       │
│  ↓                                      │
│  ✨ Activation Complete                 │
│  "ยืนยันสิทธิ์เรียบร้อย ฮันนาพร้อมดูแลค่ะ"  │
│  (Database: Status = 'active')          │
└─────────────────────────────────────────┘
```

**Fallback**: If user clicks "ไม่ใช่" -> "กรุณาติดต่อประกัน [เบอร์โทร] เพื่อแก้ไขข้อมูล"

### Phase 2: Daily Check-in Decision Tree (08:00 AM)

**Objective**: Maximize logging, minimize unnecessary nurse alerts.

```mermaid
graph TD
    Start[8:00 AM Auto-Message] --> Q_Feel{สบายดีไหมคะ?}
    
    Q_Feel -->|สบายดี| Check_Vitals[Vitals Due Case]
    Q_Feel -->|ไม่สบาย| Ask_Sym[ถามอาการ]
    Q_Feel -->|No Response| Wait{Wait 2 hrs}
    
    %% Path 1: Good Health
    Check_Vitals -->|Vitals Due| Ask_BP[วัดความดัน/น้ำตาลหรือยัง?]
    Check_Vitals -->|No Vitals Due| Log_Good[✅ Log: Good, No Nurse]
    Ask_BP -->|Normal| Log_Good
    Ask_BP -->|High| Alert_Yellow[⚠️ Yellow Flag]
    
    %% Path 2: Symptoms
    Ask_Sym -->|Sym: Headache/Dizzy| Ask_Sev[ระดับความรุนแรง 1-10?]
    Ask_Sym -->|Sym: Chest Pain/SOS| Alert_Red[🚨 RED ALERT]
    
    Ask_Sev -->|1-3 Mild| Advice_AI[AI Advice + Log]
    Ask_Sev -->|4-6 Moderate| Alert_Yellow
    Ask_Sev -->|7-10 Severe| Alert_Red
    
    %% Path 3: Silence
    Wait -->|No Resp| Reminder[Reminder Msg]
    Reminder -->|Still Silent (6PM)| Alert_Silent[📞 Silent Alert (Next Day)]
```

**Nurse Alert Logic**:
- **Log (No Alert)**: "Comfortable", Mild symptoms (1-3), Normal Vitals.
- **Yellow Flag**: Moderate symptoms (4-6), Vitals slightly off, Missed meds 1 day.
- **Red Alert**: Severe symptoms (7+), Chest pain, Vitals critical, Silent 48h.

### Phase 3: Continuous Care (No Expiry)

Always-on service. No upsells. Focus on adherence and early warning.

#### ROI & Claims Prevention Logic (Embedded)

| Trigger Event | Hanna Action | Clinical Goal |
|---------------|--------------|---------------|
| Missed Meds (2 days) | ⚠️ Alert Clinical Console | Prevent condition degradation |
| BG > 180 mg/dL (2x) | 💬 Deep Dive + Diet Advice | Prevent Hyperglycemia/ER visit |
| "Chest pain" / SOS | 🚨 IMMEDIATE NURSE ALERT | Urgent Triage (Stroke/Heart Attack) |
| Silent (48 hours) | 📞 Nurse Call Task Created | Welfare Check |

---

## 🎙️ Gated Gemini Live Usage

Voice conversations are clinically justified resources, not unlimited entertainment.

| Situation | Allowed Channel |
|-----------|-----------------|
| Daily Routine Check-in | LINE Chat (Async) |
| Stable Vitals Reporting | LINE Chat (Async) |
| **New Symptom Reported** | **Gemini Live (Suggested)** |
| **Emotional Distress** | **Gemini Live (Capped 10m)** |
| **Complex Med Review** | **Gemini Live (Suggested)** |

**Gating UX & Limits**:
- **Cap**: 2 calls / week per patient.
- **Duration**: Max 10 minutes per call.
- **Over-limit Msg**: _"ฮันนาอยากคุยด้วยนะคะ แต่โควต้าการโทรสัปดาห์นี้เต็มแล้ว พิมพ์คุยกันก่อนนะคะ"_
- **Soft Deflection**: If request is non-urgent, suggest checking in text first.

---

## 👩‍⚕️ Clinical Oversight Console & Time Tracking

**Philosophy**: "Exception-Driven Care". Nurses do NOT monitor every user.

**UI Specifications (Time Tracking):**
Every alert card must have:
1.  **Start Action Button**: Starts a timer for that specific alert.
2.  **Action Type Dropdown**:
    - `[Quick Message]` (Est. 1-2 min)
    - `[Phone Call]` (Est. 10-15 min)
    - `[Escalate to Dr]` (Est. 5 min)
    - `[False Positive]` (Est. <1 min)
3.  **Completion Button**: Stops timer, saves `duration_seconds` to DB.

**Nurse Action Protocols:**

| Alert Type | Protocol Steps | Target Time |
|------------|----------------|-------------|
| **Missed Meds (2 days)** | 1. Check history<br>2. Send "Did you forget?" msg<br>3. If no reply 2h -> Call | 2m (Msg)<br>10m (Call) |
| **High BG (>180 2x)** | 1. Review diet/meds logs<br>2. Send Templated Diet Check<br>3. If critical -> Call | 5m (Review+Msg)<br>15m (Call) |
| **Silent (48h)** | 1. Check LINE activity<br>2. Call patient/family immediately | 10m (Call) |
| **Symptom (Severity 4-6)** | 1. Review symptom history<br>2. Send advice/monitor msg | 3m (Msg) |

**Audit Trail**:
Every AI decision (advice given, triage level assigned) and Nurse Action Time is logged for PMPM analysis.

---

## ⛔ Removed / Deprecated Features
- ❌ 14-Day Free Trial
- ❌ Subscription Payments (PromptPay)
- ❌ Consumer Pricing Pages
- ❌ "Premium vs Basic" Tiers
- ❌ Marketing Upsells

---
