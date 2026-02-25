import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    useMonitoringStatus,
    useInfrastructureHealth
} from '../hooks/useNurseData';
import {
    SkeletonPatientGrid,
    SkeletonMetrics
} from '../components/ui/Skeleton';
import {
    OfflineBanner,
    EmptyState
} from '../components/ui/StatusBanners';
import {
    Activity,
    Cpu,
    Users,
    Shield,
    TrendingUp,
    Clock,
    RefreshCw,
    Eye
} from 'lucide-react';

/**
 * Continuous Monitoring View (Layer 1)
 * Visual proof that all patients are being actively monitored.
 * Shows: Summary stats, Patient grid, Infrastructure metrics
 */
export default function MonitoringView() {
    const { data: monitoringData, loading: monitoringLoading, error: monitoringError, refresh: refreshMonitoring } = useMonitoringStatus();
    const { data: infraData, loading: infraLoading, error: infraError } = useInfrastructureHealth();
    const [hoveredPatient, setHoveredPatient] = useState(null);

    const isLoading = monitoringLoading || infraLoading;
    const hasError = monitoringError || infraError;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                        <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                        Patient Monitoring — Live
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Real-time view of all monitored patients
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs sm:text-sm">
                        Last update: {monitoringData?.lastUpdated
                            ? new Date(monitoringData.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            : '--:--:--'}
                    </span>
                    <button
                        onClick={refreshMonitoring}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm shrink-0"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {hasError && (
                <OfflineBanner
                    lastUpdate={monitoringData?.lastUpdated}
                    onRetry={refreshMonitoring}
                />
            )}

            {/* Summary Bar */}
            {isLoading ? (
                <SkeletonMetrics count={4} />
            ) : monitoringData?.summary ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <SummaryCard
                        label="Total Monitored"
                        value={monitoringData.summary.total}
                        icon={Users}
                        color="blue"
                    />
                    <SummaryCard
                        label="Stable"
                        value={monitoringData.summary.stable}
                        icon={Shield}
                        color="green"
                        subtext={`${Math.round((monitoringData.summary.stable / monitoringData.summary.total) * 100)}%`}
                    />
                    <SummaryCard
                        label="Drifting"
                        value={monitoringData.summary.drifting}
                        icon={TrendingUp}
                        color="amber"
                        highlight={monitoringData.summary.drifting > 0}
                    />
                    <SummaryCard
                        label="Critical"
                        value={monitoringData.summary.critical}
                        icon={Activity}
                        color="red"
                        highlight={monitoringData.summary.critical > 0}
                        pulse={true}
                    />
                </div>
            ) : null}

            {/* Patient Grid */}
            <div className="bg-[#13151A] rounded-2xl border border-white/5 p-4 sm:p-6 mb-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-400" />
                        Patient Grid
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                            Stable
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
                            Drifting
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span>
                            Critical
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full border border-slate-500"></span>
                            Silent
                        </span>
                    </div>
                </div>

                {isLoading ? (
                    <SkeletonPatientGrid count={30} />
                ) : monitoringData?.patients?.length === 0 ? (
                    <EmptyState
                        title="No Patients"
                        description="No active patients are currently being monitored."
                    />
                ) : (
                    <div className="relative">
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-2 sm:gap-3">
                            {monitoringData?.patients?.map(patient => (
                                <PatientDot
                                    key={patient.id}
                                    patient={patient}
                                    onHover={setHoveredPatient}
                                    isHovered={hoveredPatient?.id === patient.id}
                                />
                            ))}
                        </div>

                        {/* Hover Card */}
                        {hoveredPatient && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-20">
                                <PatientHoverCard patient={hoveredPatient} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Infrastructure Panel */}
            {/* Infrastructure Panel */}
            <div className="bg-[#13151A] rounded-2xl border border-white/5 p-6 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                    Infrastructure Status
                </h2>

                {infraLoading ? (
                    <SkeletonMetrics count={4} />
                ) : infraData ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfraCard
                            label="System Uptime"
                            value={`${infraData.uptime.percentage}%`}
                            subtext={`Since ${infraData.uptime.sinceDate}`}
                            barValue={infraData.uptime.percentage}
                            barColor="green"
                        />
                        <InfraCard
                            label="AI Processing"
                            value={infraData.aiProcessing.analysesToday}
                            subtext={`Avg: ${infraData.aiProcessing.avgLatencyMs}ms`}
                        />
                        <InfraCard
                            label="Coverage"
                            value={`${infraData.coverage.monitored}/${infraData.coverage.total}`}
                            subtext={`${infraData.coverage.percentage}% monitored`}
                            barValue={infraData.coverage.percentage}
                            barColor="blue"
                        />
                        <InfraCard
                            label="Crises Prevented"
                            value={infraData.interventions.crisesPrevented}
                            subtext={`${infraData.interventions.actionsToday} actions today`}
                            highlight={infraData.interventions.crisesPrevented > 0}
                        />
                    </div>
                ) : null}

                {/* Nurse Capacity Bar */}
                {infraData?.nurseCapacity && (
                    <div className="mt-6 p-4 bg-[#0B0D12] rounded-xl border border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm mb-3 gap-1">
                            <span className="text-slate-400 font-medium">Nurse Bandwidth</span>
                            <span className="text-slate-300 font-mono text-xs">
                                Active: {infraData.nurseCapacity.activeNurses} |
                                Avg: {infraData.nurseCapacity.avgResponseMinutes}min |
                                Queue: {infraData.nurseCapacity.currentQueueSize}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${infraData.nurseCapacity.capacityPercentage > 80
                                    ? 'bg-rose-500'
                                    : infraData.nurseCapacity.capacityPercentage > 50
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                    }`}
                                style={{ width: `${infraData.nurseCapacity.capacityPercentage}%` }}
                            />
                        </div>
                        <div className="text-right text-xs text-slate-500 mt-1.5 font-medium">
                            {infraData.nurseCapacity.capacityPercentage}% capacity
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================
// Sub-Components
// ============================================================

function SummaryCard({ label, value, icon: Icon, color, subtext, highlight, pulse }) {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        red: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };

    return (
        <div className={`
            bg-[#13151A] rounded-2xl border p-5 relative transition-all hover:-translate-y-1 hover:shadow-lg
            ${highlight ? colorClasses[color] : 'border-white/5'}
        `}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{label}</p>
                    <p className={`text-3xl font-bold mt-2 ${highlight ? `text-${color}-400` : 'text-white'}`}>
                        {value}
                    </p>
                    {subtext && <p className="text-slate-500 text-xs mt-1 font-medium">{subtext}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]?.replace('bg-', 'border-') || 'border-white/5 bg-white/5'}`}>
                    <Icon className={`w-6 h-6 ${pulse ? 'animate-pulse' : ''}`} />
                </div>
            </div>
        </div>
    );
}

function PatientDot({ patient, onHover, isHovered }) {
    const statusColors = {
        stable: 'bg-green-500 hover:bg-green-400',
        drifting: 'bg-amber-500 hover:bg-amber-400',
        critical: 'bg-red-500 hover:bg-red-400 animate-pulse',
        silent: 'bg-transparent border-2 border-slate-500 hover:border-slate-400'
    };

    return (
        <Link
            to={`/dashboard/patients/${patient.id}`}
            className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-xs font-medium text-white
                transition-all cursor-pointer
                ${statusColors[patient.status]}
                ${isHovered ? 'ring-2 ring-white scale-125' : ''}
            `}
            onMouseEnter={() => onHover(patient)}
            onMouseLeave={() => onHover(null)}
            title={patient.name}
        >
            {patient.initials}
        </Link>
    );
}

function PatientHoverCard({ patient }) {
    return (
        <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 shadow-xl min-w-[250px]">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{patient.name}</span>
                <span className={`
                    px-2 py-0.5 rounded text-xs font-medium
                    ${patient.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                        patient.status === 'drifting' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-green-500/20 text-green-400'}
                `}>
                    {patient.status.toUpperCase()}
                </span>
            </div>
            <div className="space-y-1 text-sm">
                <p className="text-slate-400">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Last check-in: {patient.lastCheckIn
                        ? new Date(patient.lastCheckIn).toLocaleString()
                        : 'No data'}
                </p>
                <p className="text-slate-400">{patient.quickVitals}</p>
                <p className="text-slate-400">Risk: {patient.riskScore}/10</p>
            </div>
            <Link
                to={`/dashboard/patients/${patient.id}`}
                className="block mt-3 text-center text-sm text-blue-400 hover:text-blue-300"
            >
                View Profile →
            </Link>
        </div>
    );
}

function InfraCard({ label, value, subtext, barValue, barColor, highlight }) {
    return (
        <div className={`
            bg-slate-900 rounded-lg p-4
            ${highlight ? 'ring-1 ring-green-500/50' : ''}
        `}>
            <p className="text-slate-400 text-sm mb-1">{label}</p>
            <p className={`text-2xl font-bold ${highlight ? 'text-green-400' : 'text-white'}`}>
                {value}
            </p>
            {subtext && <p className="text-slate-500 text-xs">{subtext}</p>}
            {barValue !== undefined && (
                <div className="mt-2 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${barColor === 'green' ? 'bg-green-500' :
                            barColor === 'blue' ? 'bg-blue-500' :
                                'bg-slate-500'
                            }`}
                        style={{ width: `${barValue}%` }}
                    />
                </div>
            )}
        </div>
    );
}
