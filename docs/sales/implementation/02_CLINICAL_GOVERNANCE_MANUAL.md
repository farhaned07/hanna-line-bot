# Clinical Governance Manual
**Hanna Supervised Care System**

---

## Purpose

This document establishes the clinical governance framework for deploying Hanna within your organization. It defines how supervision works, escalation protocols, and the division of responsibilities between Hanna (the AI system) and your clinical staff.

**Key Principle:** AI assists, nurses decide.

---

## 1. What Hanna Is (and Is Not)

### Hanna IS:

| Classification | Description |
|----------------|-------------|
| **Care Coordination Platform** | Facilitates communication between patients and care teams |
| **Decision Support Tool** | Provides information to support clinical judgment |
| **Supervised System** | All patient interactions occur under clinical oversight |
| **Workflow Automation** | Handles routine check-ins and data collection |

### Hanna IS NOT:

| Not This | Why It Matters |
|----------|----------------|
| **A Medical Practitioner** | Does not diagnose, prescribe, or provide medical advice |
| **An Autonomous Agent** | Always supervised, always escalates clinical matters |
| **A Replacement for Staff** | Augments capacity, does not substitute clinical judgment |
| **A Medical Device** | Not FDA/MOPH regulated as a diagnostic tool |

---

## 2. The Supervision Model

### Human-in-the-Loop

Every deployment includes defined clinical oversight:

```
Patient ←→ Hanna ←→ Nurse ←→ Physician
         (AI)      (Supervisor)  (Escalation)
```

**Hanna's role:** Collect data, detect patterns, surface exceptions  
**Nurse's role:** Review exceptions, make clinical decisions, take action  
**Physician's role:** Available for escalation on complex cases

### Your Clinical Supervisor

| Responsibility | Description |
|----------------|-------------|
| **Dashboard Review** | Check Hanna dashboard daily |
| **Exception Handling** | Respond to high-priority alerts |
| **Override Authority** | Dismiss alerts, adjust patient status |
| **Feedback Loop** | Report false positives/negatives to improve system |

---

## 3. Risk Scoring System

### How OneBrain™ Calculates Risk

Hanna uses a **deterministic, transparent formula** (not a black box):

| Factor | Points | Condition |
|--------|--------|-----------|
| Emergency Keyword | +10 (Override) | "Chest pain", "fainting", "can't breathe" |
| Vital Danger | +2 | Glucose >400 or <70 |
| Missed Medications | +2 | >3 consecutive days without adherence |
| Worsening Trend | +1 | 3+ days of declining metrics |
| Silence | +1 | >48 hours no patient contact |
| Age Modifier | ×1.2 | If patient age >70 |

### Risk Levels

| Score | Level | Dashboard Color | Action |
|-------|-------|-----------------|--------|
| 0-4 | Low | Green | No task created; AI handles routine |
| 5-7 | High | Orange | Task created; nurse reviews within 24h |
| 8-10 | Critical | Red | Immediate task; nurse reviews ASAP |

### Transparency

- Every alert shows the **reason** it was triggered
- Nurses can see the exact factors contributing to the score
- No "black box" decisions

---

## 4. Escalation Protocols

### Emergency Keywords → Immediate Escalation

If a patient types or says these phrases, Hanna:
1. Immediately responds with 1669 emergency guidance
2. Creates a CRITICAL task on the dashboard
3. Logs the event in the audit trail

**Emergency phrases (Thai):**
- เจ็บหน้าอก (chest pain)
- หายใจไม่ออก (can't breathe)
- เป็นลม (fainting)
- หมดสติ (unconscious)
- อาการชัก (seizure)

### Escalation Matrix

| Situation | Hanna Action | Nurse Action |
|-----------|--------------|--------------|
| Emergency keyword | 1669 referral + CRITICAL alert | Call patient immediately |
| Risk 8-10 | CRITICAL task created | Review within 1 hour |
| Risk 5-7 | HIGH task created | Review within 24 hours |
| Risk 0-4 | No task | No action required |
| Patient requests nurse | Task created | Respond within 24 hours |
| Uncertainty | Conservative escalation | Nurse decides |

### Time-Based Escalation (Unresolved Tasks)

| Time | Action |
|------|--------|
| T+0 | Task appears on dashboard |
| T+60 min (Critical) | Auto-reminder to nurse |
| T+120 min (Critical) | Escalate to supervisor |
| T+180 min (Critical) | Escalate to clinical director + incident log |

---

## 5. What Hanna Will Never Do

Hanna is designed with hard constraints:

| Prohibited Action | Example |
|-------------------|---------|
| **Diagnose** | "You have pneumonia" |
| **Prescribe** | "Take 500mg of paracetamol" |
| **Recommend treatment** | "You should increase your insulin" |
| **Minimize symptoms** | "It's probably nothing" |
| **Contradict clinical guidance** | "Your doctor is wrong" |

If asked for medical advice, Hanna responds:
> "ฉันไม่สามารถให้คำแนะนำทางการแพทย์ได้ค่ะ กรุณาติดต่อทีมพยาบาลของคุณ"
> (I cannot provide medical advice. Please contact your care team.)

---

## 6. Data and Privacy

### What Data Hanna Collects

| Data Type | Examples | Storage |
|-----------|----------|---------|
| Vitals | Blood pressure, glucose | Permanent |
| Medication logs | Taken/skipped | Permanent |
| Symptom reports | Text descriptions | Permanent |
| Voice transcripts | Conversation text | Permanent |
| Voice audio | Raw audio files | NOT stored |

### Patient Consent

Every patient receives a disclosure message:

> "สวัสดีค่ะ ฉันคือ Hanna ผู้ช่วยดูแลสุขภาพ AI ของคุณ
> ฉันอยู่ที่นี่เพื่อช่วยคุณติดตามสุขภาพและเชื่อมต่อคุณกับทีมพยาบาล
> ฉันไม่ใช่แพทย์หรือพยาบาล หากมีเหตุฉุกเฉิน กรุณาโทร 1669 ค่ะ"

### PDPA Compliance

- Data processing complies with Thailand's Personal Data Protection Act
- Patient data is stored in your Supabase instance (Singapore region)
- Patients can request data deletion at any time

---

## 7. Audit Trail

### What Is Logged

| Event | Details Captured |
|-------|------------------|
| Every patient message | Timestamp, content, patient ID |
| Every AI response | Timestamp, content |
| Risk calculations | Score, factors, reasoning |
| Task creation | Trigger, priority, patient context |
| Task resolution | Outcome, nurse ID, timestamp |
| Nurse actions | Calls made, messages sent |

### Access to Audit Logs

- Available via Supabase dashboard (admin access)
- Exportable for compliance reviews
- Retained permanently for legal requirements

---

## 8. Liability Framework

### Division of Responsibility

| Responsibility | Liable Party |
|----------------|--------------|
| AI system accuracy | Archangel Co., Ltd. |
| Clinical decisions | Your institution |
| Patient outcomes | Your clinical staff |
| Data security | Shared (contractual) |

### Contractual Provisions

Your pilot agreement includes:

1. **Supervision Clause:** You agree to designate clinical supervisors responsible for reviewing Hanna-generated alerts.

2. **Scope Acknowledgment:** You acknowledge that Hanna is a care coordination platform and does not provide medical diagnosis, treatment recommendations, or clinical decisions.

3. **Liability Allocation:** Your institution retains clinical responsibility for all patient care decisions. Hanna serves as an information and communication tool.

---

## 9. Clinical Governance Checklist

### Before Go-Live

- [ ] CNO sponsors the program
- [ ] Clinical supervisor designated
- [ ] Escalation protocol reviewed and approved
- [ ] Emergency response plan confirmed
- [ ] PDPA compliance verified
- [ ] Staff training completed

### Weekly Review

- [ ] Dashboard checked daily
- [ ] All CRITICAL alerts resolved within 2 hours
- [ ] All HIGH alerts resolved within 24 hours
- [ ] False positives logged for system improvement
- [ ] No scope violations reported

### Monthly Review

- [ ] Escalation response times reviewed
- [ ] Patient feedback analyzed
- [ ] System accuracy assessed
- [ ] Governance framework still appropriate

---

## 10. Contact for Clinical Questions

For clinical governance questions during your pilot:

**Clinical Support**: [Email]  
**Your Implementation Manager**: [Name, Email, Phone]

---

*Hanna is a product of Archangel Co., Ltd.*
