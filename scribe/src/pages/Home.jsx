import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Settings, Mic, ChevronRight, Sparkles } from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatRelative } from '@/lib/utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NewSessionModal from '@/components/scribe/NewSessionModal';

export default function Home() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewSession, setShowNewSession] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const data = await sessionsApi.list();
            setSessions(data.sessions || []);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = searchQuery
        ? sessions.filter(s =>
            s.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.patient_hn?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : sessions;

    return (
        <DashboardLayout>
            <div className="min-h-dvh bg-background pb-24 relative">
                {/* Ambient Background Glow */}
                <div className="ambient-glow" />

                {/* Header */}
                <div className="safe-top px-6 pt-8 pb-6 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white gradient-text">
                                Hanna Scribe
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Voice-first clinical documentation
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/scribe/app/settings')}
                            className="w-11 h-11 rounded-xl border-border bg-background-secondary hover:bg-white/5 hover:-translate-y-0.5 transition-all"
                        >
                            <Settings size={20} className="text-muted-foreground" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-5">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search patients by name or HN..."
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background-secondary text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all input-focus"
                        />
                    </div>

                    {/* New Session Button */}
                    <Button
                        onClick={() => setShowNewSession(true)}
                        className="w-full h-14 bg-gradient-to-r from-primary to-primary-hover text-white font-semibold shadow-lg shadow-primary-glow/50 hover:shadow-xl hover:shadow-primary-glow/60 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <Plus size={20} className="mr-2" />
                        New Session
                    </Button>
                </div>

                {/* Recent Sessions */}
                <div className="px-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white">
                            Recent Sessions
                        </h2>
                        <Badge variant="secondary" className="text-xs">
                            {filtered.length} sessions
                        </Badge>
                    </div>

                    {loading ? (
                        // Loading skeleton
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 rounded-xl bg-background-secondary shimmer" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        // Empty state
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-background-secondary flex items-center justify-center mx-auto mb-5">
                                <FileText size={40} className="text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {searchQuery ? 'No sessions found' : 'No sessions yet'}
                            </h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                {searchQuery
                                    ? 'Try adjusting your search query'
                                    : 'Start your first voice session to create a clinical note'}
                            </p>
                            {!searchQuery && (
                                <Button
                                    onClick={() => setShowNewSession(true)}
                                    className="mt-6 h-11 px-6 bg-gradient-to-r from-primary to-primary-hover"
                                >
                                    <Plus size={18} className="mr-2" />
                                    New Session
                                </Button>
                            )}
                        </motion.div>
                    ) : (
                        // Session list
                        <div className="space-y-3">
                            {filtered.map((session, index) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        className="border-border bg-card hover:bg-white/5 transition-all duration-200 cursor-pointer card-hover group"
                                        onClick={() => {
                                            const note = session.notes?.[0];
                                            if (note) {
                                                navigate(`/scribe/app/note/${note.id}`);
                                            } else {
                                                navigate(`/scribe/app/record/${session.id}`);
                                            }
                                        }}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary-glow/50 group-hover:shadow-xl group-hover:shadow-primary-glow/60 group-hover:-translate-y-0.5 transition-all duration-200">
                                                        <FileText size={20} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white group-hover:text-primary transition-colors">
                                                            {session.patient_name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {session.patient_hn || 'No HN'} • {formatRelative(session.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {session.notes?.length > 0 && (
                                                        <Badge variant="success" className="text-xs">
                                                            <Sparkles size={12} className="mr-1" />
                                                            Note
                                                        </Badge>
                                                    )}
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                            <ChevronRight size={16} className="text-primary" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* New Session Modal */}
            <NewSessionModal
                isOpen={showNewSession}
                onClose={() => setShowNewSession(false)}
                onSubmit={(data) => {
                    setShowNewSession(false);
                    navigate(`/scribe/app/record/${data.sessionId}`);
                }}
            />
        </DashboardLayout>
    );
}
