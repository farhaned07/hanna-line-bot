# Patient Cohort Planning Template
**Hanna Pilot Program**

---

## Overview

This document guides you through selecting the optimal patient cohort for your Hanna pilot. The goal is to select 500-1,000 patients who will benefit most from daily AI-assisted monitoring.

---

## Step 1: Define Selection Criteria

### Recommended Inclusion Criteria

| Criteria | Recommendation | Notes |
|----------|----------------|-------|
| **Primary Condition** | Diabetes Type 2, Hypertension, or both | High benefit from daily monitoring |
| **Cohort Size** | 500-1,000 patients | Statistically significant sample |
| **Age Range** | 40-80 years | Balance of tech-savvy and at-risk |
| **LINE Usage** | Uses LINE actively | Required for Hanna communication |
| **Language** | Thai speakers | Current system limitation |
| **Care Setting** | Outpatient chronic care | Not acute/inpatient |

### Recommended Exclusion Criteria

| Criteria | Reason |
|----------|--------|
| Currently hospitalized | Not suitable for remote monitoring |
| No smartphone | Cannot receive LINE messages |
| Non-Thai speakers | Voice AI optimized for Thai |
| Terminal illness | Different care goals |
| Severe cognitive impairment | Cannot interact with system |
| Already in intensive care program | Avoid duplicate monitoring |

---

## Step 2: Prepare Patient List

### Required Data Fields

| Field | Description | Format | Required |
|-------|-------------|--------|----------|
| `patient_id` | Your internal patient ID | Text/Number | ✓ |
| `name` | Patient's name (preferred name) | Text | ✓ |
| `line_user_id` | LINE user ID (if known) | Text | Optional* |
| `phone` | Mobile phone number | +66XXXXXXXXX | ✓ |
| `age` | Patient age in years | Number | ✓ |
| `condition` | Primary condition | "Diabetes", "Hypertension", "Both" | ✓ |
| `language` | Preferred language | "Thai" | ✓ |

*LINE user ID will be captured when patient adds Hanna as a friend.

### Sample Data Format (Excel/CSV)

```
patient_id,name,phone,age,condition,language
P001,คุณสมหญิง,+66812345678,62,Diabetes,Thai
P002,คุณสมชาย,+66898765432,55,Hypertension,Thai
P003,คุณมะลิ,+66891234567,70,Both,Thai
```

---

## Step 3: Privacy Checklist (PDPA Compliance)

Before uploading patient data, confirm the following:

### Legal Basis

- [ ] We have legitimate interest to process this data for care management
- [ ] Patients have been informed about the program (or will be before go-live)
- [ ] Data processing agreement signed with Archangel Co., Ltd.

### Patient Notification

- [ ] Patients will receive a welcome message explaining Hanna
- [ ] The message clearly states Hanna is an AI assistant
- [ ] Patients are informed how to opt out

### Data Security

- [ ] Data will be uploaded via secure channel (provided by Hanna team)
- [ ] Patient list stored on encrypted systems
- [ ] Access limited to authorized personnel

---

## Step 4: Secure Data Upload

### Upload Process

1. **Prepare your Excel/CSV file** using the format above
2. **Email your Implementation Manager** to request the secure upload link
3. **Upload the file** via the secure portal
4. **Receive confirmation** within 24 hours
5. **System configuration** begins (24-48 hours)

### File Naming Convention

`[HospitalName]_PatientCohort_[Date].xlsx`

Example: `BangkokHospital_PatientCohort_2026-01-20.xlsx`

---

## Step 5: Enrollment Timeline

| Day | Activity | Owner |
|-----|----------|-------|
| **D-7** | Patient list finalized | Hospital |
| **D-5** | Data uploaded to Hanna | Hospital |
| **D-3** | System configured | Hanna team |
| **D-1** | Enrollment confirmation sent | Hanna team |
| **D-Day** | Patient welcome messages sent | Hanna (auto) |

---

## FAQ

**Q: What if we don't know the LINE user ID?**  
A: No problem. Just provide phone numbers. When patients add Hanna as a friend on LINE, their ID will be automatically captured.

**Q: Can we add patients mid-pilot?**  
A: Yes. Contact your Implementation Manager with an additional patient list. Allow 48 hours for configuration.

**Q: What if a patient wants to opt out?**  
A: Patients can reply "หยุด" (stop) at any time. Hanna will stop messaging them and mark them as inactive.

**Q: Is the data stored in Thailand?**  
A: Data is stored in Supabase's Singapore region (closest to Thailand). PDPA-compliant.

---

## Template Download

📥 **Download the Excel template:** [Ask your Implementation Manager]

---

*Hanna is a product of Archangel Co., Ltd.*
