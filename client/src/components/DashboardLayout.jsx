import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
    CreditCard,
    Users,
    Activity,
    LogOut,
    Menu,
    X,
    Eye,
    Cpu,
    AlertCircle,
    CheckCircle,
    TrendingUp
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useInfrastructureHealth } from '../hooks/useNurseData'

/**
 * Dashboard Layout - Dark Mode Enterprise Design
 * Clinical Command Center shell with navigation and system status
 */
export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { data: infraData } = useInfrastructureHealth()

    // Get user role from localStorage
    const userRole = localStorage.getItem('user_role') || 'staff'
    const isAdmin = userRole === 'admin'

    // Navigation items - Payments only visible to admin
    const allNavigation = [
        { name: 'Mission Control', href: '/dashboard', icon: Activity },
        { name: 'Monitoring', href: '/dashboard/monitoring', icon: Eye },
        { name: 'Patients', href: '/dashboard/patients', icon: Users },
        { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, adminOnly: true },
    ]

    // Filter navigation based on role
    const navigation = allNavigation.filter(item => !item.adminOnly || isAdmin)

    const isActive = (href) => {
        if (href === '/dashboard') {
            return location.pathname === '/dashboard'
        }
        return location.pathname.startsWith(href)
    }

    const handleLogout = async () => {
        // Clear local session (Custom Auth)
        localStorage.removeItem('nurse_token')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_role')

        // Clear Supabase session (Legacy)
        await supabase.auth.signOut()

        navigate('/login')
    }

    // System status indicator
    const systemStatus = infraData?.uptime?.percentage >= 99 ? 'healthy' : 'degraded'

    return (
        <div className="min-h-screen bg-[#0B0D12] text-slate-300 font-sans selection:bg-indigo-500/30">
            {/* Ambient Background Glow (Subtle) */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none z-0"></div>

            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-[#13151A] p-6 transition-transform border-r border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white tracking-wide">Hanna Command</span>
                        <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="mt-8 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-x-3 rounded-xl px-3 py-3 text-base font-medium transition-all ${isActive(item.href)
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 shrink-0 ${isActive(item.href) ? 'text-indigo-400' : 'text-slate-500'}`} aria-hidden="true" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/5 bg-[#13151A] px-6 pb-4">
                    {/* Logo area */}
                    <div className="flex h-20 shrink-0 items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                                <Activity className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-wide">Hanna</span>
                        </div>
                        {/* System Status Pill */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border ${systemStatus === 'healthy'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${systemStatus === 'healthy' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-amber-400 animate-pulse'
                                }`}></span>
                            {systemStatus === 'healthy' ? 'Online' : 'Degraded'}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-8">
                            <li>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={item.href}
                                                className={`group flex gap-x-3 rounded-xl p-3 text-sm font-medium transition-all duration-200 ${isActive(item.href)
                                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]'
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 hover:translate-x-1'
                                                    }`}
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 shrink-0 transition-colors ${isActive(item.href)
                                                        ? 'text-indigo-400'
                                                        : 'text-slate-500 group-hover:text-slate-300'
                                                        }`}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {/* Infrastructure Quick Stats */}
                            {infraData && (
                                <li className="mt-auto mb-2">
                                    <div className="bg-[#0B0D12] rounded-xl p-4 border border-white/5 shadow-inner">
                                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Cpu className="w-3 h-3 text-indigo-400" />
                                            System Vitals
                                        </p>
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Processing</span>
                                                <span className="text-slate-200 font-mono">{infraData.aiProcessing?.analysesToday || 0}</span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-1">
                                                <div className="bg-indigo-500 h-1 rounded-full" style={{ width: '45%' }}></div>
                                            </div>

                                            <div className="flex justify-between items-center text-xs mt-3">
                                                <span className="text-slate-500">Queue Load</span>
                                                <span className="text-slate-200 font-mono">{infraData.nurseCapacity?.currentQueueSize || 0}</span>
                                            </div>

                                            <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5 mt-2">
                                                <span className="text-slate-500">Uptime</span>
                                                <span className="text-emerald-400 font-mono">{infraData.uptime?.percentage || 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {/* Logout */}
                            <li className="-mx-6 border-t border-white/5 pt-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-x-3 px-8 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-500/10 group-hover:text-red-400 transition-colors">
                                        <LogOut className="h-4 w-4" aria-hidden="true" />
                                    </div>
                                    <span className="group-hover:text-slate-200">Sign Out</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content area */}
            <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
                {/* Top header bar */}
                <div className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-x-4 border-b border-white/5 bg-[#0B0D12]/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">
                    {/* Background glow for header */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-slate-400 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Header content */}
                    <div className="flex flex-1 gap-x-4 self-stretch items-center lg:gap-x-6">
                        <div className="flex flex-1 items-center gap-4">
                            {/* Breadcrumb or Page Title could go here */}
                            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                                <span className="hover:text-slate-300 transition-colors cursor-pointer">Command Center</span>
                                <span className="text-slate-700">/</span>
                                <span className="text-slate-300 font-medium capitalize">{location.pathname.split('/').pop() || 'Overview'}</span>
                            </div>
                        </div>

                        {/* Right Action Area */}
                        <div className="flex items-center gap-4">
                            {/* Time display */}
                            <div className="hidden sm:block px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-slate-400 font-mono">
                                <TimeDisplay />
                            </div>

                            {/* User Avatar Placeholder - could add later */}
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 ring-2 ring-[#0B0D12]"></div>
                        </div>
                    </div>
                </div>

                {/* Page content wrapper */}
                <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}


// Live time display component
function TimeDisplay() {
    const [time, setTime] = useState(new Date())

    useState(() => {
        const interval = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(interval)
    })

    return (
        <span>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <span className="ml-2 text-slate-500">
                {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
        </span>
    )
}
