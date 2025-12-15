# Hanna AI Nurse - Hybrid Intelligence Wireframe

**Last Updated**: December 15, 2025
**Version**: 4.1 - "The Safety Polish" (Critical Gaps Fixed)
**Status**: Production Specification

---

## 🎯 Core Philosophy: "Uncompromising Safety"

We are solving the **Nurse Scaling Problem** without causing **Alert Fatigue**.
*   **Old Way**: Nurses drown in data.
*   **Hanna Way**: Nurses see *Exceptions* with *Context*.

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

## 📱 User Flow (Patient)

### 1. The Emergency (Trigger)
*   **User**: "I have chest pain."
*   **Hanna**: 🚨 **"Please call 1669 immediately!"** (Instant Reply)
*   **System**: 
    1.  Creates **CRITICAL TASK (Score 10)**.
    2.  Bypasses De-duplication.
    3.  TRIGGERS SOUND on Nurse Dashboard.

### 2. The Active Nudge (Proactive Rules)
*   **Condition**: Silent > 24h AND Risk > 3.
*   **Hanna**: Sends **Flex Card**:
    > **Hanna is worried.**
    > "We haven't spoken today. Are you okay?"
    > [ 📞 Call Hanna (1 min) ]

### 3. The Voice Call (LiveKit)
*   **Error Handling**:
    *   **Connecting**: Text "Connecting..." (Max 5s).
    *   **Fail**: "Call failed. Please type message." + Log Error.
    *   **Silence**: If user silent > 20s → Auto-disconnect + SMS Check-in.

---

## 🧠 OneBrain Risk Scoring (The Formula)

**Target**: Transparent, Deterministic Risk Assessment.

| Factor | Points | Condition |
| :--- | :--- | :--- |
| **Emergency Keyword** | **+3** | "Chest Pain", "Breathing", "Fainting" |
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

### 1. The Task Card (Context-Rich)

**Problem**: Nurses need to know *WHY*.
**Design**:

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

### 2. The Feedback Loop (Resolution)

**Problem**: System needs training data.
**Flow**: When Nurse clicks [Resolve]:

**Modal Output**:
> **What was the outcome?**
> *   [ ] Called - Patient Stable
> *   [ ] Called - Escalated to Doctor
> *   [ ] Called - Sent to ER
> *   [ ] False Alarm (System Error)
>
> **Next Action?**
> *   [ ] None
> *   [ ] Snooze 2 hours
> *   [ ] Follow-up Tomorrow
>
> **Note**: ____________ (Optional)
>
> [ Submit & Close ]

### 3. Escalation Protocol (Safety Net)

If a **CRITICAL** task remains Pending:
*   **1 Hour**: Dashboard flashes + Sound Alert + Ping Assigned Nurse.
*   **2 Hours**: SMS sent to **Nursing Supervisor**.
*   **3 Hours**: Incident Report logged + SMS to **Clinical Director**.

### 4. Nurse Performance View (Analytics)
*   **Load**: Tasks Assigned vs Resolved.
*   **Speed**: Avg Response Time (Target < 15m for Critical).
*   **Quality**: False Positive Rate (Target < 10%).

---

## 📉 Data Flow

### 1. Vitals Collection
*   **Source**: Patient types "Sugar 180" OR Voice "My sugar is 180".
*   **Brain**: Parses number → `vitals_log`.
*   **Chart**: Dashboard draws 7-day trend line.

### 2. Medication Tracking
*   **Source**: Daily 19:00 Reminder ("Did you take meds?").
*   **Response**: "Yes" / "No" / Silence.
*   **Brain**: Silence > 2 days = **Risk +2**.

---

## 🔌 Integration Summary

| Integration | Direction | Data |
| :--- | :--- | :--- |
| **LINE → OneBrain** | Inbound | Text, Audio, Quick Reply |
| **OneBrain → Dash** | Push | New Task, Sound Alert |
| **Dash → LiveKit** | Outbound | Nurse joins Voice Room |
| **Dash → OneBrain** | Feedback | "False Alarm" (tunes model) |
