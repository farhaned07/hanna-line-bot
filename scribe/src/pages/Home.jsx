import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, X, FileText, Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api/client'
import { t, getGreeting } from '../i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import TabBar from '../components/TabBar'
import NewSessionSheet from '../components/NewSessionSheet'
import UpgradeModal from '../components/UpgradeModal'
import SwipeableSessionCard from '../components/SwipeableSessionCard'

export default function Home() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showNewSession, setShowNewSession] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [billingStats, setBillingStats] = useState(null)

    useEffect(() => {
        loadSessions()
        loadBilling()
    }, [])

    const loadBilling = async () => {
        try {
            const data = await api.getBillingStatus()
            setBillingStats(data)
        } catch (err) {
            console.error('Failed to load billing status', err)
        }
    }

    const loadSessions = async () => {
        try {
            const data = await api.getSessions()
            setSessions(data.sessions || [])
        } catch (err) {
            // Silently fail
        } finally {
            setLoading(false)
        }
    }

    const groupByDate = (sessions) => {
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        const groups = {}
        sessions.forEach(s => {
            const date = new Date(s.created_at).toDateString()
            const label = date === today ? t('home.today')
                : date === yesterday ? t('home.yesterday')
                    : new Date(s.created_at).toLocaleDateString()
            if (!groups[label]) groups[label] = []
            groups[label].push(s)
        })
        return groups
    }

    const filtered = searchQuery
        ? sessions.filter(s =>
            s.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.patient_hn?.includes(searchQuery)
        )
        : sessions

    const groups = groupByDate(filtered)

    const handleSessionCreated = (session) => {
        setShowNewSession(false)
        navigate(`/record/${session.id}`)
    }

    const handleFabClick = () => {
        if (billingStats?.plan === 'free' && billingStats?.notes_count_this_month >= 10) {
            setShowUpgradeModal(true)
        } else {
            setShowNewSession(true)
        }
    }

    const handleSessionTap = (session) => {
        if (session.notes?.length > 0) {
            navigate(`/note/${session.notes[0].id}`)
        } else {
            navigate(`/record/${session.id}`)
        }
    }

    const handleDeleteSession = async (sessionId) => {
        try {
            await api.deleteSession(sessionId)
            loadSessions()
        } catch (err) {
            console.error('Delete failed:', err)
        }
    }

    const handleExportSession = async (sessionId) => {
        try {
            const session = await api.getSession(sessionId)
            if (session.notes?.[0]?.id) {
                navigate(`/note/${session.notes[0].id}`)
            }
        } catch (err) {
            console.error('Export failed:', err)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="px-6 pt-12 pb-6 border-b border-border bg-background">
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <span className="text-sm font-semibold text-muted-foreground">Hanna Scribe</span>
                </div>
                
                <div className="mb-6">
                    <p className="text-xs text-muted-foreground mb-1">
                        {getGreeting()}
                    </p>
                    <h1 className="text-2xl font-semibold text-foreground">
                        {user?.display_name || user?.email?.split('@')[0] || 'Doctor'}
                    </h1>
                </div>

                {/* Stats */}
                {billingStats && (
                    <Card className="border-border bg-card shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Notes</p>
                                    <p className="text-xl font-semibold text-foreground">
                                        {billingStats.notes_count || 0}
                                        <span className="text-xs font-normal text-muted-foreground ml-1">
                                            {billingStats.plan === 'free' ? '/ 10' : ''}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Search */}
            <div className="px-6 py-4">
                <Card className="border-border bg-card shadow-lg">
                    <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                            <Search className="w-5 h-5 text-muted-foreground ml-2" />
                            <Input
                                type="text"
                                placeholder="Search patients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-10 bg-background text-foreground placeholder:text-muted-foreground"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="w-8 h-8 rounded-full bg-background hover:bg-accent flex items-center justify-center transition-colors"
                                >
                                    <X className="w-3 h-3 text-muted-foreground" />
                                </button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content */}
            <ScrollArea className="h-[calc(100vh-280px)] px-6 py-4">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="h-20 bg-card border-border animate-pulse" />
                        ))}
                    </div>
                ) : Object.keys(groups).length === 0 ? (
                    <ModernEmptyState onCreate={() => setShowNewSession(true)} />
                ) : (
                    <div className="space-y-6 pb-6">
                        {Object.entries(groups).map(([label, items]) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        {label}
                                    </h2>
                                    <Badge variant="secondary" className="text-xs font-semibold bg-card text-muted-foreground border border-border">
                                        {items.length}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    {items.map(session => (
                                        <SwipeableSessionCard
                                            key={session.id}
                                            session={session}
                                            onTap={handleSessionTap}
                                            onDelete={handleDeleteSession}
                                            onExport={handleExportSession}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* FAB */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 25 }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleFabClick}
                className="fixed bottom-28 right-6 w-16 h-16 bg-blue-400 hover:bg-blue-400/90 rounded-lg flex items-center justify-center shadow-lg transition-all z-50"
            >
                <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
            </motion.button>

            {/* Modals */}
            <AnimatePresence>
                {showNewSession && <NewSessionSheet onClose={() => setShowNewSession(false)} onCreated={handleSessionCreated} />}
                {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
            </AnimatePresence>

            <TabBar />
        </div>
    )
}

// Modern Empty State
function ModernEmptyState({ onCreate }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-4"
        >
            <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="relative w-full h-full bg-card rounded-2xl flex items-center justify-center border border-border">
                    <FileText className="w-12 h-12 text-muted-foreground" />
                </div>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-2">
                No clinical notes yet
            </h3>
            <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
                Create your first AI-powered SOAP note in under 60 seconds
            </p>

            <Button
                onClick={onCreate}
                className="h-12 px-8 bg-blue-400 hover:bg-blue-400/90 text-white font-semibold shadow-lg"
            >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Note
            </Button>
        </motion.div>
    )
}
