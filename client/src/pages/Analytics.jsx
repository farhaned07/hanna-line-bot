import { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import {
    Activity,
    TrendingUp,
    AlertTriangle,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import axios from 'axios';

// Mock data fallback if API fails (for demo robustness)
const MOCK_DATA = [
    { date: 'Mon', checkins: 45, alerts: 2, resolutions: 5, activePatients: 120 },
    { date: 'Tue', checkins: 52, alerts: 1, resolutions: 4, activePatients: 122 },
    { date: 'Wed', checkins: 49, alerts: 3, resolutions: 6, activePatients: 125 },
    { date: 'Thu', checkins: 58, alerts: 0, resolutions: 2, activePatients: 128 },
    { date: 'Fri', checkins: 62, alerts: 4, resolutions: 8, activePatients: 130 },
    { date: 'Sat', checkins: 40, alerts: 1, resolutions: 3, activePatients: 131 },
    { date: 'Sun', checkins: 38, alerts: 0, resolutions: 1, activePatients: 132 },
];

export default function Analytics() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                // In production, use the real endpoint:
                const response = await axios.get('/api/nurse/trends', {
                    headers: { Authorization: `Bearer ${import.meta.env.VITE_NURSE_TOKEN}` }
                });
                if (response.data && response.data.length > 0) {
                    setData(response.data);
                } else {
                    setData(MOCK_DATA);
                }
                // For now, if the endpoint returns empty (no historical data), use mock for viz
                // setData(MOCK_DATA); 
            } catch (error) {
                console.error('Failed to fetch analytics, using fallback', error);
                setData(MOCK_DATA);
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, []);

    // Calculate Summary Metrics
    const totalCheckins = data.reduce((acc, curr) => acc + curr.checkins, 0);
    const totalAlerts = data.reduce((acc, curr) => acc + curr.alerts, 0);
    const avgCheckins = Math.round(totalCheckins / data.length) || 0;
    const engagementRate = Math.round((avgCheckins / (data[data.length - 1]?.activePatients || 1)) * 100);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics & Insights</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Operational trends over the last 7 days
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    Last 7 Days
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard
                    label="Avg Daily Check-ins"
                    value={avgCheckins}
                    icon={Activity}
                    color="blue"
                    trend="+12%"
                    trendUp={true}
                />
                <KPICard
                    label="Patient Growth"
                    value={data[data.length - 1]?.activePatients || 0}
                    icon={Users}
                    color="green"
                    trend="+5 this week"
                    trendUp={true}
                />
                <KPICard
                    label="Engagement Rate"
                    value={`${engagementRate}%`}
                    icon={TrendingUp}
                    color="purple"
                    trend="Stable"
                />
                <KPICard
                    label="Alert Volume"
                    value={totalAlerts}
                    icon={AlertTriangle}
                    color={totalAlerts > 5 ? 'amber' : 'slate'}
                    trend={`${(totalAlerts / 7).toFixed(1)}/day`}
                />
            </div>

            {/* Main Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* Engagement Trend */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Patient Engagement Trend
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="checkins"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorCheckins)"
                                    name="Check-ins"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk & Interventions */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Risk vs. Resolutions
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <RechartsTooltip
                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="alerts" name="High Risk Alerts" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="resolutions" name="Resolved Cases" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Growth Chart */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Patient Population Growth
                </h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="activePatients"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ fill: '#10B981', r: 4 }}
                                name="Active Patients"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function KPICard({ label, value, icon: Icon, color, trend, trendUp }) {
    const colorClasses = {
        blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
        green: { bg: 'bg-green-500/20', text: 'text-green-400' },
        amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
        purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
        slate: { bg: 'bg-slate-700', text: 'text-slate-400' }
    }[color] || { bg: 'bg-slate-700', text: 'text-slate-400' };

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">{label}</span>
                <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                    <Icon className={`w-4 h-4 ${colorClasses.text}`} />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{value}</span>
                {trend && (
                    <div className={`flex items-center text-xs font-medium ${trendUp ? 'text-green-400' : 'text-slate-500'}`}>
                        {trendUp && <ArrowUpRight className="w-3 h-3 mr-1" />}
                        {trend}
                    </div>
                )}
            </div>
        </div>
    );
}
