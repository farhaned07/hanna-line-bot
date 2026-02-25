import { useState, useEffect } from 'react'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Activity,
    AlertTriangle,
    Heart,
    Download,
    Calendar,
    Loader2,
    AlertCircle,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'
import api from '../lib/api'

/**
 * Analytics Dashboard
 * Key metrics and trends for hospital administrators
 */
export default function Analytics() {
    const [summary, setSummary] = useState(null)
    const [engagement, setEngagement] = useState(null)
    const [riskDist, setRiskDist] = useState(null)
    const [dailyCheckins, setDailyCheckins] = useState(null)
    const [topRisk, setTopRisk] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [exportingCSV, setExportingCSV] = useState(false)

    // Fetch all analytics data
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true)
                const [summaryRes, engagementRes, riskRes, checkinsRes, topRiskRes] = await Promise.all([
                    api.get('/api/analytics/summary'),
                    api.get('/api/analytics/engagement?days=30'),
                    api.get('/api/analytics/risk-distribution'),
                    api.get('/api/analytics/daily-checkins?days=14'),
                    api.get('/api/analytics/top-risk-patients?limit=5')
                ])

                setSummary(summaryRes.data)
                setEngagement(engagementRes.data)
                setRiskDist(riskRes.data)
                setDailyCheckins(checkinsRes.data)
                setTopRisk(topRiskRes.data)
                setError(null)
            } catch (err) {
                console.error('Failed to fetch analytics:', err)
                setError('Failed to load analytics data')
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    // Export patients CSV
    const handleExportCSV = async () => {
        try {
            setExportingCSV(true)
            const response = await api.get('/api/analytics/export/patients-csv', {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `patients_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (err) {
            console.error('Export failed:', err)
            alert('Failed to export CSV')
        } finally {
            setExportingCSV(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )
    }

    // Calculate engagement trend
    const engagementTrend = engagement?.data?.length >= 7
        ? ((engagement.data[engagement.data.length - 1]?.rate || 0) - (engagement.data[engagement.data.length - 7]?.rate || 0))
        : 0

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Patient engagement and program performance metrics
                    </p>
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={exportingCSV}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors shrink-0"
                >
                    {exportingCSV ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    Export CSV
                </button>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Patients */}
                <MetricCard
                    icon={Users}
                    label="Active Patients"
                    value={summary?.activePatients || 0}
                    color="indigo"
                />

                {/* Weekly Engagement */}
                <MetricCard
                    icon={Activity}
                    label="Weekly Engagement"
                    value={`${summary?.weeklyEngagement?.percentage || 0}%`}
                    subValue={`${summary?.weeklyEngagement?.engaged || 0} of ${summary?.weeklyEngagement?.total || 0}`}
                    trend={engagementTrend > 0 ? 'up' : engagementTrend < 0 ? 'down' : null}
                    trendValue={Math.abs(engagementTrend)}
                    color="emerald"
                />

                {/* Medication Adherence */}
                <MetricCard
                    icon={Heart}
                    label="Medication Adherence"
                    value={`${summary?.medicationAdherence?.percentage || 0}%`}
                    subValue={`${summary?.medicationAdherence?.adherent || 0} took meds this week`}
                    color="rose"
                />

                {/* Red Flags */}
                <MetricCard
                    icon={AlertTriangle}
                    label="Red Flags This Week"
                    value={summary?.redFlagsThisWeek || 0}
                    subValue={`${summary?.tasksResolvedThisWeek || 0} resolved`}
                    color="amber"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Engagement Trend */}
                <div className="bg-[#13151A] rounded-2xl border border-white/5 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Daily Engagement (30 days)</h3>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center gap-1 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                Engaged
                            </span>
                        </div>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="h-48 flex items-end gap-1">
                        {engagement?.data?.slice(-14).map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className="w-full bg-emerald-500/30 rounded-t-sm hover:bg-emerald-500/50 transition-colors relative group"
                                    style={{ height: `${Math.max(8, (day.rate || 0) * 1.8)}px` }}
                                >
                                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {day.rate}% ({day.engaged} users)
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-500">
                                    {new Date(day.date).getDate()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="bg-[#13151A] rounded-2xl border border-white/5 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Risk Distribution</h3>

                    <div className="space-y-4">
                        {riskDist && (
                            <>
                                <RiskBar
                                    label="Critical"
                                    count={riskDist.critical}
                                    total={riskDist.total}
                                    color="bg-red-500"
                                />
                                <RiskBar
                                    label="High"
                                    count={riskDist.high}
                                    total={riskDist.total}
                                    color="bg-orange-500"
                                />
                                <RiskBar
                                    label="Medium"
                                    count={riskDist.medium}
                                    total={riskDist.total}
                                    color="bg-yellow-500"
                                />
                                <RiskBar
                                    label="Low"
                                    count={riskDist.low}
                                    total={riskDist.total}
                                    color="bg-emerald-500"
                                />
                            </>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-sm">
                        <span className="text-slate-400">Total Monitored</span>
                        <span className="text-white font-semibold">{riskDist?.total || 0} patients</span>
                    </div>
                </div>
            </div>

            {/* Check-ins Chart + Top Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Check-ins */}
                <div className="lg:col-span-2 bg-[#13151A] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Daily Check-ins (14 days)</h3>

                    <div className="h-40 flex items-end gap-2">
                        {dailyCheckins?.data?.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className="w-full bg-indigo-500/30 rounded-t-sm hover:bg-indigo-500/50 transition-colors"
                                    style={{ height: `${Math.max(4, (day.count / Math.max(...dailyCheckins.data.map(d => d.count), 1)) * 140)}px` }}
                                ></div>
                                <span className="text-[10px] text-slate-500">
                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Risk Patients */}
                <div className="bg-[#13151A] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Highest Risk Patients</h3>

                    <div className="space-y-3">
                        {topRisk.length === 0 ? (
                            <p className="text-slate-500 text-sm">No high-risk patients</p>
                        ) : (
                            topRisk.map((patient, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.04] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${patient.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                                            patient.risk_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {Math.round(patient.current_risk_score || 0)}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{patient.name}</p>
                                            <p className="text-slate-500 text-xs">{patient.condition}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${patient.risk_level === 'critical' ? 'bg-red-500/10 text-red-400' :
                                        patient.risk_level === 'high' ? 'bg-orange-500/10 text-orange-400' :
                                            'bg-yellow-500/10 text-yellow-400'
                                        }`}>
                                        {patient.risk_level}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Metric Card Component
function MetricCard({ icon: Icon, label, value, subValue, trend, trendValue, color }) {
    const colorClasses = {
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    }

    const iconBgClasses = {
        indigo: 'bg-indigo-500/20',
        emerald: 'bg-emerald-500/20',
        amber: 'bg-amber-500/20',
        rose: 'bg-rose-500/20'
    }

    return (
        <div className={`rounded-2xl border p-5 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trendValue}%
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
            {subValue && <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>}
        </div>
    )
}

// Risk Distribution Bar
function RiskBar({ label, count, total, color }) {
    const percentage = total > 0 ? (count / total) * 100 : 0

    return (
        <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-slate-400">{label}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <span className="w-8 text-sm text-slate-300 text-right">{count}</span>
        </div>
    )
}
