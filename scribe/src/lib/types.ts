// User types
export interface User {
  id: string
  email: string
  name: string
  hospital?: string
  specialty?: string
  created_at: string
}

// Session types
export interface Session {
  id: string
  user_id: string
  patient_name: string
  patient_hn?: string
  template: SessionTemplate
  status: SessionStatus
  duration_seconds: number
  audio_url?: string
  created_at: string
  updated_at: string
}

export type SessionTemplate = 'general' | 'follow_up' | 'procedure' | 'admission' | 'discharge'
export type SessionStatus = 'recording' | 'processing' | 'completed' | 'failed'

// Note types
export interface Note {
  id: string
  session_id: string
  user_id: string
  patient_name: string
  patient_hn?: string
  template: SessionTemplate
  subjective: string
  objective: string
  assessment: string
  plan: string
  transcript?: string
  status: NoteStatus
  finalized_at?: string
  created_at: string
  updated_at: string
}

export type NoteStatus = 'draft' | 'finalized'

export type SOAPSection = 'subjective' | 'objective' | 'assessment' | 'plan'

// Handover types
export interface Handover {
  id: string
  user_id: string
  shift_start: string
  shift_end: string
  summary: string
  critical_patients: HandoverPatient[]
  pending_tasks: string[]
  created_at: string
}

export interface HandoverPatient {
  name: string
  hn?: string
  condition: string
  priority: 'critical' | 'high' | 'normal'
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface TranscribeResponse {
  transcript: string
  duration_seconds: number
  confidence: number
}

export interface GenerateNoteResponse {
  note: Note
}

// Billing types
export interface Subscription {
  id: string
  status: 'active' | 'past_due' | 'canceled' | 'trialing'
  plan: 'free' | 'pro' | 'enterprise'
  current_period_end: string
  notes_used: number
  notes_limit: number
}

export interface UsageStats {
  notes_this_month: number
  notes_limit: number
  recording_minutes: number
}
