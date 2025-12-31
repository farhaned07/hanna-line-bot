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

    const navigation = [
        { name: 'Mission Control', href: '/dashboard', icon: Activity },
        { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
        { name: 'Monitoring', href: '/dashboard/monitoring', icon: Eye },
        { name: 'Patients', href: '/dashboard/patients', icon: Users },
        { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
        { name: '🤖 Agent Command', href: '/dashboard/agents', icon: Cpu },
    ]

    const isActive = (href) => {
        if (href === '/dashboard') {
            return location.pathname === '/dashboard'
        }
        return location.pathname.startsWith(href)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    // System status indicator
    const systemStatus = infraData?.uptime?.percentage >= 99 ? 'healthy' : 'degraded'

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-slate-800 p-6 transition-transform border-r border-slate-700">
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">Hanna Command</span>
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
                                className={`flex items-center gap-x-3 rounded-lg px-3 py-3 text-base font-medium transition-colors ${isActive(item.href)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-700 bg-slate-800 px-6">
                    {/* Logo */}
                    <div className="flex h-16 shrink-0 items-center justify-between">
                        <span className="text-xl font-bold text-white">Hanna</span>
                        {/* System Status Pill */}
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${systemStatus === 'healthy'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-amber-500/20 text-amber-400'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${systemStatus === 'healthy' ? 'bg-green-400' : 'bg-amber-400 animate-pulse'
                                }`}></span>
                            {systemStatus === 'healthy' ? 'Online' : 'Degraded'}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={item.href}
                                                className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-colors ${isActive(item.href)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                                    }`}
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 shrink-0 ${isActive(item.href)
                                                        ? 'text-white'
                                                        : 'text-slate-400 group-hover:text-white'
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
                                    <div className="bg-slate-900 rounded-lg p-3 text-xs">
                                        <p className="text-slate-400 font-medium mb-2 flex items-center gap-1">
                                            <Cpu className="w-3 h-3" />
                                            Infrastructure
                                        </p>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-slate-500">
                                                <span>AI Analyses</span>
                                                <span className="text-slate-300">{infraData.aiProcessing?.analysesToday || 0}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-500">
                                                <span>Queue</span>
                                                <span className="text-slate-300">{infraData.nurseCapacity?.currentQueueSize || 0} tasks</span>
                                            </div>
                                            <div className="flex justify-between text-slate-500">
                                                <span>Uptime</span>
                                                <span className="text-green-400">{infraData.uptime?.percentage || 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {/* Logout */}
                            <li className="-mx-6">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-x-4 px-6 py-4 text-sm font-medium text-slate-400 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700"
                                >
                                    <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
                                    <span>Log Out</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content area */}
            <div className="lg:pl-64">
                {/* Top header bar */}
                <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm px-4 sm:gap-x-6 sm:px-6 lg:px-8">
                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-slate-400 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Separator for mobile */}
                    <div className="h-6 w-px bg-slate-700 lg:hidden" aria-hidden="true"></div>

                    {/* Header content */}
                    <div className="flex flex-1 gap-x-4 self-stretch items-center lg:gap-x-6">
                        <div className="flex flex-1"></div>

                        {/* Time display */}
                        <div className="text-slate-400 text-sm">
                            <TimeDisplay />
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-6 lg:p-8">
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
