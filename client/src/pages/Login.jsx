import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Key, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import api from '../lib/api'

/**
 * Login Page - Enterprise Clinical Design
 * Matches requested aesthetic: Split screen, Dark mode, Clean typography
 */
export default function Login() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('staff') // 'staff' | 'legacy'

    // Form States
    const [email, setEmail] = useState('')
    const [accessKey, setAccessKey] = useState('') // Functions as password
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem('nurse_token') || import.meta.env.VITE_NURSE_TOKEN
        if (token) {
            // Validate token before auto-redirect could be done, 
            // but for now we just verify on API calls. 
            // Only redirect if explicitly set in local storage to avoid confusion with env var
            if (localStorage.getItem('nurse_token')) {
                navigate('/')
            }
        }
    }, [navigate])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const tokenToTest = activeTab === 'staff' ? accessKey : accessKey;

        // Validation
        if (!tokenToTest) {
            setError('Please enter your access credentials')
            setLoading(false)
            return
        }

        try {
            // 1. Validate credentials by making a test API call
            // We manually construct the header for the test to override any existing interceptor logic temporarily
            const response = await api.get('/api/nurse/stats', {
                headers: {
                    'Authorization': `Bearer ${tokenToTest}`
                }
            })

            console.log('Login successful, stats access granted')

            // 2. Save Session
            localStorage.setItem('nurse_token', tokenToTest)

            // 3. Save user context and role
            if (activeTab === 'staff') {
                localStorage.setItem('user_email', email)
                localStorage.setItem('user_role', 'staff') // Staff users have limited access
            } else {
                // Legacy token = admin access
                localStorage.setItem('user_role', 'admin')
            }

            // 4. Redirect - use window.location to force full page reload and session state refresh
            window.location.href = '/dashboard'

        } catch (err) {
            console.error('Login failed:', err)
            setError('Invalid access credentials. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0D12] text-white p-4 font-sans selection:bg-indigo-500/30">
            {/* Ambient Background Glow */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Main Card Container */}
            <div className="w-full max-w-5xl bg-[#13151A] rounded-[2rem] shadow-2xl border border-white/5 grid grid-cols-1 lg:grid-cols-2 overflow-hidden relative z-10">

                {/* LEFT SIDE: Onboarding Image & Brand */}
                {/* "Borders around onboarding images": specific padding creates the border look */}
                <div className="relative p-3 hidden lg:block">
                    <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden">
                        {/* Clean Background Image */}
                        <div className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-[2s]"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')` }}>
                        </div>

                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1116] via-[#0F1116]/40 to-transparent opacity-90"></div>
                        <div className="absolute inset-0 bg-indigo-900/20 mix-blend-overlay"></div>

                        {/* Content Overlay */}
                        <div className="relative z-10 h-full flex flex-col justify-between p-8">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-wide">Hanna</span>
                            </div>

                            {/* Hero Text */}
                            <div className="mb-4">
                                <h1 className="text-4xl font-medium leading-[1.15] tracking-tight mb-5 text-white">
                                    Care intelligence<br />at scale
                                </h1>
                                <p className="text-slate-400 text-base leading-relaxed max-w-sm font-light">
                                    The enterprise standard for patient monitoring. Secure, scalable, and designed for clinical excellence.
                                </p>
                            </div>

                            {/* Carousel Indicators (Static Polish) */}
                            <div className="flex gap-2">
                                <div className="w-8 h-1 bg-white rounded-full"></div>
                                <div className="w-2 h-1 bg-white/30 rounded-full"></div>
                                <div className="w-2 h-1 bg-white/30 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Login Form */}
                <div className="flex flex-col justify-center p-8 lg:p-16 bg-[#13151A]">
                    <div className="max-w-sm w-full mx-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Sign in to platform</h2>
                            <p className="text-slate-400 text-sm">
                                Welcome back. Please enter your credentials.
                            </p>
                        </div>

                        {/* Custom Tabs */}
                        <div className="grid grid-cols-2 gap-1 p-1 bg-[#1E2129] rounded-xl mb-8 border border-white/5">
                            <button
                                onClick={() => { setActiveTab('staff'); setError(null); }}
                                className={`py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'staff'
                                    ? 'bg-[#2A2E38] text-white shadow-sm ring-1 ring-white/10'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                Staff
                            </button>
                            <button
                                onClick={() => { setActiveTab('legacy'); setError(null); }}
                                className={`py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'legacy'
                                    ? 'bg-[#2A2E38] text-white shadow-sm ring-1 ring-white/10'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                Legacy
                            </button>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {activeTab === 'staff' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-400 ml-1">WORK EMAIL</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full px-4 py-3 bg-[#0B0D12] border border-[#2A2E38] rounded-xl text-white placeholder-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm"
                                            placeholder="nurse@hospital.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-400 ml-1">ACCESS KEY</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={accessKey}
                                                onChange={(e) => setAccessKey(e.target.value)}
                                                className="block w-full px-4 py-3 bg-[#0B0D12] border border-[#2A2E38] rounded-xl text-white placeholder-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'legacy' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-400 ml-1">ADMIN TOKEN</label>
                                        <input
                                            type="password"
                                            value={accessKey}
                                            onChange={(e) => setAccessKey(e.target.value)}
                                            className="block w-full px-4 py-3 bg-[#0B0D12] border border-[#2A2E38] rounded-xl text-white placeholder-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm"
                                            placeholder="Enter system token..."
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create session'}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                            <span>Hanna OS v2.1</span>
                            <a href="#" className="hover:text-slate-300 transition-colors">Help & Documentation</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
