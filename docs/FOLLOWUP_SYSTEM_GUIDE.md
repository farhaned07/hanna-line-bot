# 🏥 Hanna Follow-up System - Complete Guide

**Version**: 1.0.0
**Date**: March 9, 2026
**Status**: ✅ Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Reference](#api-reference)
5. [User Journey](#user-journey)
6. [Message Templates](#message-templates)
7. [Configuration](#configuration)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What is the Follow-up System?

The Hanna Follow-up System is an **automated patient monitoring platform** that integrates with Scribe to provide **14-day post-consultation care** via LINE messaging.

### Key Features

| Feature | Description |
|---------|-------------|
| **Automated Messaging** | Day 1/3/7/14 personalized messages |
| **Patient-LINE Linkage** | Connects Scribe patients to LINE follow-up |
| **Sentiment Analysis** | Detects concerning responses automatically |
| **Nurse Escalation** | Alerts nurses for high-risk responses |
| **Multi-language** | Thai + English templates (expandable) |
| **Analytics Dashboard** | Track enrollment, response rates, outcomes |

### Business Value

| Metric | Impact |
|--------|--------|
| **Patient Engagement** | 60-80% response rate (vs. 20% with apps) |
| **Complication Detection** | 24-48hr earlier detection |
| **Nurse Efficiency** | 1 nurse can monitor 500+ patients |
| **Revenue** | ฿50,000-60,000/month per clinic |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SCRIBE PWA                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NoteEditor → Finalize → Enroll Patient              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ POST /api/followup/enroll
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API (Railway)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FollowUp Service                                     │   │
│  │  - enrollPatient()                                    │   │
│  │  - scheduleMessage()                                  │   │
│  │  - processResponse()                                  │   │
│  │  - sendPendingMessages()                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │Followup  │ │Followup  │ │Patient   │
   │Enrollments│ │Messages │ │Responses │
   └──────────┘ └──────────┘ └──────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  Scheduler (Hourly)    │
         │  - Send due messages   │
         │  - Process responses   │
         │  - Escalate to nurse   │
         └────────────────────────┘
```

---

## Database Schema

### followup_enrollments

Tracks patients enrolled in follow-up programs.

```sql
CREATE TABLE followup_enrollments (
    id UUID PRIMARY KEY,
    scribe_note_id UUID REFERENCES scribe_notes(id),
    clinician_id UUID REFERENCES clinicians(id),
    
    -- Patient info (snapshot)
    patient_name VARCHAR(255) NOT NULL,
    patient_hn VARCHAR(100),
    patient_phone VARCHAR(20),
    patient_age INTEGER,
    patient_condition VARCHAR(255),
    
    -- LINE linkage
    line_user_id VARCHAR(255),
    line_display_name VARCHAR(255),
    line_linked BOOLEAN DEFAULT FALSE,
    line_linked_at TIMESTAMP,
    
    -- Program details
    enrollment_source VARCHAR(50) DEFAULT 'scribe',
    followup_program VARCHAR(50) DEFAULT 'chronic_care',
    status VARCHAR(50) DEFAULT 'active',
    current_day INTEGER DEFAULT 0,
    
    -- Engagement metrics
    messages_sent INTEGER DEFAULT 0,
    messages_responded INTEGER DEFAULT 0,
    last_response_at TIMESTAMP,
    
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### followup_messages

Tracks all scheduled and sent messages.

```sql
CREATE TABLE followup_messages (
    id UUID PRIMARY KEY,
    enrollment_id UUID REFERENCES followup_enrollments(id),
    patient_id UUID REFERENCES chronic_patients(id),
    
    message_type VARCHAR(50) DEFAULT 'automated',
    message_day INTEGER, -- 1, 3, 7, or 14
    message_template VARCHAR(100),
    message_content TEXT NOT NULL,
    message_language VARCHAR(10) DEFAULT 'th',
    
    delivery_status VARCHAR(50) DEFAULT 'pending',
    delivery_method VARCHAR(50) DEFAULT 'line',
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    line_message_id VARCHAR(255),
    line_delivery_error TEXT,
    
    scheduled_for TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### patient_responses

Tracks patient responses to messages.

```sql
CREATE TABLE patient_responses (
    id UUID PRIMARY KEY,
    enrollment_id UUID REFERENCES followup_enrollments(id),
    message_id UUID REFERENCES followup_messages(id),
    patient_id UUID REFERENCES chronic_patients(id),
    
    response_type VARCHAR(50) DEFAULT 'text',
    response_content TEXT,
    response_data JSONB,
    
    -- Sentiment analysis
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    sentiment_label VARCHAR(20), -- 'positive', 'neutral', 'negative'
    keywords_detected TEXT[],
    
    -- Clinical flags
    requires_attention BOOLEAN DEFAULT FALSE,
    attention_reason TEXT,
    escalated_to_nurse BOOLEAN DEFAULT FALSE,
    escalated_at TIMESTAMP,
    
    responded_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### followup_templates

Customizable message templates.

```sql
CREATE TABLE followup_templates (
    id UUID PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) DEFAULT 'chronic_care',
    day_number INTEGER NOT NULL, -- 1, 3, 7, or 14
    
    language VARCHAR(10) DEFAULT 'th',
    message_subject VARCHAR(255),
    message_body TEXT NOT NULL,
    message_buttons JSONB, -- LINE quick reply buttons
    
    variables TEXT[], -- {{patient_name}}, {{clinician_name}}
    
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    
    avg_response_rate DECIMAL(5,2),
    avg_sentiment DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Reference

### Enrollment

#### POST /api/followup/enroll

Enroll a patient from Scribe into LINE follow-up.

**Request:**
```json
{
  "scribeNoteId": "uuid",
  "patientName": "Somchai Jaidee",
  "patientHn": "HN12345",
  "patientPhone": "0812345678",
  "patientAge": 55,
  "patientCondition": "Diabetes Type 2",
  "followupProgram": "chronic_care"
}
```

**Response:**
```json
{
  "success": true,
  "enrollment": {
    "id": "uuid",
    "patientName": "Somchai Jaidee",
    "status": "active",
    "currentDay": 0,
    "enrolledAt": "2026-03-09T10:00:00Z"
  }
}
```

#### GET /api/followup/enrollments

Get all enrollments for current clinician.

**Query Parameters:**
- `status` (optional): 'active', 'completed', 'opted_out'

**Response:**
```json
{
  "success": true,
  "enrollments": [
    {
      "id": "uuid",
      "patientName": "Somchai Jaidee",
      "patientHn": "HN12345",
      "status": "active",
      "currentDay": 3,
      "lineLinked": true,
      "messagesSent": 2,
      "messagesResponded": 2,
      "enrolledAt": "2026-03-07T10:00:00Z"
    }
  ]
}
```

#### GET /api/followup/enrollments/:id

Get single enrollment details with messages and responses.

#### POST /api/followup/enrollments/:id/complete

Mark enrollment as completed.

#### POST /api/followup/enrollments/:id/opt-out

Opt-out patient from follow-up.

---

### Stats & Analytics

#### GET /api/followup/stats

Get follow-up statistics for current clinician.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalEnrollments": 50,
    "activeEnrollments": 35,
    "completedEnrollments": 12,
    "lineLinked": 48,
    "avgMessagesSent": 3.8,
    "avgMessagesResponded": 3.2,
    "responseRate": 84.21
  }
}
```

---

### Templates

#### GET /api/followup/templates

Get all active follow-up templates.

#### GET /api/followup/templates/:dayNumber

Get template for specific day.

**Query Parameters:**
- `language` (optional): 'th', 'en'

---

### Webhooks

#### POST /api/followup/webhook/line

Handle patient responses from LINE.

**Request:**
```json
{
  "lineUserId": "U1234567890",
  "messageContent": "สบายดีค่ะ 😊",
  "originalMessageId": "msg-uuid"
}
```

---

## User Journey

### Clinician Flow (Scribe)

1. **Complete Consultation** → Record voice → Generate SOAP note
2. **Finalize Note** → Tap "Finalize" button
3. **Enroll Patient** → Follow-up modal appears
4. **Review Program** → See Day 1/3/7/14 overview
5. **Enter Patient Info** → Name, HN, phone, age, condition
6. **Confirm Enrollment** → Patient enrolled, Day 1 message sent

### Patient Flow (LINE)

**Day 1: Welcome**
```
👋 สวัสดีค่ะ คุณสมชาย
ฮันนาเองนะคะ พยาบาลส่วนตัวของคุณ

คุณหมอเป็นห่วงสุขภาพของคุณมากค่ะ
ให้ฮันนาช่วยติดตามอาการในช่วง 2 สัปดาห์แรกนะคะ

วันนี้รู้สึกอย่างไรบ้างคะ? 💚

[สบายดี 😊] [ไม่ค่อยสบาย 😔] [มีคำถาม ❓]
```

**Day 3: Medication Check**
```
💊 สวัสดีค่ะ คุณสมชาย

วันนี้กินยาครบตามที่หมอสั่งหรือยังคะ?
การกินยาสม่ำเสมอสำคัญมากนะคะ

[กินแล้ว ✅] [ลืมกิน 😅] [มีผลข้างเคียง ⚠️]
```

**Day 7: Symptom Progress**
```
📅 คุณสมชายคะ ผ่านมา 1 สัปดาห์แล้ว

อาการเป็นอย่างไรบ้างคะ compared to วันแรก?

• อาการดีขึ้นหรือแย่ลง?
• มีอาการใหม่ๆ เกิดขึ้นไหม?
• นอนหลับเพียงพอไหม?

[ดีขึ้นมาก 😊] [ดีขึ้นนิดหน่อย 🙂] [เหมือนเดิม 😐] [แย่ลง 😟]
```

**Day 14: Final Assessment**
```
🎉 ยินดีด้วยค่ะ คุณสมชาย!

ครบ 2 สัปดาห์แล้ว อาการเป็นอย่างไรบ้าง?

ฮันนาขอสรุปนะคะ:
• อาการโดยรวมดีขึ้นไหม?
• ยังกินยาสม่ำเสมอไหม?
• มีอะไรให้ฮันนาช่วยเพิ่มเติมไหม?

[ดีขึ้นมาก พร้อมจบโปรแกรม 😊] [ยังต้องการติดตามต่อ 📅] [มีคำถามเพิ่มเติม ❓]
```

---

## Message Templates

### Default Templates (Thai)

| Day | Template | Purpose |
|-----|----------|---------|
| **1** | `day1_welcome_th` | Welcome & initial assessment |
| **3** | `day3_medication_th` | Medication adherence check |
| **7** | `day7_symptoms_th` | Symptom progress evaluation |
| **14** | `day14_final_th` | Final assessment & next steps |

### Template Variables

| Variable | Replaced With |
|----------|---------------|
| `{{patient_name}}` | Patient's name |
| `{{clinician_name}}` | Clinician's name |
| `{{patient_hn}}` | Hospital number |
| `{{day_number}}` | Current day (1, 3, 7, 14) |

### Customizing Templates

```sql
UPDATE followup_templates 
SET message_body = 'Your custom message here, {{patient_name}}!'
WHERE template_name = 'day1_welcome_th';
```

---

## Configuration

### Environment Variables

```bash
# LINE Integration
LINE_CHANNEL_SECRET=your_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_access_token

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT (for API auth)
JWT_SECRET=your_jwt_secret
```

### Scheduler Configuration

Follow-up messages are sent hourly via the scheduler:

```javascript
// src/scheduler.js
cron.schedule('0 * * * *', async () => {
    await followupScheduler.runFollowupScheduler();
}, {
    timezone: "Asia/Bangkok"
});
```

---

## Testing

### Run E2E Tests

```bash
cd /Users/mac/hanna-line-bot
node scripts/test_followup_system.js
```

### Test Coverage

| Component | Tests |
|-----------|-------|
| Database Tables | ✅ 4 tables |
| Patient Enrollment | ✅ Create, duplicate prevention |
| Message Scheduling | ✅ Day 1/3/7/14 |
| Templates | ✅ Thai + English |
| Sentiment Analysis | ✅ Positive/negative/neutral |
| Statistics | ✅ Clinician stats |
| Scheduler | ✅ Message delivery |

---

## Troubleshooting

### Patient Not Receiving Messages

**Check:**
1. `line_user_id` is populated in `followup_enrollments`
2. LINE user ID is valid (starts with `U`)
3. Patient hasn't blocked the LINE official account
4. Message `delivery_status` is not 'failed'

```sql
SELECT line_user_id, line_linked, messages_sent 
FROM followup_enrollments 
WHERE id = 'enrollment-uuid';
```

### Messages Not Sending

**Check:**
1. Scheduler is running (`npm start`)
2. LINE credentials are valid
3. Database connection is working
4. Check `line_delivery_error` column

```sql
SELECT id, message_day, delivery_status, line_delivery_error 
FROM followup_messages 
WHERE delivery_status = 'failed';
```

### High Opt-out Rate

**Solutions:**
1. Reduce message frequency (consider Day 1, 7, 14 only)
2. Personalize messages more (use patient name, condition)
3. Add value in each message (health tips, not just questions)
4. Allow patients to customize frequency

---

## Migration Guide

### Running the Migration

```bash
# Connect to your database
psql $DATABASE_URL < migrations/014_followup_system.sql
```

### Verification

```sql
-- Check tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'followup%';

-- Check templates seeded
SELECT template_name, day_number, language 
FROM followup_templates 
ORDER BY day_number;
```

---

## Success Metrics

### Enrollment Metrics

| Metric | Target | Calculation |
|--------|--------|-------------|
| **Enrollment Rate** | >60% | Enrollments / Total Scribe notes |
| **LINE Linkage Rate** | >80% | LINE-linked / Total enrollments |
| **Completion Rate** | >70% | Completed / Total enrollments |

### Engagement Metrics

| Metric | Target | Calculation |
|--------|--------|-------------|
| **Response Rate** | >60% | Responses / Messages sent |
| **Day 1 Response** | >80% | Day 1 responses / Day 1 messages |
| **Day 14 Completion** | >50% | Day 14 responses / Day 14 messages |

### Clinical Metrics

| Metric | Target | Calculation |
|--------|--------|-------------|
| **Early Detection** | Track count | Complications flagged before ER visit |
| **Nurse Actions** | Track count | Escalations → Interventions |
| **Patient Satisfaction** | >4.5/5 | Post-program survey |

---

## Future Enhancements

### P0 (Next 30 Days)
- [ ] SMS fallback for non-LINE users
- [ ] Medication reminder integration
- [ ] Vitals tracking (glucose, BP) via LINE
- [ ] Dashboard for clinicians

### P1 (Next 90 Days)
- [ ] AI-powered response understanding
- [ ] Multi-condition programs (post-op, hypertension)
- [ ] Family member notifications
- [ ] Automated appointment reminders

### P2 (Next 180 Days)
- [ ] Voice-based responses
- [ ] Integration with hospital EMR
- [ ] Predictive risk scoring
- [ ] Regional expansion (Lao, Burmese)

---

## Support

**Email**: hello@hanna.care
**LINE**: @hannacare
**Documentation**: [hanna.care/docs](https://hanna.care/docs)

---

**"From 10 minutes per note to 30 seconds. From episodic care to continuous monitoring."**

*Last Updated: March 9, 2026*
