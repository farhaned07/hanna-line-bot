/**
 * Mock Data Generator for Hanna Scribe
 * Generates realistic test data for development and demo
 */

const PATIENT_NAMES = [
  'Somchai Ratanakul',
  'Pranee Suwannarat',
  'Niran Chaiyawat',
  'Malai Boonmee',
  'Chatchai Panyadee',
  'Siriwan Kaewta',
  'Boonsong Ritthong',
  'Anchalee Srisai',
  'Thaweesak Montri',
  'Pensri Chailert',
];

const HOSPITAL_NUMBERS = [
  'HN2024001',
  'HN2024015',
  'HN2024023',
  'HN2024047',
  'HN2024056',
  'HN2024089',
  'HN2024102',
  'HN2024118',
  'HN2024135',
  'HN2024149',
];

const SOAP_TEMPLATES = {
  subjective: [
    'Patient reports feeling much better today. States that the medication has helped reduce symptoms significantly. No new complaints. Sleeping well at night. Appetite has improved over the past week.',
    'Complains of persistent cough for 3 days. Describes cough as dry and non-productive. Reports mild fever (37.8°C this morning). Feels fatigued and has poor appetite. No chest pain or shortness of breath.',
    'Follow-up visit for hypertension management. Patient reports taking medications as prescribed. No headaches or dizziness. Home BP monitoring shows good control. Denies any side effects from medications.',
    'Patient presents with lower back pain for 2 weeks. Describes pain as dull ache, 5/10 severity. Pain worsens with prolonged sitting. No radiation to legs. No numbness or tingling. No history of trauma.',
    'Routine check-up for diabetes management. Patient reports good compliance with diet and exercise. Home glucose monitoring shows fasting levels 100-120 mg/dL. No episodes of hypoglycemia. No visual changes or foot problems.',
  ],
  objective: [
    'Vitals: BP 120/80, HR 72, RR 16, Temp 36.5°C, SpO2 98% RA. General: Alert, oriented, no acute distress. HEENT: Normocephalic, PERRL, EOMI. Neck: Supple, no JVD, no thyromegaly. Lungs: CTA bilaterally, no wheezes or crackles. Heart: RSM, no murmurs. Abdomen: Soft, NTND, BS present. Extremities: No edema, pulses 2+.',
    'Vitals: BP 135/85, HR 88, RR 18, Temp 37.8°C, SpO2 97% RA. General: Appears tired but cooperative. HEENT: Oropharynx mildly erythematous, no exudates. Neck: Mild anterior cervical lymphadenopathy. Lungs: Scattered rhonchi bilaterally, no consolidation. Heart: Tachycardic, regular rhythm. Abdomen: Soft, non-tender.',
    'Vitals: BP 138/88, HR 76, RR 16, Temp 36.6°C, SpO2 99% RA. BMI: 24.5. General: Well-developed, well-nourished. Cardiovascular: RSM, no murmurs, rubs, or gallops. Respiratory: CTA bilaterally. Neurological: CN II-XII grossly intact. Motor: 5/5 strength all extremities. Sensory: Intact to light touch.',
    'Vitals: BP 125/78, HR 68, RR 14, Temp 36.4°C, SpO2 98% RA. General: Comfortable, no acute distress. Spine: Tenderness to palpation L4-L5 paraspinal muscles. No step-off. ROM limited by pain. Straight leg raise: Negative bilaterally. Motor: 5/5 lower extremities. Sensory: Intact L2-S1 dermatomes.',
    'Vitals: BP 130/82, HR 74, RR 16, Temp 36.7°C, SpO2 98% RA. BMI: 26.2. General: Well-appearing. Eyes: PERRL, EOMI, fundi without retinopathy. Feet: Warm, pulses 2+, monofilament sensation intact. Skin: No ulcers or lesions. Cardiovascular: RSM, no murmurs.',
  ],
  assessment: [
    '1. Upper respiratory infection, viral\n2. Acute bronchitis\nPatient is stable and responding well to symptomatic treatment.',
    '1. Essential hypertension, well-controlled\n2. Hyperlipidemia\nPatient demonstrates good medication compliance and lifestyle modifications.',
    '1. Type 2 diabetes mellitus, well-controlled\n2. Prediabetes (resolved)\nExcellent glycemic control with current regimen.',
    '1. Acute low back pain, likely musculoskeletal\n2. Lumbar strain\nNo red flags for serious pathology.',
    '1. Routine health maintenance\n2. Health supervision\nAll screening tests within normal limits.',
  ],
  plan: [
    '1. Continue current medications as prescribed\n2. Increase fluid intake (8-10 glasses water/day)\n3. Rest as needed\n4. Return to clinic if symptoms worsen or fever >38.5°C\n5. Follow-up in 7 days or as needed',
    '1. Lisinopril 10mg PO daily (continue)\n2. Atorvastatin 20mg PO nightly (continue)\n3. Low-sodium diet (<2g/day)\n4. Home BP monitoring BID, log results\n5. Exercise: 30 min walk 5x/week\n6. Follow-up in 3 months with labs',
    '1. Metformin 1000mg PO BID (continue)\n2. HbA1c monitoring q3months\n3. Diabetic diet (1800 cal/day)\n4. Daily foot inspection\n5. Annual dilated eye exam\n6. Follow-up in 3 months',
    '1. Ibuprofen 400mg PO TID PRN pain (5 days)\n2. Cyclobenzaprine 5mg PO HS PRN muscle spasm\n3. Heat therapy to lower back 20min TID\n4. Avoid heavy lifting (>10kg)\n5. Gentle stretching exercises\n6. Follow-up in 2 weeks if no improvement',
    '1. Continue current health maintenance regimen\n2. Age-appropriate cancer screening up to date\n3. Immunizations: Td booster due in 2 years\n4. Lifestyle: Continue diet and exercise\n5. Follow-up in 1 year for annual physical',
  ],
};

const CARE_PLANS = {
  medications: [
    { name: 'Paracetamol 500mg', dosage: '1 tablet PO q6h PRN pain/fever', duration: '5 days' },
    { name: 'Dextromethorphan 15mg', dosage: '10ml PO q8h PRN cough', duration: '7 days' },
    { name: 'Lisinopril 10mg', dosage: '1 tablet PO daily', duration: 'Continue' },
    { name: 'Metformin 500mg', dosage: '1 tablet PO BID with meals', duration: 'Continue' },
    { name: 'Atorvastatin 20mg', dosage: '1 tablet PO nightly', duration: 'Continue' },
  ],
  followUp: [
    'Return to clinic in 7 days for re-evaluation',
    'Follow-up in 3 months with updated lab results',
    'Schedule annual physical examination',
    'Return immediately if symptoms worsen',
    'Telemedicine follow-up available if needed',
  ],
  lifestyle: [
    'Increase fluid intake to 8-10 glasses of water daily',
    'Follow low-sodium diet (<2g sodium/day)',
    'Engage in moderate exercise 30 minutes, 5 days/week',
    'Maintain healthy diet rich in vegetables and fruits',
    'Avoid smoking and limit alcohol consumption',
    'Practice stress management techniques',
    'Ensure 7-8 hours of quality sleep nightly',
  ],
  education: [
    'Monitor symptoms daily and keep a symptom diary',
    'Check blood pressure at home twice daily, record readings',
    'Monitor blood glucose as instructed (fasting and 2hr post-prandial)',
    'Recognize warning signs: fever >38.5°C, severe pain, difficulty breathing',
    'Take medications exactly as prescribed, do not skip doses',
    'Attend all scheduled follow-up appointments',
  ],
};

/**
 * Generate a random item from array
 */
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate random date within last 7 days
 */
function randomDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const past = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  past.setHours(now.getHours() - hoursAgo);
  past.setMinutes(now.getMinutes() - minutesAgo);
  
  return past.toISOString();
}

/**
 * Generate mock session
 */
export function generateMockSession(index) {
  const hasNote = Math.random() > 0.3; // 70% have notes
  
  return {
    id: `session-${String(index + 1).padStart(3, '0')}`,
    patient_name: PATIENT_NAMES[index % PATIENT_NAMES.length],
    patient_hn: HOSPITAL_NUMBERS[index % HOSPITAL_NUMBERS.length],
    template_type: 'soap',
    transcript: randomChoice(SOAP_TEMPLATES.subjective),
    status: hasNote ? 'noted' : 'recording',
    created_at: randomDate(),
    notes: hasNote ? [{
      id: `note-${String(index + 1).padStart(3, '0')}`,
      template_type: 'soap',
      is_final: Math.random() > 0.5,
      created_at: randomDate(),
    }] : [],
  };
}

/**
 * Generate mock note with full SOAP content
 */
export function generateMockNote(index) {
  const sessionId = `session-${String(index + 1).padStart(3, '0')}`;
  
  return {
    id: `note-${String(index + 1).padStart(3, '0')}`,
    session_id: sessionId,
    patient_name: PATIENT_NAMES[index % PATIENT_NAMES.length],
    patient_hn: HOSPITAL_NUMBERS[index % HOSPITAL_NUMBERS.length],
    template_type: 'soap',
    content: {
      subjective: randomChoice(SOAP_TEMPLATES.subjective),
      objective: randomChoice(SOAP_TEMPLATES.objective),
      assessment: randomChoice(SOAP_TEMPLATES.assessment),
      plan: randomChoice(SOAP_TEMPLATES.plan),
    },
    content_text: '',
    is_final: Math.random() > 0.3,
    finalized_at: Math.random() > 0.3 ? randomDate() : null,
    created_at: randomDate(),
    updated_at: randomDate(),
  };
}

/**
 * Generate mock care plan
 */
export function generateMockCarePlan(noteId) {
  return {
    id: `careplan-${noteId}`,
    note_id: noteId,
    medications: CARE_PLANS.medications.slice(0, Math.floor(Math.random() * 3) + 2),
    follow_up: randomChoice(CARE_PLANS.followUp),
    lifestyle_recommendations: CARE_PLANS.lifestyle.slice(0, Math.floor(Math.random() * 3) + 2),
    patient_education: CARE_PLANS.education.slice(0, Math.floor(Math.random() * 3) + 2),
    created_at: new Date().toISOString(),
  };
}

/**
 * Generate mock handover summary
 */
export function generateMockHandover() {
  const patientCount = Math.floor(Math.random() * 8) + 5;
  const urgentCount = Math.floor(Math.random() * 3);
  
  return {
    id: 'handover-' + Date.now(),
    shift_label: `Day Shift · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
    clinician: 'Dr. Somchai',
    patient_count: patientCount,
    urgent_count: urgentCount,
    avg_encounter_min: Math.floor(Math.random() * 10) + 8,
    patients: PATIENT_NAMES.slice(0, patientCount).map((name, i) => ({
      name: name,
      summary: randomChoice(SOAP_TEMPLATES.assessment).split('\n')[0],
      urgent: i < urgentCount,
    })),
  };
}

/**
 * Generate all mock data
 */
export function generateAllMockData() {
  const sessions = [];
  const notes = [];
  
  // Generate 10 sessions
  for (let i = 0; i < 10; i++) {
    sessions.push(generateMockSession(i));
    
    // Generate note if session has one
    if (sessions[i].notes.length > 0) {
      notes.push(generateMockNote(i));
    }
  }
  
  return {
    sessions,
    notes,
    handover: generateMockHandover(),
  };
}

/**
 * Get mock care plan for a note
 */
export function getMockCarePlanForNote(note) {
  return generateMockCarePlan(note.id);
}

export default {
  generateAllMockData,
  generateMockSession,
  generateMockNote,
  generateMockCarePlan,
  generateMockHandover,
  getMockCarePlanForNote,
};
