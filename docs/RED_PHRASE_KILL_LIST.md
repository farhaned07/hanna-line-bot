# 🚫 RED PHRASE KILL LIST

**Classification**: MANDATORY - ALL TEAM MEMBERS  
**Scope**: Code, Prompts, UI, Sales Materials, Patient Communications  
**Violation**: Any phrase on this list appearing in production = IMMEDIATE REMEDIATION  

---

## BANNED PHRASES - MEDICAL CLAIMS

These phrases imply medical capability that Hanna does not have.

| Banned Phrase | Language | Why Banned |
|---------------|----------|------------|
| `diagnose` / `วินิจฉัย` | EN/TH | Implies medical diagnosis capability |
| `prescribe` / `สั่งยา` | EN/TH | Implies prescription authority |
| `treatment recommendation` | EN | Implies clinical guidance |
| `แนะนำการรักษา` | TH | Implies clinical guidance |
| `medical advice` / `คำแนะนำทางการแพทย์` | EN/TH | Implies licensed medical opinion |
| `clinical decision` / `การตัดสินใจทางคลินิก` | EN/TH | Implies autonomous clinical authority |
| `you should take [medication]` | EN | Direct medication instruction |
| `ควรกินยา [ชื่อยา]` | TH | Direct medication instruction |
| `increase your dose` / `เพิ่มขนาดยา` | EN/TH | Dosage modification |
| `decrease your dose` / `ลดขนาดยา` | EN/TH | Dosage modification |
| `stop taking` / `หยุดกินยา` | EN/TH | Medication cessation advice |

---

## BANNED PHRASES - IDENTITY CLAIMS

These phrases misrepresent Hanna's identity or qualifications.

| Banned Phrase | Language | Why Banned |
|---------------|----------|------------|
| `registered nurse` / `พยาบาลวิชาชีพ` | EN/TH | False professional claim |
| `licensed` / `ได้รับใบอนุญาต` | EN/TH | Implies regulatory licensure |
| `trained at [hospital]` | EN | False educational claim |
| `จบจาก [โรงพยาบาล/มหาวิทยาลัย]` | TH | False educational claim |
| `years of experience` / `ประสบการณ์ X ปี` | EN/TH | Implies human work history |
| `I am a nurse` / `ฉันเป็นพยาบาล` | EN/TH | Direct false identity |
| `medical device` / `เครื่องมือแพทย์` | EN/TH | Regulatory misclassification |
| `FDA approved` / `อย. อนุมัติ` | EN/TH | False regulatory claim |
| `clinically validated` | EN | Implies clinical trials |
| `healthcare provider` | EN | Licensed provider term |

---

## BANNED PHRASES - CERTAINTY LANGUAGE

These phrases imply medical certainty that AI cannot provide.

| Banned Phrase | Language | Why Banned |
|---------------|----------|------------|
| `This is definitely...` / `นี่คือแน่นอน...` | EN/TH | False certainty |
| `You have [condition]` / `คุณเป็น [โรค]` | EN/TH | Diagnosis statement |
| `This confirms...` / `นี่ยืนยันว่า...` | EN/TH | Diagnostic confirmation |
| `Based on my clinical judgment` | EN | False clinical authority |
| `ตามความเห็นทางคลินิก` | TH | False clinical authority |
| `I'm confident that...` (re: medical) | EN | Medical certainty |
| `Your test results show...` | EN | Medical interpretation |
| `ผลตรวจบอกว่า...` | TH | Medical interpretation |

---

## ALLOWED ALTERNATIVES ✅

Use these phrases instead:

| Instead Of | Use This |
|------------|----------|
| "I'm a nurse" | "ฮันนาเป็น AI ช่วยบันทึกสุขภาพค่ะ" |
| "You should take..." | "พยาบาลจริงจะติดต่อกลับเรื่องยานะคะ" |
| "This is definitely..." | "จากข้อมูลที่บันทึก... แต่ควรปรึกษาแพทย์ค่ะ" |
| "medical advice" | "ข้อมูลสุขภาพทั่วไป" |
| "diagnose" | "ตรวจจับรูปแบบ" / "สังเกตเห็นว่า" |
| "treatment" | "การดูแลตัวเอง" / "คำแนะนำทั่วไป" |
| "prescribe" | "แนะนำให้ปรึกษาแพทย์เรื่องยา" |

---

## VERIFICATION COMMANDS

Run these before every production deployment:

```bash
# Check for banned medical claims
grep -rEi "diagnose|prescribe|treatment recommendation|clinical decision" ./src

# Check for banned identity claims  
grep -rEi "registered nurse|พยาบาลวิชาชีพ|Siriraj|licensed|years of experience" ./src

# Check for banned certainty language
grep -rEi "you have \[|this confirms|clinical judgment" ./src
```

**Expected Result**: All commands return empty (exit code 1)

---

## ENFORCEMENT

| Role | Responsibility |
|------|----------------|
| **Developer** | Check before commit |
| **Tech Lead** | Review in PR |
| **QA** | Include in test suite |
| **Product** | Review AI prompts monthly |

**Violation Protocol**:
1. Immediate hotfix if found in production
2. Post-mortem within 24 hours
3. Add to automated test suite

---

**Document Owner**: Product + Legal  
**Last Updated**: December 31, 2025  
**Review Cycle**: Quarterly
