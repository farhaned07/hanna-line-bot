import { useState } from 'react';
import { authApi } from '@/lib/api';

/**
 * Settings Page - User preferences and billing
 */
export default function Settings() {
    const user = authApi.getUser();
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-dvh bg-background relative">
            {/* Ambient Background Glow */}
            <div className="ambient-glow" />

            {/* Header */}
            <div className="safe-top px-6 pt-8 pb-6 relative z-10">
                <h1 className="text-3xl font-bold text-white gradient-text mb-2">
                    Settings
                </h1>
                <p className="text-muted-foreground text-sm">
                    Manage your account and preferences
                </p>
            </div>

            {/* Content */}
            <div className="px-6 space-y-6 relative z-10">
                {/* Profile Section */}
                <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Profile
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Email
                            </label>
                            <p className="text-white mt-1">{user?.email || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Display Name
                            </label>
                            <p className="text-white mt-1">{user?.display_name || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Sign Out */}
                <button
                    onClick={() => {
                        if (confirm('Sign out of Hanna Scribe?')) {
                            logout();
                        }
                    }}
                    className="w-full p-4 rounded-xl bg-critical/10 border border-critical/20 text-critical font-medium hover:bg-critical/20 transition-all"
                >
                    Sign Out
                </button>

                {/* App Info */}
                <div className="text-center pt-8">
                    <p className="text-xs text-muted-foreground">
                        Hanna Scribe v2.0
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Voice-first clinical documentation
                    </p>
                </div>
            </div>
        </div>
    );
}
