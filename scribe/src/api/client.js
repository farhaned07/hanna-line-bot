// Use absolute path from root since Vite dev server proxies /api to backend
const API_BASE = '/api/scribe'

/**
 * Make API request with exponential backoff retry logic
 * @param {string} path - API path
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @returns {Promise<any>} Response data
 */
async function request(path, options = {}, maxRetries = 3) {
    const token = localStorage.getItem('scribe_token_enc') || localStorage.getItem('scribe_token')
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    }

    // Don't set Content-Type for FormData (let browser set boundary)
    if (options.body instanceof FormData) {
        delete headers['Content-Type']
    }

    let lastError = null
    let delay = 1000 // Start with 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

            if (res.status === 401) {
                throw new Error('Unauthorized')
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: 'Request failed' }))
                // Don't retry client errors (4xx)
                if (res.status >= 400 && res.status < 500) {
                    throw new Error(err.error || 'Request failed')
                }
                throw new Error(err.error || `Server error: ${res.status}`)
            }

            return res.json()
        } catch (err) {
            lastError = err
            
            // Don't retry auth errors or client errors
            if (err.message === 'Unauthorized' || err.message.includes('400')) {
                throw err
            }

            // If this was the last attempt, throw the error
            if (attempt === maxRetries) {
                throw new Error(`Request failed after ${maxRetries} attempts: ${lastError.message}`)
            }

            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, delay))
            delay *= 2 // Double the delay for next attempt
        }
    }

    throw lastError
}

export const api = {
    // Auth
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

    // Billing
    getBillingStatus: () => request('/billing/status'),
    createCheckoutSession: (data) => request('/billing/create-checkout-session', { method: 'POST', body: JSON.stringify(data) }),

    // Follow-up Enrollment
    enrollFollowup: (data) => request('/followup/enroll', { method: 'POST', body: JSON.stringify(data) }),

    // Sessions
    getSessions: () => request('/sessions'),
    getSession: (id) => request(`/sessions/${id}`),
    createSession: (data) => request('/sessions', { method: 'POST', body: JSON.stringify(data) }),
    updateSession: (id, data) => request(`/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteSession: (id) => request(`/sessions/${id}`, { method: 'DELETE' }),

    // Transcription
    transcribe: (audioBlob) => {
        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.webm')
        return request('/transcribe', { method: 'POST', body: formData })
    },

    // Notes
    getNotes: () => request('/notes'),
    getNote: (id) => request(`/notes/${id}`),
    generateNote: (sessionId, templateType) =>
        request(`/sessions/${sessionId}/generate-note`, {
            method: 'POST',
            body: JSON.stringify({ templateType })
        }),
    updateNote: (id, data) => request(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    finalizeNote: (id) => request(`/notes/${id}/finalize`, { method: 'POST' }),

    // AI Features
    regenerateSection: (noteId, section, instruction) =>
        request(`/notes/${noteId}/regenerate-section`, {
            method: 'POST',
            body: JSON.stringify({ section, instruction })
        }),

    hannaCommand: (noteId, command, currentContent) =>
        request(`/notes/${noteId}/hanna-command`, {
            method: 'POST',
            body: JSON.stringify({ command, currentContent })
        }),

    // Handover
    generateHandover: () => request('/generate-handover', { method: 'POST' }),

    // Templates
    getTemplates: () => request('/templates'),

    // Export
    exportNote: (noteId, format = 'text') => request(`/export/${noteId}?format=${format}`),

    downloadPdf: (noteId) => {
        // Direct download via window.open since it's a GET request streaming a file
        window.open(`${API_BASE}/export/${noteId}?format=pdf`, '_blank')
    },

    downloadHandoverPdf: async (handoverData) => {
        // POST to generate PDF
        const token = localStorage.getItem('scribe_token')
        const res = await fetch(`${API_BASE}/export/handover?format=pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            },
            body: JSON.stringify(handoverData)
        })

        if (!res.ok) throw new Error('Download failed')

        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `handover-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
}
