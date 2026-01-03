import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

// ============================================================
// ORIGINAL HOOKS (Restored from mock to real API calls)
// ============================================================

/**
 * Hook to fetch Mission Control Stats
 */
export const useNurseStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/nurse/stats');
            setStats(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch stats", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    return { stats, loading, error, refresh: fetchStats };
};

/**
 * Hook to fetch the Triage Queue (Tasks)
 */
export const useNurseTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/nurse/tasks');
            setTasks(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 15000);
        return () => clearInterval(interval);
    }, [fetchTasks]);

    return { tasks, loading, error, refresh: fetchTasks };
};

/**
 * Hook to fetch Patient Roster
 * Falls back to mock data if API fails (DEV MODE ONLY)
 */
const MOCK_PATIENTS = [
    { id: 'mock-001', name: 'สมชาย ใจดี', age: 58, condition: 'Type 2 Diabetes', enrollment_status: 'active', phone_number: '081-234-5678', created_at: '2025-10-01' },
    { id: 'mock-002', name: 'มานี มีทรัพย์', age: 62, condition: 'Hypertension', enrollment_status: 'active', phone_number: '089-876-5432', created_at: '2025-11-15' },
    { id: 'mock-003', name: 'สมศรี สุขใจ', age: 45, condition: 'Type 2 Diabetes, CKD Stage 2', enrollment_status: 'active', phone_number: '086-111-2222', created_at: '2025-09-20' },
    { id: 'mock-004', name: 'ประยุทธ ชาญกิจ', age: 71, condition: 'Heart Failure', enrollment_status: 'active', phone_number: '081-333-4444', created_at: '2025-12-01' },
    { id: 'mock-005', name: 'วิภา แสงดี', age: 55, condition: 'Type 2 Diabetes', enrollment_status: 'trial', phone_number: '089-555-6666', created_at: '2025-12-20' },
];

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPatients = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/nurse/patients');
            setPatients(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch patients", err);
            // Only use mock data in development mode
            if (import.meta.env.DEV) {
                console.warn("[DEV] Using mock patient data");
                setPatients(MOCK_PATIENTS);
                setError(null);
            } else {
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    return { patients, loading, error, refresh: fetchPatients };
};

/**
 * Hook for Single Patient Detail
 * Falls back to mock data if API fails (DEV MODE ONLY)
 */
export const usePatientDetail = (id) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/nurse/patients/${id}`);
                setPatient(res.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch patient detail", err);
                // Only use mock data in development mode
                if (import.meta.env.DEV) {
                    console.warn("[DEV] Using mock patient detail data");
                    const mockPatient = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];
                    setPatient({
                        ...mockPatient,
                        history: [
                            { id: 1, check_in_time: new Date().toISOString(), glucose_level: 125, medication_taken: true, symptoms: 'none' },
                            { id: 2, check_in_time: new Date(Date.now() - 86400000).toISOString(), glucose_level: 132, medication_taken: true, symptoms: 'mild fatigue' },
                            { id: 3, check_in_time: new Date(Date.now() - 172800000).toISOString(), glucose_level: 145, medication_taken: false, symptoms: 'none' },
                        ],
                        tasks: [
                            { id: 1, task_type: 'follow_up', priority: 'normal', reason: 'Routine check-in', status: 'completed', created_at: new Date().toISOString() },
                            { id: 2, task_type: 'medication_review', priority: 'high', reason: 'Missed dose detected', status: 'pending', created_at: new Date().toISOString() },
                        ]
                    });
                    setError(null);
                } else {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    return { patient, loading, error };
};

/**
 * Action: Resolve Task
 */
export const useTaskActions = () => {
    const [processing, setProcessing] = useState(false);

    const resolveTask = async (taskId, notes, actionType = 'resolve') => {
        setProcessing(true);
        try {
            await api.post(`/api/nurse/tasks/${taskId}/resolve`, {
                nurseId: 'current-nurse',
                notes,
                actionType
            });
            return true;
        } catch (error) {
            console.error("Failed to resolve task", error);
            return false;
        } finally {
            setProcessing(false);
        }
    };

    return { resolveTask, processing };
};

// ============================================================
// NEW HOOKS FOR CONTINUOUS MONITORING VIEW (Phase 4)
// ============================================================

/**
 * Hook to fetch Monitoring Status (Patient Grid)
 */
export const useMonitoringStatus = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/nurse/monitoring-status');
            setData(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch monitoring status", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // 15s refresh
        return () => clearInterval(interval);
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData };
};

/**
 * Hook to fetch Infrastructure Health
 */
export const useInfrastructureHealth = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/nurse/infrastructure-health');
            setData(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch infrastructure health", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // 60s refresh
        return () => clearInterval(interval);
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData };
};

/**
 * Hook to fetch AI Decision Log
 */
export const useAILog = (limit = 20) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/nurse/ai-log?limit=${limit}`);
            setLogs(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch AI log", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return { logs, loading, error, refresh: fetchData };
};

/**
 * Hook to fetch Risk Summary
 */
export const useRiskSummary = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/nurse/risk-summary');
            setSummary(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch risk summary", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return { summary, loading, error, refresh: fetchData };
};

/**
 * Hook to fetch Agent Metrics (Revenue, Replies, Health)
 */
export const useAgentMetrics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/agents/metrics');
            setData(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch agent metrics", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // 60s refresh
        return () => clearInterval(interval);
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData };
};
