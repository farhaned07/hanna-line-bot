import { useState } from 'react';
import { FileText, Users, Clock, AlertTriangle } from 'lucide-react';
import { handoverApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Handover() {
    const [handover, setHandover] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateHandover = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await handoverApi.generate();
            setHandover(data);
        } catch (err) {
            setError(err.message || 'Failed to generate handover');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-dvh bg-background relative">
                {/* Ambient Background Glow */}
                <div className="ambient-glow" />

                {/* Header */}
                <div className="safe-top px-6 pt-8 pb-6 relative z-10">
                    <h1 className="text-3xl font-bold text-white gradient-text mb-2">
                        Shift Handover
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Generate end-of-shift summary for incoming team
                    </p>
                </div>

                {/* Content */}
                <div className="px-6 relative z-10">
                    {!handover && !loading && (
                        <Card className="border-border bg-card p-8 text-center">
                            <CardContent className="space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                                    <FileText size={32} className="text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">
                                    No Handover Generated
                                </h3>
                                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                    Generate a comprehensive shift handover summary from today's patient encounters
                                </p>
                                <Button
                                    onClick={generateHandover}
                                    className="mt-4 h-12 px-8 bg-gradient-to-r from-primary to-primary-hover"
                                >
                                    Generate Handover
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {loading && (
                        <div className="text-center py-16">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Generating handover summary...</p>
                        </div>
                    )}

                    {handover && (
                        <div className="space-y-6">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="border-border bg-card">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Users size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">
                                                    {handover.patient_count || 0}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Patients Seen
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border bg-card">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-critical/10 flex items-center justify-center">
                                                <AlertTriangle size={20} className="text-critical" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">
                                                    {handover.urgent_count || 0}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Urgent Follow-ups
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Shift Info */}
                            <Card className="border-border bg-card">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Clock size={18} className="text-muted-foreground" />
                                        <span className="text-sm font-semibold text-white">
                                            {handover.shift_label || 'Today\'s Shift'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Generated by {handover.clinician || 'Clinician'}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Patients List */}
                            {handover.patients && handover.patients.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-white">
                                        Patient Summary
                                    </h3>
                                    {handover.patients.map((patient, index) => (
                                        <Card key={index} className="border-border bg-card">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-semibold text-white">
                                                            {patient.name || `Patient ${index + 1}`}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {patient.summary || 'No summary available'}
                                                        </p>
                                                    </div>
                                                    {patient.urgent && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Urgent
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={generateHandover}
                                    className="flex-1"
                                >
                                    Regenerate
                                </Button>
                                <Button
                                    onClick={() => window.print()}
                                    className="flex-1 bg-gradient-to-r from-primary to-primary-hover"
                                >
                                    Print / PDF
                                </Button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-critical/10 border border-critical/20 rounded-xl text-critical text-sm text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
