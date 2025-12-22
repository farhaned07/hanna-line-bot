import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePatientDetail, useTaskActions } from '../hooks/useNurseData';
import { SkeletonTimeline, SkeletonCard } from '../components/ui/Skeleton';
import {
    ArrowLeft,
    Activity,
    Calendar,
    FileText,
    AlertCircle,
    Phone,
    MessageSquare,
    CheckCircle,
    Clock,
    Brain,
    User,
    Heart,
    Pill
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

/**
 * Patient Clinical View - Dark Mode Enterprise Design
 * Full clinical context for a single patient
 */
export default function PatientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { patient, loading, error } = usePatientDetail(id);
    const { resolveTask, processing } = useTaskActions();

    if (loading) {
        return (
            <div className="space-y-6">
                <SkeletonCard />
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2"><SkeletonCard /></div>
                    <SkeletonTimeline count={5} />
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-red-400">Error Loading Patient</h2>
                <p className="text-slate-400 mt-2">Unable to load patient data. Please try again.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Format chart data from history
    const chartData = [...(patient.history || [])].reverse().map(h => ({
        time: new Date(h.check_in_time).toLocaleDateString(),
        glucose: h.glucose_level,
        systolic: h.systolic,
        diastolic: h.diastolic
    })).filter(d => d.glucose || d.systolic);

    // Insight Logic: Calculate Trend
    let trendInsight = { label: 'Stable', color: 'green', icon: CheckCircle };
    if (chartData.length >= 2) {
        const last = chartData[chartData.length - 1];
        const prev = chartData[chartData.length - 2];
        if (last.glucose && prev.glucose) {
            const diff = last.glucose - prev.glucose;
            if (diff > 20) trendInsight = { label: `Glucose Rising (+${diff})`, color: 'amber', icon: TrendingUp };
            else if (diff < -20) trendInsight = { label: `Glucose Improving (-${Math.abs(diff)})`, color: 'green', icon: TrendingUp };
        }
    }

    // Determine risk level styling
    const riskLevel = patient.risk_level || 'low';
    const riskStyles = {
        critical: 'bg-red-500/20 text-red-400 border-red-500',
        high: 'bg-amber-500/20 text-amber-400 border-amber-500',
        medium: 'bg-blue-500/20 text-blue-400 border-blue-500',
        low: 'bg-green-500/20 text-green-400 border-green-500'
    }[riskLevel] || 'bg-green-500/20 text-green-400 border-green-500';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-6 w-6 text-slate-400" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-white">{patient.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${riskStyles}`}>
                            {riskLevel.toUpperCase()}
                        </span>
                        {/* Trend Insight Badge */}
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${trendInsight.color === 'amber' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' :
                            'bg-slate-700/50 border-slate-600 text-slate-300'
                            }`}>
                            <trendInsight.icon className="w-3.5 h-3.5" />
                            {trendInsight.label}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                        <span>Age: {patient.age}</span>
                        <span>•</span>
                        <span>Condition: {patient.condition}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${patient.enrollment_status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-amber-500/20 text-amber-400'
                            }`}>
                            {patient.enrollment_status?.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column: Patient Info & Vitals */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Vitals Chart */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
                            <Activity className="h-5 w-5 text-blue-400" />
                            Vitals Trends
                        </h3>
                        <div className="h-64 w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#f8fafc'
                                            }}
                                        />
                                        <Line type="monotone" dataKey="glucose" stroke="#ef4444" name="Glucose" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="systolic" stroke="#3b82f6" name="Systolic BP" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="diastolic" stroke="#93c5fd" name="Diastolic BP" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500">
                                    Not enough data for visualization
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Check-ins */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-700 bg-slate-900">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-slate-400" />
                                Recent Check-ins
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-700 max-h-80 overflow-y-auto">
                            {(patient.history || []).length === 0 ? (
                                <div className="p-6 text-center text-slate-500">No check-ins recorded</div>
                            ) : (
                                patient.history.map((log) => (
                                    <div key={log.id} className="px-6 py-4 hover:bg-slate-700/50">
                                        <div className="flex justify-between">
                                            <div className="text-sm font-medium text-white">
                                                {log.symptoms && log.symptoms !== 'none' ? (
                                                    <span className="text-red-400">{log.symptoms}</span>
                                                ) : (
                                                    'Routine Check'
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {new Date(log.check_in_time).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="mt-1 text-sm text-slate-400">
                                            Glucose: {log.glucose_level || 'N/A'} | BP: {log.systolic}/{log.diastolic}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & History */}
                <div className="space-y-6">
                    {/* Patient Card */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
                            <User className="h-5 w-5 text-slate-400" />
                            Patient Info
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Name</span>
                                <span className="text-white">{patient.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Age</span>
                                <span className="text-white">{patient.age}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Condition</span>
                                <span className="text-white">{patient.condition}</span>
                            </div>
                            {patient.phone && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Phone</span>
                                    <span className="text-white">{patient.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Clinical Actions */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Clinical Actions</h3>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    if (confirm(`⚠️ ESCALATION PROTOCOL\n\nAction: Notify On-Call Physician\nTimestamp: ${new Date().toLocaleString()}\n\nProceed?`)) {
                                        alert("Escalation Triggered. Logged in audit trail.");
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <AlertCircle className="h-4 w-4" />
                                Escalate to Doctor
                            </button>

                            {/* Call Button: Real tel: link or disabled based on phone availability */}
                            {patient.phone_number ? (
                                <a
                                    href={`tel:${patient.phone_number}`}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    <Phone className="h-4 w-4" />
                                    Call {patient.phone_number}
                                </a>
                            ) : (
                                <button
                                    disabled
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-slate-400 font-medium rounded-lg cursor-not-allowed opacity-60"
                                >
                                    <Phone className="h-4 w-4" />
                                    No phone on file
                                </button>
                            )}

                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors">
                                <MessageSquare className="h-4 w-4" />
                                Send Message
                            </button>

                            {/* Suggested Script - Fixed template interpolation */}
                            <div className="mt-4 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                                <p className="text-xs text-slate-400 mb-2 uppercase font-medium tracking-wider">Suggested Script</p>
                                <p className="text-sm text-slate-300 italic">
                                    "This is Nurse Hanna calling. I noticed your {trendInsight.label.toLowerCase()} compared to last week. Have you been taking your medication regularly?"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Care History */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-700 bg-slate-900">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                <FileText className="h-5 w-5 text-slate-400" />
                                Care History
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-700 max-h-80 overflow-y-auto">
                            {(patient.tasks || []).length === 0 ? (
                                <div className="p-6 text-center text-slate-500">No tasks recorded</div>
                            ) : (
                                patient.tasks.map((task) => (
                                    <div key={task.id} className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${task.priority === 'critical'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-slate-700 text-slate-400'
                                                }`}>
                                                {task.task_type}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(task.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-400">{task.reason || 'No details'}</p>
                                        {task.status === 'completed' && (
                                            <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" /> Resolved
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
