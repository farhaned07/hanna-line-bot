import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Mic,
    FileText,
    Settings,
    Menu,
    X,
    LogOut,
    User,
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

/**
 * Dashboard Layout - Mobile-first with sidebar
 * Matches Nurse Command Center aesthetic
 */
export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = authApi.getUser();

    const navigation = [
        { name: 'Home', href: '/scribe/app', icon: Home },
        { name: 'Handover', href: '/scribe/app/handover', icon: FileText },
        { name: 'Settings', href: '/scribe/app/settings', icon: Settings },
    ];

    const isActive = (href) => {
        if (href === '/scribe/app') {
            return location.pathname === '/scribe/app';
        }
        return location.pathname.startsWith(href);
    };

    const handleLogout = () => {
        authApi.logout();
        // In demo mode, just reload the app
        window.location.reload();
    };

    return (
        <div className="min-h-dvh bg-background relative">
            {/* Ambient Background Glow */}
            <div className="ambient-glow" />

            {/* Mobile Header */}
            <div className="lg:hidden safe-top flex items-center justify-between px-5 py-4 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                        <Mic className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white">Hanna Scribe</h1>
                        <p className="text-xs text-muted-foreground">Clinical Documentation</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setSidebarOpen(true)}
                    className="text-muted-foreground"
                >
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:w-72 lg:flex-col lg:border-r lg:border-border lg:bg-background-secondary">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-20 items-center gap-3 px-6 border-b border-border">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary-glow/50">
                            <Mic className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Hanna Scribe</h1>
                            <p className="text-xs text-muted-foreground">Voice-first documentation</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    isActive(item.href)
                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background-tertiary border border-border">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.display_name || 'Clinician'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.email || 'clinician@hospital.com'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-background-secondary border-r border-border z-50 lg:hidden"
                        >
                            <div className="flex h-full flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                                            <Mic className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-lg font-bold text-white">Hanna</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => setSidebarOpen(false)}
                                        className="text-muted-foreground"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Navigation */}
                                <nav className="flex-1 px-4 py-6 space-y-2">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                                isActive(item.href)
                                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                            }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>

                                {/* User */}
                                <div className="p-4 border-t border-border">
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background-tertiary border border-border mb-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {user?.display_name || 'Clinician'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setSidebarOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/5 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="lg:pl-72 min-h-dvh">
                {children}
            </main>
        </div>
    );
}
