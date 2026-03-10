import { useState } from 'react';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import MobileLayout from '@/components/layout/MobileLayout';

/**
 * Settings Page - Mobile optimized
 */
export default function Settings() {
    const user = authApi.getUser();
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        if (confirm('Sign out of Hanna Scribe?')) {
            authApi.logout();
            window.location.reload();
        }
    };

    return (
        <MobileLayout>
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
                <Card className="border-border-default bg-card">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Profile
                        </h2>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">
                                    {user?.display_name?.[0]?.toUpperCase() || 'D'}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-white text-lg">
                                    {user?.display_name || 'Demo Clinician'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {user?.email || 'demo@hanna.care'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Usage Stats */}
                <Card className="border-border-default bg-card">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Usage This Month
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Notes created</span>
                                    <Badge variant="primary">7/10</Badge>
                                </div>
                                <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full" style={{ width: '70%' }} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Free plan resets on April 1
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* App Info */}
                <Card className="border-border-default bg-card">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            About
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Version</span>
                                <span className="text-white">2.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Build</span>
                                <span className="text-white">2026.03.10</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sign Out */}
                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full h-12"
                >
                    Sign Out
                </Button>

                {/* Bottom spacing for tab bar */}
                <div className="h-8" />
            </div>
        </MobileLayout>
    );
}
