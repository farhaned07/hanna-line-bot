const API_BASE = '/api/scribe'

async function request(path, options = {}) {
    const token = localStorage.getItem('scribe_token')
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    }

    // Don't set Content-Type for FormData (let browser set boundary)
    if (options.body instanceof FormData) {
        delete headers['Content-Type']
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

    if (res.status === 401) {
        throw new Error('Unauthorized')
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Request failed')
    }

    return res.json()
}

export const api = {
    // Auth
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

    // Billing
    getBillingStatus: () => request('/billing/status'),
    createCheckoutSession: (data) => request('/billing/create-checkout-session', { method: 'POST', body: JSON.stringify(data) }),

    // Sessions
    getSessions: () => request('/sessions'),
    getSession: (id) => request(`/sessions/${id}`),
    createSession: (data) => request('/sessions', { method: 'POST', body: JSON.stringify(data) }),
    updateSession: (id, data) => request(`/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

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
