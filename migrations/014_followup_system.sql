-- Migration 014: Follow-up System
-- Links Scribe patients to LINE follow-up program
-- Enables automated Day 1/3/7/14 messaging

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═════════════════════════════════════════════════════════════
-- FOLLOW-UP ENROLLMENTS
-- Tracks which Scribe patients are enrolled in LINE follow-up
-- ═════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS followup_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Patient linkage
    scribe_note_id UUID REFERENCES scribe_notes(id) ON DELETE CASCADE,
    clinician_id UUID REFERENCES clinicians(id),
    
    -- Patient info (snapshot at enrollment)
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
    
    -- Enrollment details
    enrollment_source VARCHAR(50) DEFAULT 'scribe', -- 'scribe', 'manual', 'bulk_import'
    followup_program VARCHAR(50) DEFAULT 'chronic_care', -- 'chronic_care', 'post_op', 'medication_adherence'
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'opted_out', 'no_response'
    current_day INTEGER DEFAULT 0, -- Which day of follow-up (1, 3, 7, 14)
    
    -- Engagement metrics
    messages_sent INTEGER DEFAULT 0,
    messages_responded INTEGER DEFAULT 0,
    last_response_at TIMESTAMP,
    
    -- Timestamps
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followup_scribe_note ON followup_enrollments(scribe_note_id);
CREATE INDEX IF NOT EXISTS idx_followup_clinician ON followup_enrollments(clinician_id);
CREATE INDEX IF NOT EXISTS idx_followup_line_user ON followup_enrollments(line_user_id);
CREATE INDEX IF NOT EXISTS idx_followup_status ON followup_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_followup_enrolled_at ON followup_enrollments(enrolled_at);

-- ═════════════════════════════════════════════════════════════
-- FOLLOW-UP MESSAGES
-- Tracks all automated messages sent to enrolled patients
-- ═════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS followup_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Linkage
    enrollment_id UUID REFERENCES followup_enrollments(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES chronic_patients(id),
    
    -- Message details
    message_type VARCHAR(50) DEFAULT 'automated', -- 'automated', 'manual', 'alert'
    message_day INTEGER, -- Day 1, 3, 7, or 14
    message_template VARCHAR(100), -- Template name used
    
    -- Content
    message_content TEXT NOT NULL,
    message_language VARCHAR(10) DEFAULT 'th', -- 'th', 'en', 'bn'
    
    -- Delivery
    delivery_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
    delivery_method VARCHAR(50) DEFAULT 'line', -- 'line', 'sms', 'push'
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- LINE specific
    line_message_id VARCHAR(255),
    line_delivery_error TEXT,
    
    -- Timestamps
    scheduled_for TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followup_msg_enrollment ON followup_messages(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_followup_msg_patient ON followup_messages(patient_id);
CREATE INDEX IF NOT EXISTS idx_followup_msg_status ON followup_messages(delivery_status);
CREATE INDEX IF NOT EXISTS idx_followup_msg_scheduled ON followup_messages(scheduled_for);

-- ═════════════════════════════════════════════════════════════
-- PATIENT RESPONSES
-- Tracks patient responses to follow-up messages
-- ═════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS patient_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Linkage
    enrollment_id UUID REFERENCES followup_enrollments(id) ON DELETE CASCADE,
    message_id UUID REFERENCES followup_messages(id),
    patient_id UUID REFERENCES chronic_patients(id),
    
    -- Response content
    response_type VARCHAR(50) DEFAULT 'text', -- 'text', 'button', 'voice', 'image'
    response_content TEXT,
    response_data JSONB, -- Structured data (e.g., button selections, vitals)
    
    -- Sentiment analysis
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    sentiment_label VARCHAR(20), -- 'positive', 'neutral', 'negative'
    keywords_detected TEXT[], -- Extracted keywords
    
    -- Clinical flags
    requires_attention BOOLEAN DEFAULT FALSE,
    attention_reason TEXT,
    escalated_to_nurse BOOLEAN DEFAULT FALSE,
    escalated_at TIMESTAMP,
    
    -- Timestamps
    responded_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patient_resp_enrollment ON patient_responses(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_patient_resp_message ON patient_responses(message_id);
CREATE INDEX IF NOT EXISTS idx_patient_resp_patient ON patient_responses(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_resp_requires_attention ON patient_responses(requires_attention);

-- ═════════════════════════════════════════════════════════════
-- FOLLOW-UP TEMPLATES
-- Customizable message templates for different programs
-- ═════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS followup_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Template metadata
    template_name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) DEFAULT 'chronic_care', -- 'chronic_care', 'post_op', 'medication'
    day_number INTEGER NOT NULL, -- 1, 3, 7, or 14
    
    -- Content by language
    language VARCHAR(10) DEFAULT 'th',
    message_subject VARCHAR(255),
    message_body TEXT NOT NULL,
    message_buttons JSONB, -- LINE quick reply buttons
    
    -- Variables supported (e.g., {{patient_name}}, {{clinician_name}})
    variables TEXT[],
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Performance tracking
    avg_response_rate DECIMAL(5,2), -- Historical response rate
    avg_sentiment DECIMAL(3,2), -- Historical sentiment
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followup_tpl_type ON followup_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_followup_tpl_day ON followup_templates(day_number);
CREATE INDEX IF NOT EXISTS idx_followup_tpl_active ON followup_templates(is_active);

-- ═════════════════════════════════════════════════════════════
-- SEED DEFAULT TEMPLATES (Thai)
-- ═════════════════════════════════════════════════════════════

-- Day 1: Welcome & Initial Assessment
INSERT INTO followup_templates (template_name, template_type, day_number, language, message_body, message_buttons, variables, is_default)
VALUES 
('day1_welcome_th', 'chronic_care', 1, 'th', 
'สวัสดีค่ะ {{patient_name}} 👋

ฮันนาเองนะคะ พยาบาลส่วนตัวของคุณ

คุณ{{clinician_name}} เป็นห่วงสุขภาพของคุณมากค่ะ ให้ฮันนาช่วยติดตามอาการในช่วง 2 สัปดาห์แรกนะคะ

วันนี้รู้สึกอย่างไรบ้างคะ? 💚', 
'[{"type": "button", "label": "สบายดี 😊", "data": "mood_good"}, {"type": "button", "label": "ไม่ค่อยสบาย 😔", "data": "mood_bad"}, {"type": "button", "label": "มีคำถาม ❓", "data": "has_question"}]'::jsonb,
ARRAY['patient_name', 'clinician_name'], TRUE),

('day1_welcome_en', 'chronic_care', 1, 'en', 
'Hello {{patient_name}} 👋

This is Hanna, your personal nurse.

Dr. {{clinician_name}} cares about your health. Let me help monitor your symptoms for the first 2 weeks.

How are you feeling today? 💚',
'[{"type": "button", "label": "Feeling Good 😊", "data": "mood_good"}, {"type": "button", "label": "Not Well 😔", "data": "mood_bad"}, {"type": "button", "label": "Have Questions ❓", "data": "has_question"}]'::jsonb,
ARRAY['patient_name', 'clinician_name'], FALSE),

-- Day 3: Medication Adherence Check
('day3_medication_th', 'chronic_care', 3, 'th', 
'สวัสดีค่ะ {{patient_name}} 💊

วันนี้กินยาครบตามที่หมอสั่งหรือยังคะ?

การกินยาสม่ำเสมอสำคัญมากนะคะ ช่วยให้อาการดีขึ้นเร็วค่ะ',
'[{"type": "button", "label": "กินแล้ว ✅", "data": "meds_taken"}, {"type": "button", "label": "ลืมกิน 😅", "data": "meds_missed"}, {"type": "button", "label": "มีผลข้างเคียง ⚠️", "data": "side_effects"}]'::jsonb,
ARRAY['patient_name'], TRUE),

('day3_medication_en', 'chronic_care', 3, 'en', 
'Hi {{patient_name}} 💊

Have you taken your medication as prescribed today?

Taking medication regularly is very important for your recovery.',
'[{"type": "button", "label": "Taken ✅", "data": "meds_taken"}, {"type": "button", "label": "Missed 😅", "data": "meds_missed"}, {"type": "button", "label": "Side Effects ⚠️", "data": "side_effects"}]'::jsonb,
ARRAY['patient_name'], FALSE),

-- Day 7: Symptom Progress Check
('day7_symptoms_th', 'chronic_care', 7, 'th', 
'{{patient_name}} คะ ผ่านมา 1 สัปดาห์แล้ว 📅

อาการเป็นอย่างไรบ้างคะ compared to วันแรก?

ฮันนาอยากทราบว่า:
• อาการดีขึ้นหรือแย่ลง?
• มีอาการใหม่ๆ เกิดขึ้นไหม?
• นอนหลับเพียงพอไหม?',
'[{"type": "button", "label": "ดีขึ้นมาก 😊", "data": "much_better"}, {"type": "button", "label": "ดีขึ้นนิดหน่อย 🙂", "data": "slightly_better"}, {"type": "button", "label": "เหมือนเดิม 😐", "data": "same"}, {"type": "button", "label": "แย่ลง 😟", "data": "worse"}]'::jsonb,
ARRAY['patient_name'], TRUE),

('day7_symptoms_en', 'chronic_care', 7, 'en', 
'Hi {{patient_name}}, it''s been 1 week! 📅

How are your symptoms compared to day 1?

I''d like to know:
• Are symptoms better or worse?
• Any new symptoms?
• Sleeping well?',
'[{"type": "button", "label": "Much Better 😊", "data": "much_better"}, {"type": "button", "label": "Slightly Better 🙂", "data": "slightly_better"}, {"type": "button", "label": "Same 😐", "data": "same"}, {"type": "button", "label": "Worse 😟", "data": "worse"}]'::jsonb,
ARRAY['patient_name'], FALSE),

-- Day 14: Final Assessment & Next Steps
('day14_final_th', 'chronic_care', 14, 'th', 
'{{patient_name}} คะ ยินดีด้วยนะคะ! 🎉

ครบ 2 สัปดาห์ แล้วอาการเป็นอย่างไรบ้าง?

ฮันนาขอสรุปนะคะ:
• อาการโดยรวมดีขึ้นไหม?
• ยังกินยาสม่ำเสมอไหม?
• มีอะไรให้ฮันนาช่วยเพิ่มเติมไหม?

หมอ{{clinician_name}} นัดครั้งต่อไปเมื่อไหร่คะ?',
'[{"type": "button", "label": "ดีขึ้นมาก พร้อมจบโปรแกรม 😊", "data": "completed"}, {"type": "button", "label": "ยังต้องการติดตามต่อ 📅", "data": "continue"}, {"type": "button", "label": "มีคำถามเพิ่มเติม ❓", "data": "questions"}]'::jsonb,
ARRAY['patient_name', 'clinician_name'], TRUE),

('day14_final_en', 'chronic_care', 14, 'en', 
'Congratulations {{patient_name}}! 🎉

You''ve completed 2 weeks of follow-up care.

Let me summarize:
• Are your symptoms better overall?
• Are you still taking medication regularly?
• Do you need any additional help?

When is your next appointment with Dr. {{clinician_name}}?',
'[{"type": "button", "label": "Much Better - Complete Program 😊", "data": "completed"}, {"type": "button", "label": "Need Continued Follow-up 📅", "data": "continue"}, {"type": "button", "label": "Have Questions ❓", "data": "questions"}]'::jsonb,
ARRAY['patient_name', 'clinician_name'], FALSE);

-- ═════════════════════════════════════════════════════════════
-- AUDIT LOGGING TRIGGERS
-- ═════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_followup_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_followup_enrollments_updated
    BEFORE UPDATE ON followup_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_followup_updated_at();

CREATE TRIGGER trg_followup_templates_updated
    BEFORE UPDATE ON followup_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_followup_updated_at();

-- ═════════════════════════════════════════════════════════════
-- VERIFICATION
-- ═════════════════════════════════════════════════════════════

-- Verify tables created
SELECT 
    'followup_enrollments' as table_name, 
    COUNT(*) as row_count 
FROM followup_enrollments
UNION ALL
SELECT 'followup_messages', COUNT(*) FROM followup_messages
UNION ALL
SELECT 'patient_responses', COUNT(*) FROM patient_responses
UNION ALL
SELECT 'followup_templates', COUNT(*) FROM followup_templates;
