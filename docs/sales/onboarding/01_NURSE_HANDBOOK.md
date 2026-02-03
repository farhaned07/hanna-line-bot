# Nurse Handbook
**Hanna Dashboard Quick Reference**

---

## Welcome

This handbook provides everything you need to use the Hanna dashboard effectively. Keep it as a desk reference.

**Support:** If you have questions, contact your Implementation Manager or email support@hanna.care

---

## 1. Getting Started

### Login

1. Open the dashboard URL (provided by your admin)
2. Enter your access token
3. Click "Sign In"
4. You'll see Mission Control

**Tip:** Bookmark the dashboard for quick access.

---

## 2. Understanding the Dashboard

### Mission Control (Home)

| Section | What It Shows |
|---------|---------------|
| **Metrics Row** | Active patients, pending tasks, resolved today |
| **Critical Alert Banner** | Red banner if any CRITICAL alerts exist |
| **Triage Queue** | Top priority patients needing attention |
| **AI Activity Log** | Recent OneBrain assessments |

### Risk Colors

| Color | Level | Meaning |
|-------|-------|---------|
| 🔴 Red | CRITICAL | Immediate attention required |
| 🟠 Orange | HIGH | Review within 24 hours |
| 🟢 Green | LOW | No action needed (AI handling) |

---

## 3. Daily Workflow

### Morning Check (5 min)

1. Login to dashboard
2. Check for any **CRITICAL** (red) alerts → Handle immediately
3. Review overnight **HIGH** (orange) alerts
4. Note any patients needing follow-up

### Throughout the Day

1. Dashboard will show new alerts as they come in
2. Handle CRITICAL alerts within **1 hour**
3. Handle HIGH alerts within **24 hours**
4. Resolve tasks after taking action

### End of Day (5 min)

1. Review any unresolved HIGH tasks
2. Leave notes if handover needed
3. Log off

---

## 3.5 Understanding Daily Check-Ins

### Structured Button Flow

Patients receive a button-based check-in (not free text):

| Step | Question | Buttons |
|------|----------|---------|
| 1 | How are you today? | [ดี] [ปกติ] [ไม่ดี] |
| 2 | Did you take your meds? | [ได้ ครบ] [บางส่วน] [ไม่ได้เลย] |
| 3 | Any symptoms? | [ไม่] [มีอาการบ้าง] |
| 4 | (If symptoms) Which? | [มีไข้] [ปวดศีรษะ] [คลื่นไส้] etc. |

### Streak Celebrations

Patients see celebration messages at milestones:
- 🔥 Day 7: "7 วันติดต่อกัน!"
- 🏆 Day 14: "2 อาทิตย์แล้ว!"
- ⭐ Day 30: "1 เดือนเต็ม!"

### Non-Responder Protocol

If a patient doesn't respond:
- **Day 3-4:** Concern message sent
- **Day 5-6:** Personal appeal sent
- **Day 7:** Final choice offered
- **Day 8+:** Alert appears on your dashboard (HIGH priority)

### Recurring Symptoms

If the same symptom is reported 3+ days in a row, a **CRITICAL** task is created automatically.

---

## 4. Reading Patient Alerts

### What You See

Each alert card shows:

| Field | Meaning |
|-------|---------|
| **Patient Name** | Click to see full profile |
| **Risk Score** | 0-10 (higher = more urgent) |
| **Trigger** | What caused this alert |
| **Time** | When the alert was created |
| **Brain Suggestion** | AI's recommended action (informational only) |

### Example Alert

```
🔴 CRITICAL | Risk: 9/10
Patient: คุณสมหญิง (62, Diabetes)
Trigger: Emergency keyword detected - "เจ็บหน้าอก"
Time: 2 minutes ago
Brain: Immediate call recommended. 1669 protocol.
```

---

## 5. Taking Action

### Option 1: Call Patient

1. Click the "📞 Call" button
2. Your phone dialer opens with patient number
3. Make the call
4. After the call, click "Resolve" to log outcome

### Option 2: Message Patient

1. Click patient name to open profile
2. Review conversation history
3. Use LINE to send a message (outside Hanna)
4. Return and click "Resolve"

### Option 3: Resolve Directly

If you determine no action is needed:

1. Click "Resolve"
2. Select appropriate outcome
3. Add notes (optional)
4. Submit

---

## 6. Resolving Tasks

### Outcomes

| Outcome | When to Use |
|---------|-------------|
| **Stable** | Patient is fine, issue resolved |
| **Escalated** | Referred to doctor or specialist |
| **ER Referral** | Patient sent to emergency |
| **False Alarm** | Alert was not accurate |
| **Other** | Anything else (add notes) |

### Adding Notes

Use notes to:
- Record what the patient said
- Document actions taken
- Leave info for next shift

---

## 7. Understanding Risk Scores

### How Risk is Calculated

| Factor | Points |
|--------|--------|
| Emergency keyword (chest pain, fainting, can't breathe) | +3 (or CRITICAL override for SOS) |
| Dangerous vitals (Glucose >400 or <70) | +2 |
| Missed medications (3+ days) | +2 |
| Worsening trend (declining glucose) | +1 |
| No contact (48+ hours) | +1 |
| Age >70 | ×1.2 modifier |

**Score 8-10 = CRITICAL**  
**Score 5-7 = HIGH**  
**Score 0-4 = LOW (no alert)**

---

## 8. Emergency Protocol

### If Patient Reports Emergency

Hanna automatically:
1. Tells patient to call 1669
2. Creates CRITICAL alert on dashboard
3. Logs the event

**Your action:**
1. Call patient immediately
2. Confirm if 1669 was called
3. Coordinate with emergency services if needed
4. Resolve with outcome

### Emergency Keywords (Thai)

- เจ็บหน้าอก (chest pain)
- หายใจไม่ออก (can't breathe)
- เป็นลม (fainting)
- หมดสติ (unconscious)

---

## 9. Common Situations

| Situation | What to Do |
|-----------|------------|
| Patient didn't respond to Hanna | Mark as "Stable" if no concern, or call to check |
| Patient asked medical question | Call and answer (Hanna can't give medical advice) |
| Alert seems wrong | Resolve as "False Alarm" — this improves the system |
| Multiple alerts for same patient | Review all, resolve with single comprehensive action |
| Patient wants to stop Hanna | Contact admin to deactivate patient |

---

## 10. Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check token with admin |
| Dashboard slow | Refresh page, try different browser |
| Alert stuck | Click "Resolve" again, or contact support |
| Missing patient | Contact admin or Implementation Manager |

**Support:** support@hanna.care

---

## Quick Reference Card

### Daily Checklist

- [ ] Morning: Check for CRITICAL alerts
- [ ] Handle CRITICAL within 1 hour
- [ ] Handle HIGH within 24 hours
- [ ] End of day: Review unresolved tasks

### Key Actions

- 📞 **Call** = Opens phone dialer
- 👁️ **View** = Opens patient profile
- ✅ **Resolve** = Closes the task

### Response Times

| Priority | Target |
|----------|--------|
| CRITICAL | < 1 hour |
| HIGH | < 24 hours |

---

*Hanna is a product of Archangel Co., Ltd.*
