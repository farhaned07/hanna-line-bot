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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Eye className="w-7 h-7 text-blue-400" />
                        Patient Monitoring — Live
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Real-time view of all monitored patients
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-sm">
                        Last update: {monitoringData?.lastUpdated
                            ? new Date(monitoringData.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            : '--:--:--'}
                    </span>
                    <button
                        onClick={refreshMonitoring}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
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
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-white">Patient Grid</h2>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            Stable
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                            Drifting
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                            Critical
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full border-2 border-slate-500"></span>
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
                        <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 lg:grid-cols-20 gap-2">
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
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-10">
                                <PatientHoverCard patient={hoveredPatient} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Infrastructure Panel */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-slate-400" />
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
                    <div className="mt-6 p-4 bg-slate-900 rounded-lg">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-400">Nurse Bandwidth</span>
                            <span className="text-slate-300">
                                Active: {infraData.nurseCapacity.activeNurses} |
                                Avg Response: {infraData.nurseCapacity.avgResponseMinutes} min |
                                Queue: {infraData.nurseCapacity.currentQueueSize} tasks
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${infraData.nurseCapacity.capacityPercentage > 80
                                    ? 'bg-red-500'
                                    : infraData.nurseCapacity.capacityPercentage > 50
                                        ? 'bg-amber-500'
                                        : 'bg-green-500'
                                    }`}
                                style={{ width: `${infraData.nurseCapacity.capacityPercentage}%` }}
                            />
                        </div>
                        <div className="text-right text-xs text-slate-500 mt-1">
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
        blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        green: 'bg-green-500/20 text-green-400 border-green-500/30',
        amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        red: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
        <div className={`
            bg-slate-800 rounded-xl border p-4 relative
            ${highlight ? colorClasses[color] : 'border-slate-700'}
        `}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm">{label}</p>
                    <p className={`text-3xl font-bold ${highlight ? `text-${color}-400` : 'text-white'}`}>
                        {value}
                    </p>
                    {subtext && <p className="text-slate-500 text-xs mt-1">{subtext}</p>}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon className={`w-5 h-5 ${pulse ? 'animate-pulse' : ''}`} />
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
