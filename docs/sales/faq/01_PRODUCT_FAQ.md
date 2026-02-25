# Product FAQ
**For Hanna Sales Conversations**

---

## About Hanna

### Q: What exactly is Hanna?
**A:** Hanna is the financial risk engine for capitation-based hospitals. It continuously monitors chronic patients via LINE and voice between clinic visits, detects deterioration using our OneBrain™ engine, and surfaces at-risk patients to nurses before they become expensive complications.

### Q: Is Hanna an AI chatbot?
**A:** Hanna is more than a chatbot—it's care infrastructure. While it uses AI (Groq Llama 3) for natural conversations, the core value is the OneBrain™ risk engine that filters routine interactions and escalates only what matters to nurses.

### Q: Is Hanna a medical device?
**A:** No. Hanna is a care coordination platform, not a diagnostic tool. It does not diagnose, prescribe, or make clinical decisions. All clinical decisions remain with your licensed staff.

### Q: Does Hanna replace nurses?
**A:** Absolutely not. Hanna is a financial protection tool for your hospital. It handles the routine monitoring (check-ins, reminders, data collection) so nurses can focus on the patients who are actually deteriorating. The goal is preventing expensive complications, not replacing staff.

---

## How It Works

### Q: How do patients interact with Hanna?
**A:** Patients use LINE—the app they already have. No downloads needed. Hanna sends daily check-in messages, medication reminders, and can hold voice conversations (important for elderly patients). Patients respond with simple yes/no answers or describe symptoms naturally.

### Q: What data does Hanna collect?
**A:** Vitals (blood pressure, glucose), medication adherence (taken/skipped), symptom descriptions, and general wellness. All data is stored securely and shared only with the care team.

### Q: How does the risk scoring work?
**A:** OneBrain™ uses a transparent, deterministic formula—not a black box. Points are assigned for:
- **Emergency keywords**: +3 points (CRITICAL override for SOS triggers like chest pain, breathing difficulty, fainting)
- **Dangerous vitals**: +2 points (Glucose >400 or <70, BP critical)
- **Missed medications**: +2 points (>3 consecutive days)
- **Worsening trends**: +1 point (declining glucose trends)
- **Silence**: +1 point (no check-in for 48+ hours)
- **Age modifier**: ×1.2 (if patient age >70)

**Risk Levels:** Score 8-10 = CRITICAL, Score 5-7 = HIGH, Score 0-4 = LOW (routine, AI handles).

### Q: What happens during a daily check-in?
**A:** Hanna uses a structured button-based flow:
1. **Mood**: "วันนี้เป็นยังไง?" → [ดี] [ปกติ] [ไม่ดี]
2. **Medication**: "กินยาครบไหม?" → [ได้ ครบ] [บางส่วน] [ไม่ได้เลย]
3. **Symptoms**: "มีอาการผิดปกติไหม?" → [ไม่] [มีอาการบ้าง]
4. **Completion**: Streak celebration if Day 7/14/30

Messages vary daily to prevent fatigue. Time-based greetings (morning/afternoon/evening) make interactions feel personal.

### Q: What are streak celebrations?
**A:** Hanna celebrates patient consistency:
- 🔥 **Day 7**: "7 วันติดต่อกัน! สุดยอด!"
- 🏆 **Day 14**: "2 อาทิตย์แล้ว! เก่งมาก!"
- ⭐ **Day 30**: "1 เดือนเต็ม! ยอดเยี่ยม!"

This gamification improves engagement and medication adherence.

### Q: What if a patient stops responding?
**A:** Hanna follows a 7-day non-responder protocol:
| Day | Action |
|-----|--------|
| 3-4 | Concern message: "เรากังวลเพราะคุณไม่ได้ตอบ" |
| 5-6 | Personal appeal: "เราคิดถึงคุณนะ" |
| 7 | Final choice: restart or contact nurse |
| 8+ | Auto-escalation to nurse dashboard |

Silence is treated as a risk signal, not ignored.

### Q: What happens when Hanna detects a problem?
**A:** A task appears on the nurse dashboard with full context: what triggered it, patient history, and a suggested action. The nurse reviews and decides what to do. Hanna never acts autonomously on clinical matters.

### Q: How are emergencies handled?
**A:** If a patient types emergency keywords (chest pain, can't breathe, fainting), Hanna immediately: (1) tells the patient to call 1669, (2) creates a CRITICAL alert for the nurse, and (3) logs the event. Nurses are notified within seconds.

---

## Clinical Governance

### Q: Who is responsible for clinical decisions?
**A:** Your clinical staff. Hanna is a tool; nurses are the decision-makers. The pilot agreement clearly states your institution retains clinical responsibility. Hanna assists; nurses decide.

### Q: What does "supervised AI" mean?
**A:** Every AI-generated response and risk assessment is visible to nurses. Nurses can override, adjust, or escalate at any time. There are no autonomous clinical actions.

### Q: Is there an audit trail?
**A:** Yes. Every patient message, AI response, risk calculation, task creation, and resolution is logged with timestamps and user IDs. Full export available for compliance.

### Q: What if Hanna gives wrong information?
**A:** Hanna is designed to redirect medical questions to the care team, not answer them. If something seems wrong, nurses can see all interactions and correct course. False alarms are logged to improve the system.

---

## Integration

### Q: Do we need to integrate with our EMR/HIS?
**A:** Not for the pilot. Hanna operates standalone during the 90-day trial. EMR integration is available as an add-on for full deployment.

### Q: What technical setup is required?
**A:** Minimal. We provide the dashboards and LINE bot. You provide a patient list (Excel format). We handle everything else. Your IT team just needs to ensure nurses can access web URLs.

### Q: What patient data format do you need?
**A:** A simple spreadsheet with: patient ID, name, phone number, age, condition. LINE user IDs are captured automatically when patients add Hanna as a friend.

---

## Implementation

### Q: How long does implementation take?
**A:** One week from kickoff. Week 1 is training, Week 2 is patient enrollment, Week 3+ is go-live.

### Q: What training is provided?
**A:** Comprehensive training for all roles:
- CNO: 90 minutes (governance, oversight)
- Nurses: 2 hours (dashboard, workflows)
- Admin/IT: 1 hour (enrollment, support)

All training is recorded and available for rewatching.

### Q: How many patients should we start with?
**A:** 500-1,000 patients is optimal for the pilot. Large enough for statistical significance, small enough to manage closely during learning phase.

### Q: Can we add patients mid-pilot?
**A:** Yes. Contact your Implementation Manager with an additional list. Allow 48 hours for configuration.

---

## Pricing

### Q: What does the pilot cost?
**A:** ฿180,000 for 90 days (฿60,000/month pilot rate). If the pilot hits agreed metrics, ฿30K is credited back as a Performance Credit. Includes full platform access, implementation support, training, weekly check-ins, and the 90-day completion report.

### Q: What's included in the pilot fee?
**A:** Everything needed to run a successful pilot:
- Platform access (LINE bot, dashboard)
- Implementation Manager (dedicated contact)
- Staff training (all roles)
- Weekly progress reports
- 90-day completion report with ROI analysis

### Q: What does full deployment cost?
**A:** ฿50,000/month (annual contract). Covers up to 1,000 patients. Additional cohorts are priced separately.

### Q: How does pricing compare to alternatives?
**A:** One prevented complication (DKA, hypertensive crisis) costs ฿175,000+. Hanna costs ฿50,000/month. If Hanna prevents one complication per month, it pays for itself 3.5x over. The alternative — doing nothing — means absorbing that ฿175K+ under capitation.

---

## Security & Compliance

### Q: Where is data stored?
**A:** Supabase (Singapore region, closest to Thailand). PDPA-compliant architecture.

### Q: Is Hanna PDPA compliant?
**A:** Yes. Patients receive disclosure, data is stored securely, and patients can request deletion at any time. We sign a Data Processing Agreement with each hospital.

### Q: What about HIPAA?
**A:** Hanna is architected for HIPAA-alignment. We can sign a Business Associate Agreement (BAA) for international clients.

### Q: Who can access patient data?
**A:** Only your authorized staff (through the dashboard) and Hanna technical staff (for support). Access is logged and auditable.

---

## Common Objections

### "We already use LINE for patient communication."
**A:** Great—Hanna makes it better. Instead of manual messages, Hanna automates the routine and surfaces only what needs attention. Your nurses currently mix high-risk and routine patients. Hanna filters for you.

### "Our nurses are too busy for another tool."
**A:** Hanna saves time, not adds it. Average dashboard time is 15-30 minutes/day. Nurses spend less time on routine follow-ups and more on patients who need them.

### "We're worried about AI accuracy."
**A:** Our risk scoring is deterministic and transparent—you can see exactly why each alert was triggered. Nurses always have the final say. The system improves over time as you log false alarms.

### "What if patients don't respond?"
**A:** Engagement ramps up over 2 weeks as patients get comfortable. Our target is 80%+ response rate. If someone stops responding, Hanna alerts the nurse (silence is a risk signal).

### "We don't have budget right now."
**A:** Consider the cost of not acting: under capitation, one DKA admission costs ฿175K+. Hanna's pilot costs ฿180K total. If it prevents one complication, it's already paid for.

---

## Quick Stats

| Metric | Value |
|--------|-------|
| **AI Model** | Groq Llama 3.3 70B |
| **Languages** | Thai (primary), English |
| **Voice AI** | Microsoft EdgeTTS (Premwadee) |
| **Response Time** | <2 seconds (message), <1 hour (CRITICAL alert) |
| **Target Engagement** | 80%+ daily response |
| **Complication Prevention** | Detects deterioration before it becomes expensive |

---

*Hanna is a product of Archangel Co., Ltd.*
