# Hanna Regulatory Posture

> **Internal Document** — Legal and regulatory positioning framework  
> **Last Updated:** 2025-12-31  
> **Classification:** Strategic / Confidential

---

## Executive Summary

**Hanna is infrastructure, not a practitioner.**

This document establishes the regulatory posture that protects Hanna from scope-of-practice challenges, liability exposure, and regulatory enforcement actions.

---

## Core Legal Position

### What Hanna IS

| Classification | Description |
|----------------|-------------|
| **Software Infrastructure** | A communications and workflow automation platform |
| **Decision Support Tool** | Provides information to support (not replace) clinical judgment |
| **Supervised System** | All patient interactions occur under clinical oversight |
| **Care Coordination Platform** | Facilitates communication, not clinical practice |

### What Hanna IS NOT

| Not This | Why It Matters |
|----------|----------------|
| **A Medical Practitioner** | Does not diagnose, prescribe, or provide medical advice |
| **An Employee** | No employment relationship, no labor law exposure |
| **An Autonomous Agent** | Always supervised, always escalates clinical matters |
| **A Replacement for Clinical Staff** | Augments capacity, does not substitute clinical judgment |

---

## Regulatory Framework

### Thailand Context (MOPH, FDA, Medical Council)

**Current Position:**
- AI chatbots providing health information are not explicitly regulated under Thai law
- Medical practice requires human licensure
- Hanna operates in the **gray zone** between consumer health app and clinical tool

**Posture:**
1. Hanna does NOT practice medicine
2. Hanna provides **information**, not **advice**
3. All clinical escalations go to licensed professionals
4. Partner institutions bear clinical responsibility for care decisions

### Key Regulatory Principles (Universal)

| Principle | Hanna's Position |
|-----------|------------------|
| **Scope of Practice** | Hanna operates outside scope — no diagnosis, prescription, or clinical decisions |
| **Vicarious Liability** | Hanna is a tool; liability rests with supervising institution |
| **Informed Consent** | Patients are informed they are interacting with an AI system |
| **Data Protection** | PDPA-compliant data handling; HIPAA-aligned architecture |
| **Supervision Requirement** | Every deployment includes defined clinical oversight |

---

## The "Three Gates" Framework

Before any feature ships, it must pass three regulatory gates:

### Gate 1: Scope of Practice
> *"Could this feature be interpreted as practicing medicine?"*

If yes → Do not ship, or add explicit clinical supervision requirement

**Examples:**
- ❌ "Based on your symptoms, you likely have X" (diagnosis)
- ✅ "Based on what you've shared, I recommend speaking with a nurse about your symptoms" (escalation)

### Gate 2: Liability Assignment
> *"If this goes wrong, who is responsible?"*

Hanna (the product) should not be the liable party. Structure must ensure:
- Partner institution has oversight
- Hanna is a tool, not a decision-maker
- Clinical protocols are institution-defined

### Gate 3: Regulatory Clarity
> *"If a regulator asks what this is, can we answer cleanly?"*

The answer must always be:
> "Hanna is supervised care coordination infrastructure that supports clinical workflows. It does not make clinical decisions."

---

## Interaction Design Principles

### Mandatory Disclosure

Every patient's first interaction with Hanna must include:

```
"สวัสดีค่ะ ฉันคือ Hanna ผู้ช่วยดูแลสุขภาพ AI ของคุณ 
ฉันอยู่ที่นี่เพื่อช่วยคุณติดตามสุขภาพและเชื่อมต่อคุณกับทีมพยาบาล
ฉันไม่ใช่แพทย์หรือพยาบาล หากมีเหตุฉุกเฉิน กรุณาโทร 1669 ค่ะ"
```

**English:**
> "Hello, I'm Hanna, your AI health assistant. I'm here to help you track your health and connect you with your care team. I am not a doctor or nurse. In case of emergency, please call 1669."

### Escalation Triggers (Always Escalate, Never Advise)

| Trigger | Action |
|---------|--------|
| Symptoms suggesting emergency | Immediate 1669 referral + nurse alert |
| Request for diagnosis | Redirect to clinical team |
| Request for medication advice | Redirect to clinical team |
| Mental health crisis indicators | Immediate escalation + safety protocol |
| Uncertainty in patient intent | Conservative escalation |

### Prohibited Responses

Hanna must **never** generate:
- Specific diagnoses
- Medication recommendations (including OTC)
- "You should" statements for clinical decisions
- Reassurance that minimizes symptoms ("It's probably nothing")
- Contradictions of clinical team guidance

---

## Contractual Protections

### Partner Agreement Requirements

Every hospital/insurer contract must include:

1. **Supervision Clause**
   > "Client agrees to designate clinical supervisors responsible for reviewing Hanna-generated patient interactions."

2. **Scope Acknowledgment**
   > "Client acknowledges that Hanna is a care coordination platform and does not provide medical diagnosis, treatment recommendations, or clinical decisions."

3. **Liability Allocation**
   > "Client retains clinical responsibility for all patient care decisions. Hanna serves as an information and communication tool."

4. **Data Processing Agreement**
   > "Data handling complies with PDPA and client's data governance policies."

### Insurance Coverage

Maintain:
- Professional liability insurance (E&O)
- Cyber liability insurance
- Appropriate coverage limits for healthcare technology

---

## Incident Response

### If Regulators Inquire

**Prepared Response:**
> "Hanna is supervised care coordination infrastructure designed to extend — not replace — clinical staff. Every patient interaction occurs under nurse oversight, and Hanna escalates any situation requiring clinical judgment to human staff immediately. Hanna does not diagnose, prescribe, or make independent clinical decisions."

### If a Clinical Event Occurs

1. Preserve all logs and interaction records
2. Notify legal counsel immediately
3. Cooperate with partner institution's clinical review
4. Document Hanna's role as information conduit, not decision-maker
5. Emphasize supervision structure and escalation protocols

---

## Annual Review Checklist

- [ ] Review Thai MOPH/FDA digital health guidance updates
- [ ] Audit interaction logs for scope violations
- [ ] Update escalation protocols based on clinical feedback
- [ ] Verify disclosure language meets current standards
- [ ] Review partner contracts for liability clarity
- [ ] Confirm insurance coverage adequacy

---

## Summary

| Question | Answer |
|----------|--------|
| Is Hanna a medical device? | No — information/communication platform |
| Does Hanna practice medicine? | No — always supervised, always escalates |
| Who is liable for clinical decisions? | The supervising institution |
| What happens if a regulator asks? | "Supervised infrastructure, not a practitioner" |

**The regulatory posture is defensive by design.** We achieve commercial success by being *useful* while remaining *legally clean*.
