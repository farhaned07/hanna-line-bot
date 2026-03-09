/**
 * Hanna Scribe API Client
 * Communicates with backend at /api/scribe/*
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Demo mode - no authentication required
const DEMO_TOKEN = 'demo-token';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('scribe_token') || DEMO_TOKEN;

// Basic API client
export const api = {
    /**
     * Generic request handler
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const token = getToken();

        const headers = {
            ...options.headers,
        };

        // Add auth header if token exists
        if (token && token !== 'null' && token !== 'undefined') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Add Content-Type if not already set and no body
        if (!headers['Content-Type'] && !options.body) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle non-JSON responses (PDF exports, etc.)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/pdf')) {
                return await response.blob();
            }

            // Parse JSON
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `API Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`[API] ${options.method || 'GET'} ${endpoint}:`, error.message);
            throw error;
        }
    },

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    /**
     * POST request with JSON body
     */
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });
    },

    /**
     * PUT request with JSON body
     */
    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });
    },

    /**
     * PATCH request with JSON body
     */
    async patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });
    },

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    /**
     * Upload file (multipart/form-data)
     */
    async upload(endpoint, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('audio', file);
        
        // Add additional fields
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const token = getToken();
        const url = `${API_BASE}${endpoint}`;

        const headers = {};
        if (token && token !== 'null' && token !== 'undefined') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Upload failed: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`[API] UPLOAD ${endpoint}:`, error.message);
            throw error;
        }
    },
};

/**
 * Auth API (Demo mode - auto-login)
 */
export const authApi = {
    async login(email) {
        const user = {
            id: 'demo-user',
            email: email || 'demo@hanna.care',
            display_name: 'Demo Clinician',
            role: 'clinician',
        };
        localStorage.setItem('scribe_token', DEMO_TOKEN);
        localStorage.setItem('scribe_user', JSON.stringify(user));
        return { token: DEMO_TOKEN, user };
    },

    async register(email, displayName) {
        return this.login(email);
    },

    logout() {
        localStorage.removeItem('scribe_token');
        localStorage.removeItem('scribe_user');
    },

    isAuthenticated() {
        return true; // Always authenticated in demo mode
    },

    getUser() {
        const userStr = localStorage.getItem('scribe_user');
        return userStr ? JSON.parse(userStr) : { display_name: 'Demo Clinician', email: 'demo@hanna.care' };
    },
};

/**
 * Sessions API
 */
export const sessionsApi = {
    async create(patientName, patientHn, templateType = 'soap') {
        return api.post('/api/scribe/sessions', {
            patient_name: patientName,
            patient_hn: patientHn,
            template_type: templateType,
        });
    },

    async list() {
        return api.get('/api/scribe/sessions');
    },

    async get(sessionId) {
        return api.get(`/api/scribe/sessions/${sessionId}`);
    },

    async update(sessionId, data) {
        return api.patch(`/api/scribe/sessions/${sessionId}`, data);
    },

    async delete(sessionId) {
        return api.delete(`/api/scribe/sessions/${sessionId}`);
    },
};

/**
 * Notes API
 */
export const notesApi = {
    async list() {
        return api.get('/api/scribe/notes');
    },

    async get(noteId) {
        return api.get(`/api/scribe/notes/${noteId}`);
    },

    async update(noteId, content) {
        return api.patch(`/api/scribe/notes/${noteId}`, { content });
    },

    async finalize(noteId) {
        return api.post(`/api/scribe/notes/${noteId}/finalize`);
    },

    async regenerateSection(noteId, section, instruction = '') {
        return api.post(`/api/scribe/notes/${noteId}/regenerate-section`, {
            section,
            instruction,
        });
    },

    async hannaCommand(noteId, command, currentContent) {
        return api.post(`/api/scribe/notes/${noteId}/hanna-command`, {
            command,
            currentContent,
        });
    },

    async generateNote(sessionId, templateType) {
        return api.post(`/api/scribe/sessions/${sessionId}/generate-note`, {
            templateType,
        });
    },
};

/**
 * Transcription API
 */
export const transcriptionApi = {
    async transcribe(audioFile) {
        return api.upload('/api/scribe/transcribe', audioFile);
    },

    async getDebug() {
        return api.get('/api/scribe/transcription/debug');
    },
};

/**
 * Export API
 */
export const exportApi = {
    async pdf(noteId) {
        return api.get(`/api/scribe/export/${noteId}?format=pdf`);
    },
};

/**
 * Billing API
 */
export const billingApi = {
    async getStatus() {
        return api.get('/api/scribe/billing/status');
    },

    async createCheckoutSession(successUrl, cancelUrl, planType = 'pro') {
        return api.post('/api/scribe/billing/create-checkout-session', {
            success_url: successUrl,
            cancel_url: cancelUrl,
            planType,
        });
    },
};

/**
 * Handover API
 */
export const handoverApi = {
    async generate() {
        return api.post('/api/scribe/generate-handover');
    },
};

export default api;
