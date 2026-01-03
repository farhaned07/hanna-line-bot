import { useState } from 'react';
import { FileText, Download, Clock, Loader2, X, CheckCircle } from 'lucide-react';
import api from '../lib/api';

/**
 * Generate Summary Modal Component
 * Allows nurses to generate patient health summary PDFs
 * Matches existing dashboard dark theme styling
 */
export default function GenerateSummaryModal({ isOpen, onClose, patientId, patientName }) {
    const [timeRange, setTimeRange] = useState(15);
    const [language, setLanguage] = useState('th');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await api.post(
                `/api/nurse/patients/${patientId}/summary`,
                { timeRangeDays: timeRange, language },
                { responseType: 'blob' }
            );

            // Get audit ID from headers
            const auditId = response.headers['x-audit-id'];

            // Download the PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Auto-download
            const a = document.createElement('a');
            a.href = url;
            a.download = `${auditId || 'patient-summary'}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setResult({
                auditId,
                downloadUrl: url
            });
        } catch (err) {
            console.error('PDF generation error:', err);
            // Extract error message from blob response or axios error
            if (err.response?.data instanceof Blob) {
                const text = await err.response.data.text();
                try {
                    const json = JSON.parse(text);
                    setError(json.error || 'Failed to generate PDF');
                } catch {
                    setError('Failed to generate PDF');
                }
            } else {
                setError(err.response?.data?.error || err.message || 'Failed to generate PDF');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setResult(null);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#13151A] rounded-2xl border border-white/10 shadow-2xl z-10 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Generate Summary</h2>
                            <p className="text-sm text-slate-400">{patientName}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Time Range Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Time Range
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[7, 15, 30].map(days => (
                                <button
                                    key={days}
                                    onClick={() => setTimeRange(days)}
                                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${timeRange === days
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                                        }`}
                                >
                                    {days} Days
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Language Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Language
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setLanguage('th')}
                                className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${language === 'th'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                                    }`}
                            >
                                🇹🇭 ไทย
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${language === 'en'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                                    }`}
                            >
                                🇬🇧 English
                            </button>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-[#0B0D12] border border-white/5 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-indigo-400 mt-0.5" />
                            <div className="text-sm text-slate-400">
                                <p>This will generate a clinical-grade PDF summary including:</p>
                                <ul className="mt-2 space-y-1 text-slate-500">
                                    <li>• Engagement & adherence metrics</li>
                                    <li>• Vitals trends with charts</li>
                                    <li>• Symptoms & nurse notes</li>
                                    <li>• AI summary (reviewed)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success State */}
                    {result && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <p className="text-emerald-400 font-semibold">PDF Generated Successfully!</p>
                                    <p className="text-sm text-emerald-400/70 font-mono">Audit ID: {result.auditId}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/5 flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-xl transition-all border border-white/5"
                    >
                        {result ? 'Close' : 'Cancel'}
                    </button>
                    {!result && (
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Generate PDF
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
