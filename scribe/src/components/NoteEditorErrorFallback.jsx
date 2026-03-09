import { AlertTriangle, Save, FileText } from 'lucide-react'

export default function NoteEditorErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Editor Error
                </h2>
                
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    The note editor encountered an error. Your changes are safe.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <Save className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                            <p className="text-sm font-semibold text-blue-900">
                                Auto-saved
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                Your note has been automatically saved. No data will be lost.
                            </p>
                        </div>
                    </div>
                </div>
                
                {error && (
                    <details className="text-left mb-6 p-4 bg-slate-50 rounded-lg">
                        <summary className="text-xs font-semibold text-slate-500 cursor-pointer mb-2">
                            Error Details
                        </summary>
                        <pre className="text-xs text-slate-600 whitespace-pre-wrap">
                            {error.message || String(error)}
                        </pre>
                    </details>
                )}
                
                <div className="flex gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        View Note
                    </button>
                    <button
                        onClick={resetErrorBoundary}
                        className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry Editor
                    </button>
                </div>
            </div>
        </div>
    )
}
