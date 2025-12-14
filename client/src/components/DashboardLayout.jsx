import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
    CreditCard,
    Users,
    Activity,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Activity },
        { name: 'Patients', href: '/dashboard/patients', icon: Users },
        { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar placeholder */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white p-6 transition-transform">
                    {/* Mobile menu content would go here */}
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-indigo-600">Hanna Admin</span>
                        <button onClick={() => setSidebarOpen(false)}><X className="h-6 w-6" /></button>
                    </div>
                    <nav className="mt-8 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-base font-semibold leading-7 ${location.pathname === item.href
                                        ? 'bg-gray-50 text-indigo-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                    <div className="flex h-16 shrink-0 items-center">
                        <span className="text-2xl font-bold text-indigo-600">Hanna Admin</span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={item.href}
                                                className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${location.pathname === item.href
                                                        ? 'bg-gray-50 text-indigo-600'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                                    }`}
                                            >
                                                <item.icon className={`h-6 w-6 shrink-0 ${location.pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`} aria-hidden="true" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="-mx-6 mt-auto">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                                >
                                    <LogOut className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                                    <span aria-hidden="true">Log Out</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="lg:pl-72">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1"></div>
                    </div>
                </div>

                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
