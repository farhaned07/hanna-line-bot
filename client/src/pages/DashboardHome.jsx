import { Link, useNavigate } from 'react-router-dom';
import {
    useNurseStats,
    useNurseTasks,
    useAILog,
    useRiskSummary
} from '../hooks/useNurseData';
import {
    SkeletonMetrics,
    SkeletonTable
} from '../components/ui/Skeleton';
import {
    CriticalAlertBanner,
    EmptyState
} from '../components/ui/StatusBanners';
import {
    Activity,
    Users,
    CheckCircle,
    AlertTriangle,
    Clock,
    Brain,
    ArrowRight,
    TrendingUp
} from 'lucide-react';

/**
 * Mission Control Dashboard (Default Home)
 * Real-time system health and immediate situational awareness
 */
export default function DashboardHome() {
    const navigate = useNavigate();
    const { stats, loading: statsLoading } = useNurseStats();
    const { tasks, loading: tasksLoading } = useNurseTasks();
    const { logs: aiLogs, loading: aiLoading } = useAILog(10);
    const { summary: riskSummary, loading: riskLoading } = useRiskSummary();

    // Count critical tasks
    const criticalCount = tasks?.filter(t => t.priority === 'critical').length || 0;

    return (
        <div className="space-y-6">
            {/* Critical Alert Banner */}
            <CriticalAlertBanner
                count={criticalCount}
                onViewQueue={() => navigate('/dashboard/monitoring')}
            />

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Mission Control</h1>
                <p className="text-slate-400 text-sm mt-1">
                    Real-time overview of patient care operations
                </p>
            </div>

            {/* Primary Metrics Row */}
            {statsLoading ? (
                <SkeletonMetrics count={4} />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        label="Active Patients"
                        value={stats?.activePatients || 0}
                        icon={Users}
                        color="blue"
                        trend={`+3 this week`}
                        onClick={() => navigate('/dashboard/patients')}
                    />
                    <MetricCard
                        label="Pending Actions"
                        value={stats?.redFlags || 0}
                        icon={AlertTriangle}
                        color={stats?.redFlags > 0 ? 'amber' : 'slate'}
                        highlight={stats?.redFlags > 0}
                        onClick={() => navigate('/dashboard/monitoring')}
                    />
                    <MetricCard
                        label="Resolved Today"
                        value={stats?.todayResolutions || 0}
                        icon={CheckCircle}
                        color="green"
                        trend={`${stats?.todayCheckins || 0} check-ins`}
                    />
                    <MetricCard
                        label="Check-ins Today"
                        value={stats?.todayCheckins || 0}
                        icon={Activity}
                        color="purple"
                    />
                </div>
            )}

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column: Triage Queue Preview */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Triage Queue Preview */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700">
                        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-400" />
                                Triage Queue
                            </h2>
                            <Link
                                to="/dashboard/monitoring"
                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                                View Full Queue <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {tasksLoading ? (
                            <SkeletonTable rows={3} />
                        ) : tasks?.length === 0 ? (
                            <div className="p-6">
                                <EmptyState
                                    title="All Clear"
                                    description="No pending actions. All patients stable."
                                    actionLabel="View Patients"
                                    onAction={() => navigate('/dashboard/patients')}
                                />
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-700">
                                {tasks?.slice(0, 5).map(task => (
                                    <TaskRow key={task.id} task={task} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent AI Decisions */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700">
                        <div className="px-6 py-4 border-b border-slate-700">
                            <h2 className="text-lg font-medium text-white flex items-center gap-2">
                                <Brain className="w-5 h-5 text-blue-400" />
                                Recent AI Decisions
                            </h2>
                        </div>

                        {aiLoading ? (
                            <div className="p-4">
                                <SkeletonTable rows={3} />
                            </div>
                        ) : aiLogs?.length === 0 ? (
                            <div className="p-6 text-center text-slate-500">
                                No AI decisions recorded yet
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-700 max-h-64 overflow-y-auto">
                                {aiLogs?.map((log, i) => (
                                    <AILogRow key={i} log={log} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Risk Distribution */}
                <div className="space-y-6">
                    {/* Risk Distribution */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                            Risk Distribution
                        </h2>

                        {riskLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-4 bg-slate-700 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : riskSummary ? (
                            <div className="space-y-4">
                                <RiskBar
                                    label="Critical"
                                    count={riskSummary.critical}
                                    total={riskSummary.total}
                                    color="red"
                                />
                                <RiskBar
                                    label="High"
                                    count={riskSummary.high}
                                    total={riskSummary.total}
                                    color="amber"
                                />
                                <RiskBar
                                    label="Medium"
                                    count={riskSummary.medium}
                                    total={riskSummary.total}
                                    color="blue"
                                />
                                <RiskBar
                                    label="Low"
                                    count={riskSummary.low}
                                    total={riskSummary.total}
                                    color="green"
                                />
                            </div>
                        ) : null}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <Link
                                to="/dashboard/monitoring"
                                className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg transition-colors"
                            >
                                View Monitoring Grid
                            </Link>
                            <Link
                                to="/dashboard/patients"
                                className="block w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 text-center font-medium rounded-lg transition-colors"
                            >
                                Browse All Patients
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// Sub-Components
// ============================================================

function MetricCard({ label, value, icon: Icon, color, trend, highlight, onClick }) {
    const colorClasses = {
        blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400' },
        green: { bg: 'bg-green-500/20', text: 'text-green-400', icon: 'text-green-400' },
        amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: 'text-amber-400' },
        red: { bg: 'bg-red-500/20', text: 'text-red-400', icon: 'text-red-400' },
        purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: 'text-purple-400' },
        slate: { bg: 'bg-slate-700', text: 'text-slate-400', icon: 'text-slate-400' }
    }[color] || { bg: 'bg-slate-700', text: 'text-slate-400', icon: 'text-slate-400' };

    return (
        <div
            onClick={onClick}
            className={`
                bg-slate-800 rounded-xl border p-5 cursor-pointer transition-all hover:scale-[1.02]
                ${highlight ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-slate-700'}
            `}
        >
            <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm font-medium">{label}</p>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses.bg}`}>
                    <Icon className={`w-5 h-5 ${colorClasses.icon}`} />
                </div>
            </div>
            <p className={`text-3xl font-bold mt-2 ${highlight ? colorClasses.text : 'text-white'}`}>
                {value}
            </p>
            {trend && (
                <p className="text-slate-500 text-xs mt-1">{trend}</p>
            )}
        </div>
    );
}

function TaskRow({ task }) {
    const priorityStyles = {
        critical: 'bg-red-500 text-white',
        high: 'bg-amber-500 text-white',
        normal: 'bg-blue-500 text-white',
        low: 'bg-slate-500 text-white'
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <Link
            to={task.patient_id ? `/dashboard/patients/${task.patient_id}` : '#'}
            className="flex items-center gap-4 px-6 py-4 hover:bg-slate-700/50 transition-colors"
        >
            <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${priorityStyles[task.priority] || priorityStyles.normal}`}>
                {task.priority}
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                    {task.chronic_patients?.name || task.patient_name || 'Unknown Patient'}
                </p>
                <p className="text-slate-400 text-sm truncate">
                    {task.reason || task.task_type}
                </p>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                {timeAgo(task.created_at)}
            </div>
        </Link>
    );
}

function AILogRow({ log }) {
    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    };

    const actionLabels = {
        'CALCULATE_RISK': '🧠 Risk',
        'CREATE_TASK': '📋 Task',
        'AUTO_RESOLVE': '✅ Auto'
    };

    return (
        <div className="px-6 py-3 flex items-center gap-3 ai-generated">
            <span className="text-slate-500 text-sm w-8">{timeAgo(log.timestamp)}</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                {actionLabels[log.action] || log.action}
            </span>
            <span className="text-slate-300 text-sm truncate flex-1">
                {log.patientName || 'System'}
            </span>
            {log.details?.score !== undefined && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${log.details.score >= 7 ? 'bg-red-500/20 text-red-400' :
                        log.details.score >= 4 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-green-500/20 text-green-400'
                    }`}>
                    {log.details.score}/10
                </span>
            )}
        </div>
    );
}

function RiskBar({ label, count, total, color }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    const colorClasses = {
        red: 'bg-red-500',
        amber: 'bg-amber-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500'
    }[color] || 'bg-slate-500';

    const textClasses = {
        red: 'text-red-400',
        amber: 'text-amber-400',
        blue: 'text-blue-400',
        green: 'text-green-400'
    }[color] || 'text-slate-400';

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className={textClasses}>{label}</span>
                <span className="text-slate-400">{count}</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${colorClasses}`}
                    style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                />
            </div>
        </div>
    );
}
