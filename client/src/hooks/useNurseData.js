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
 */
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
            setError(err);
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
            } catch (err) {
                setError(err);
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
