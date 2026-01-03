import { AlertTriangle, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * System Status Banners
 * Used to communicate system-wide states: offline, degraded AI, errors
 */

export function OfflineBanner({ lastUpdate, onRetry }) {
    return (
        <div className="bg-amber-900/50 border border-amber-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <WifiOff className="w-5 h-5 text-amber-400" />
                    <div>
                        <p className="text-amber-200 font-medium">Offline Mode</p>
                        <p className="text-amber-400/70 text-sm">
                            Last sync: {lastUpdate || 'Unknown'}. Some features may be limited.
                        </p>
                    </div>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-100 text-sm rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
}

export function DegradedAIBanner() {
    return (
        <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div>
                    <p className="text-yellow-200 font-medium">AI Temporarily Unavailable</p>
                    <p className="text-yellow-400/70 text-sm">
                        Hanna's AI analysis is temporarily offline. Manual triage mode is active.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function CriticalAlertBanner({ count, onViewQueue }) {
    if (!count || count === 0) return null;

    return (
        <div className="bg-red-900/60 border border-red-600 rounded-lg p-4 mb-4 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                    </div>
                    <div>
                        <p className="text-red-100 font-semibold">
                            🚨 {count} Critical Patient{count > 1 ? 's' : ''} Require{count === 1 ? 's' : ''} Immediate Attention
                        </p>
                    </div>
                </div>
                <button
                    onClick={onViewQueue}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
                >
                    View Queue →
                </button>
            </div>
        </div>
    );
}

export function EmptyState({ title, description, actionLabel, onAction }) {
    return (
        <div className="bg-[#13151A]/50 border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title || 'All Clear'}</h3>
            <p className="text-slate-400 mb-6">
                {description || 'No pending actions. All patients stable.'}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all border border-white/5 font-medium"
                >
                    {actionLabel}
                </button>
            )}
            <p className="text-slate-500 text-xs mt-4 font-mono">
                Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    );
}
