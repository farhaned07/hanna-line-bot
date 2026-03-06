import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#13151A] rounded-2xl shadow-2xl border border-white/10 p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">404</h1>
                <h2 className="text-xl font-semibold text-white mb-4">Page Not Found</h2>
                <p className="text-slate-400 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all"
                >
                    <Home className="w-4 h-4" />
                    Return to Dashboard
                </Link>
            </div>
        </div>
    )
}
