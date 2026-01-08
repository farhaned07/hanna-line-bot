# Hanna AI Nurse - Hybrid Intelligence Wireframe

**Last Updated**: December 17, 2025  
**Version**: 5.0 - "GO-LIVE Ready"  
**Status**: Production Specification

---

## 🎯 Core Philosophy: "Uncompromising Safety"

We are solving the **Nurse Scaling Problem** without causing **Alert Fatigue**.
*   **Old Way**: Nurses drown in data.
*   **Hanna Way**: Nurses see *Exceptions* with *Context*.

**Critical Distinction**: Hanna performs **systematic data collection** and **risk assessment** for **nurse force multiplication** — NOT medical triage.

---

## 🏗️ System Overview & Limits

### The 4-Tier Safety Net (Safeguards)

| Tier | Component | Behavior | Limits/Rules |
| :--- | :--- | :--- | :--- |
| **0. The Invisible App** | **LINE Bot** | Daily Habit & Vitals Collection. | **De-duplication**: Max 1 task/patient/4h (unless Emergency). |
| **1. The Active Nudge** | **Scheduler** | If Silent > 24h -> "Push-to-Talk". | **Smart Rule**: No nudge if Hospitalized or "On Vacation". |
| **2. The Brain** | **OneBrain** | Scores Risk (0-10). | **Fatigue Cap**: Max 15 CRITICAL tasks visible. |
| **3. The Control** | **Dashboard** | Priority Queue + Resolution Loop. | **Escalation**: Unanswered > 1h = SMS Supervisor. |

---

## 📱 LINE Rich Menu (6 Buttons)

Production Rich Menu layout:

| Button | Action | Description |
| :--- | :--- | :--- |
| 🎙️ **โทรหาฮันนา** | LIFF Voice Call | Opens LiveKit voice interface |
| ❤️ **เช็คสุขภาพ** | Message: "เช็คสุขภาพ" | Triggers health check summary |
| 📊 **บันทึกค่า** | Message: "บันทึกค่า" | Opens vitals input flow |
| 💊 **บันทึกกินยา** | Message: "บันทึกกินยา" | Logs medication taken |
| 👤 **โปรไฟล์ของฉัน** | Message: "โปรไฟล์" | Shows patient profile |
| ℹ️ **ช่วยเหลือ** | Message: "ช่วยเหลือ" | Help commands list |

---

## 📱 User Flow (Patient)

### 1. The Emergency (Trigger)
*   **User**: "I have chest pain."
*   **Hanna**: 🚨 **"Please call 1669 immediately!"** (Instant Reply)
*   **System**: 
    1.  Creates **CRITICAL TASK (Score 10)**.
    2.  Bypasses De-duplication.
    3.  TRIGGERS SOUND on Nurse Dashboard.

### 2. The Voice Call (LiveKit + EdgeTTS)
*   **Flow**:
    1.  User taps "โทรหาฮันนา" in Rich Menu
    2.  LIFF app opens (`call.html`)
    3.  Web Speech API captures user voice → text
    4.  Text sent to Groq Llama 3 for AI response
    5.  Response sent to EdgeTTS (Thai Premwadee voice)
    6.  Audio played back to user via LiveKit
*   **Error Handling**:
    *   **Connecting**: Text "กำลังเชื่อมต่อ..." (Max 5s).
    *   **Fail**: "เกิดข้อผิดพลาด" + Log Error.

### 3. The Active Nudge (Proactive Rules)
*   **Condition**: Silent > 24h AND Risk > 3.
*   **Hanna**: Sends Flex Card with call-to-action.

---

## 🧠 OneBrain Risk Scoring (The Formula)

**Target**: Transparent, Deterministic Risk Assessment.

| Factor | Points | Condition |
| :--- | :--- | :--- |
| **Emergency Keyword** | **+10** (Critical Override) | "Chest Pain", "Breathing", "Fainting" |
| **Vital Danger** | **+2** | BP >180/110, Glucose >400 or <70 |
| **Missed Meds** | **+2** | >3 consecutive days |
| **Trend** | **+1** | 3+ days worsening vitals |
| **Silence** | **+1** | >48 hours no contact |
| **Age Modifier** | **x1.2** | If Age > 70 |

*   **0-4**: Routine (Green)
*   **5-7**: High (Orange)
*   **8-10**: Critical (Red)

---

## 👩‍⚕️ Nurse Dashboard (Mission Control)

### Dashboard Pages
1. **Login** - Bearer token authentication
2. **Mission Control** - Real-time metrics and triage queue
3. **Monitoring View** - Full task list with filters
4. **Patient List** - All enrolled patients
5. **Patient Detail** - Individual patient deep dive
6. **Payments** - (B2B model - handled by insurer)

### Task Card Design
```
[ 🔴 CRITICAL ]  Somchai P., 67M  [Diabetes, HTN]
-------------------------------------------------------
⚠️ TRIGGER: Keyword "Chest Pain" detected (10 mins ago)

📊 CONTEXT:
- Last Vitals: BP 165/95 (Yesterday)
- Meds: Skipped Metformin (Yesterday)
- History: ER visit last month

💡 BRAIN SUGGESTION:
"High risk of cardiac event. Call immediately."

[ 📞 Call Patient ]  [ 🚑 Call Ambulance ]  [ Resolve ]
```

### Escalation Protocol
*   **1 Hour**: Dashboard flashes + Sound Alert + Ping Assigned Nurse.
*   **2 Hours**: SMS sent to Nursing Supervisor.
*   **3 Hours**: Incident Report logged + SMS to Clinical Director.

---

## 🔌 Integration Summary

| Integration | Direction | Data |
| :--- | :--- | :--- |
| **LINE → OneBrain** | Inbound | Text, Audio, Quick Reply |
| **OneBrain → Dashboard** | Push | New Task, Sound Alert |
| **Dashboard → LiveKit** | Outbound | Nurse joins Voice Room |
| **Dashboard → OneBrain** | Feedback | "False Alarm" (tunes model) |

---

## 🚀 Production Deployment

| Component | Platform | URL |
| :--- | :--- | :--- |
| Backend API | Railway | hanna-line-bot-production.up.railway.app |
| Nurse Dashboard | Vercel | (vercel deployment) |
| Database | Supabase | aws-0-ap-southeast-1 |
| Voice | LiveKit Cloud | fastcare-319g1krm.livekit.cloud |
