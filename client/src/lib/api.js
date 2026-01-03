import axios from 'axios';

// Use VITE_API_URL or default to relative path (proxy) if not set
// In dev, Vite proxy handles /api -> localhost:3000/api
// In prod, this should point to the backend URL
const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add the Nurse Token
api.interceptors.request.use((config) => {
    // 1. Check LocalStorage (Dynamic Login)
    const storedToken = localStorage.getItem('nurse_token');
    // 2. Fallback to Env Var (Legacy/Dev)
    const envToken = import.meta.env.VITE_NURSE_TOKEN;

    const token = storedToken || envToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for global error handling
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Unauthorized access to Nurse API. Check VITE_NURSE_TOKEN.");
    }
    return Promise.reject(error);
});

export default api;
