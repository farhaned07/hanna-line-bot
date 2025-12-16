import { Component } from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

/**
 * Error Boundary Component
 * Catches React errors and displays a user-friendly fallback UI
 * instead of crashing to a white screen.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            lastGoodTime: null
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            lastGoodTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    }

    componentDidCatch(error, errorInfo) {
        // Log to monitoring service in production
        console.error('🚨 [ErrorBoundary] Caught error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-amber-400" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-white text-center mb-2">
                            Connection Issue
                        </h2>

                        {/* Description */}
                        <p className="text-slate-400 text-center mb-6">
                            Unable to load dashboard. Last data: {this.state.lastGoodTime || 'Unknown'}
                        </p>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={this.handleRetry}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Retry Now
                            </button>

                            <button
                                onClick={() => window.location.href = '/dashboard/patients'}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors"
                            >
                                <WifiOff className="w-4 h-4" />
                                View Cached Data
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="text-slate-500 text-xs text-center mt-6">
                            ℹ️ You can still access patient records while offline.
                        </p>

                        {/* Technical Details (collapsed) */}
                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-4 text-xs text-slate-500">
                                <summary className="cursor-pointer">Technical Details</summary>
                                <pre className="mt-2 p-2 bg-slate-900 rounded overflow-auto max-h-32">
                                    {this.state.error?.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
