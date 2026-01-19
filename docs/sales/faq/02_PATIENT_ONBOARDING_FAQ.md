# Patient Onboarding FAQ
**How Hospitals Enroll Patients into Hanna**

---

## Overview

This FAQ answers common questions about how to onboard patients into the Hanna pilot program.

---

## General Questions

### Q: How do patients get enrolled in Hanna?
**A:** There are two steps:
1. **Hospital provides patient list** → We configure the system
2. **Patient adds Hanna on LINE** → They're automatically connected to their record

### Q: Do patients need to download an app?
**A:** No. Hanna works through LINE, which most Thai patients already use (50M+ active users). No new app downloads required.

### Q: How do patients add Hanna on LINE?
**A:** Patients can:
- **Search** for @hanna in LINE
- **Scan a QR code** (we provide printable materials)
- **Click a link** (we provide a direct add-friend URL)

### Q: What happens when a patient adds Hanna?
**A:** Hanna sends a welcome message explaining the service, confirms they're part of the program, and begins daily check-ins.

---

## Data & Privacy

### Q: What patient information do we need to provide?
**A:** Basic information only:
- Patient ID (your internal ID)
- Name
- Phone number
- Age
- Primary condition (Diabetes, Hypertension, etc.)

We do NOT need medical records, EMR data, or detailed clinical history for the pilot.

### Q: How do we upload patient data?
**A:** Via secure upload portal. Your Implementation Manager will provide access. File format is Excel or CSV.

### Q: What about patient consent?
**A:** Patients receive a welcome message when they add Hanna that explains:
- What Hanna is (AI health assistant)
- What it does (check-ins, reminders, nurse connection)
- What it is NOT (not a doctor/nurse)
- How to opt out

This serves as informed consent for participation.

### Q: Can patients opt out?
**A:** Yes, anytime. Patients can:
- Type "หยุด" (stop) to Hanna
- Contact the hospital directly
- We mark them inactive; no more messages sent

### Q: Is PDPA consent handled?
**A:** Yes. The welcome message includes disclosure. We also recommend hospitals inform patients about the program before go-live (we provide template messaging).

---

## Enrollment Process

### Q: What's the timeline for enrollment?
**A:**
| Day | Activity |
|-----|----------|
| D-7 | Hospital finalizes patient list |
| D-5 | Data uploaded to Hanna |
| D-3 | System configured |
| D-1 | Enrollment confirmation |
| D-Day | Patients receive welcome messages |

### Q: How many patients can we enroll?
**A:** 500-1,000 for the pilot. This provides statistically significant data while keeping the pilot manageable.

### Q: Can we add patients mid-pilot?
**A:** Yes. Provide an additional patient list to your Implementation Manager. Allow 48 hours for configuration.

### Q: Can we remove patients mid-pilot?
**A:** Yes. Removed patients stop receiving messages and are marked inactive in the system.

### Q: What if a patient doesn't have LINE?
**A:** They cannot participate in the pilot. LINE is required for Hanna communication. Consider selecting patients who are active LINE users.

---

## Patient Experience

### Q: How are patients notified about the program?
**A:** We recommend two approaches:
1. **Before go-live:** Hospital sends an informational message/letter explaining Hanna
2. **At go-live:** Hanna sends welcome message when patient adds as friend

We provide template messaging in both Thai and English.

### Q: What does the welcome message say?

```
สวัสดี [ชื่อผู้ป่วย] 👋

เราคือ Hanna จากโรงพยาบาล [ชื่อโรงพยาบาล]
เราจะช่วยเก็บตัวและจัดการโรคเรื้อรังของคุณ
ทุกวัน เราจะส่งคำถามสั้นๆ เพื่อให้เรารู้สภาพของคุณ

ฉันไม่ใช่แพทย์หรือพยาบาล 
หากมีเหตุฉุกเฉิน กรุณาโทร 1669 ค่ะ
```

### Q: How often will patients hear from Hanna?
**A:** Typically 1-2 messages per day:
- Morning check-in (how are you feeling? medications?)
- Optional: afternoon reminder if needed

Patients can also message Hanna anytime.

### Q: What if a patient is confused about Hanna?
**A:** Hanna can explain itself if asked. We also provide a Patient Guide (in Thai) that can be distributed by the hospital.

---

## Elderly Patients

### Q: Can elderly patients use Hanna?
**A:** Yes. Hanna is designed for this demographic:
- **Simple responses** (yes/no works fine)
- **Voice option** (for those who prefer speaking)
- **Patient, warm tone** in Thai
- **Large buttons** in LINE interface

### Q: What about patients who struggle with typing?
**A:** Patients can use the "โทรหาฮันนา" (Call Hanna) button to speak instead of type. Hanna understands Thai speech and responds with natural voice.

### Q: What about illiterate patients?
**A:** The voice feature helps, but for fully illiterate patients, they may need family support to participate effectively.

---

## Technical Questions

### Q: What if a patient's phone number doesn't match LINE?
**A:** LINE user ID is captured when they add Hanna as a friend, regardless of phone number. Phone number is used only for reference and potential fallback (nurse calls).

### Q: What if a patient loses their phone or changes numbers?
**A:** Contact your Implementation Manager. We can update patient records and reconnect them.

### Q: Can multiple family members use one LINE account with Hanna?
**A:** Not recommended. Each patient should have their own LINE account to avoid confusion in tracking.

---

## Common Challenges

### Q: What if patients don't add Hanna?
**A:** This is normal—not everyone adds immediately. Options:
- Send reminder messages from the hospital
- Provide QR codes at clinic visits
- Have nurses mention it during appointments
- Engagement typically ramps up over 2-3 weeks

### Q: What if engagement is low?
**A:** We track engagement weekly. If rates are below target, we work with you to:
- Adjust messaging timing
- Simplify questions
- Boost awareness through hospital channels

### Q: What if patients ask medical questions?
**A:** Hanna redirects to the care team. Response:
> "ฉันไม่สามารถให้คำแนะนำทางการแพทย์ได้ค่ะ กรุณาติดต่อทีมพยาบาลของคุณ"
> (I cannot provide medical advice. Please contact your care team.)

---

## Checklist: Before Enrollment

- [ ] Patient list finalized (500-1,000 patients)
- [ ] Data formatted correctly (see template)
- [ ] PDPA compliance verified
- [ ] Patient communication plan in place
- [ ] Staff trained on dashboard
- [ ] Support contacts confirmed

---

*Hanna is a product of Archangel Co., Ltd.*
