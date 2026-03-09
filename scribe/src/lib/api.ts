import type {
  ApiResponse,
  AuthResponse,
  Session,
  SessionTemplate,
  Note,
  SOAPSection,
  Handover,
  Subscription,
  UsageStats,
  TranscribeResponse,
  GenerateNoteResponse,
} from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'https://hanna-line-bot-production.up.railway.app'

class ApiClient {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('scribe_token')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('scribe_token', token)
    } else {
      localStorage.removeItem('scribe_token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${API_BASE}/api/scribe${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'Request failed',
        }
      }

      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // Auth endpoints
  async login(email: string, pin: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, pin }),
    })
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async register(data: {
    email: string
    name: string
    pin: string
    hospital?: string
    specialty?: string
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async verifyToken(): Promise<ApiResponse<{ user: AuthResponse['user'] }>> {
    return this.request('/auth/verify')
  }

  logout() {
    this.setToken(null)
  }

  // Session endpoints
  async createSession(data: {
    patient_name: string
    patient_hn?: string
    template: SessionTemplate
  }): Promise<ApiResponse<Session>> {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSessions(): Promise<ApiResponse<Session[]>> {
    return this.request('/sessions')
  }

  async getSession(id: string): Promise<ApiResponse<Session>> {
    return this.request(`/sessions/${id}`)
  }

  async deleteSession(id: string): Promise<ApiResponse<void>> {
    return this.request(`/sessions/${id}`, {
      method: 'DELETE',
    })
  }

  // Transcription
  async transcribe(
    sessionId: string,
    audioBlob: Blob
  ): Promise<ApiResponse<TranscribeResponse>> {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    formData.append('session_id', sessionId)

    const headers: HeadersInit = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${API_BASE}/api/scribe/transcribe`, {
        method: 'POST',
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Transcription failed',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // Note generation
  async generateNote(sessionId: string): Promise<ApiResponse<GenerateNoteResponse>> {
    return this.request(`/sessions/${sessionId}/generate-note`, {
      method: 'POST',
    })
  }

  // Note endpoints
  async getNotes(): Promise<ApiResponse<Note[]>> {
    return this.request('/notes')
  }

  async getNote(id: string): Promise<ApiResponse<Note>> {
    return this.request(`/notes/${id}`)
  }

  async updateNote(
    id: string,
    data: Partial<Pick<Note, 'subjective' | 'objective' | 'assessment' | 'plan'>>
  ): Promise<ApiResponse<Note>> {
    return this.request(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async finalizeNote(id: string): Promise<ApiResponse<Note>> {
    return this.request(`/notes/${id}/finalize`, {
      method: 'POST',
    })
  }

  async regenerateSection(
    noteId: string,
    section: SOAPSection,
    instruction?: string
  ): Promise<ApiResponse<{ content: string }>> {
    return this.request(`/notes/${noteId}/regenerate-section`, {
      method: 'POST',
      body: JSON.stringify({ section, instruction }),
    })
  }

  async aiCommand(
    noteId: string,
    command: string
  ): Promise<ApiResponse<Note>> {
    return this.request(`/notes/${noteId}/ai-command`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    })
  }

  async exportNotePdf(noteId: string): Promise<Blob | null> {
    const headers: HeadersInit = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${API_BASE}/api/scribe/notes/${noteId}/pdf`, {
        headers,
      })

      if (!response.ok) {
        return null
      }

      return response.blob()
    } catch {
      return null
    }
  }

  // Handover endpoints
  async generateHandover(data: {
    shift_start: string
    shift_end: string
  }): Promise<ApiResponse<Handover>> {
    return this.request('/handover/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getHandovers(): Promise<ApiResponse<Handover[]>> {
    return this.request('/handover')
  }

  // Billing endpoints
  async getSubscription(): Promise<ApiResponse<Subscription>> {
    return this.request('/billing/subscription')
  }

  async getUsageStats(): Promise<ApiResponse<UsageStats>> {
    return this.request('/billing/usage')
  }

  async createCheckoutSession(plan: 'pro' | 'enterprise'): Promise<ApiResponse<{ url: string }>> {
    return this.request('/billing/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    })
  }

  async createPortalSession(): Promise<ApiResponse<{ url: string }>> {
    return this.request('/billing/create-portal-session', {
      method: 'POST',
    })
  }
}

export const api = new ApiClient()
