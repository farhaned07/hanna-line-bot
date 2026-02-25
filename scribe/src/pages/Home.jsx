import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Mic, Search, X, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api/client'
import { t, getGreeting } from '../i18n'
import TabBar from '../components/TabBar'
import NewSessionSheet from '../components/NewSessionSheet'
import UpgradeModal from '../components/UpgradeModal'

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
            // Silently fail — will show empty state
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

    return (
        <div style={{ minHeight: '100dvh', background: '#F5F5F5', paddingBottom: 90 }}>
            {/* Header */}
            <div className="safe-top" style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontSize: 14, color: 'var(--color-ink3)', fontWeight: 400 }}>
                        {getGreeting()}
                    </p>
                    <div className="hanna-mark">
                        <span className="dot" />
                        hanna scribe
                    </div>
                </div>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.8px' }}>
                    {user?.display_name || user?.email || 'Doctor'}
                </h1>
            </div>

            {/* Command Bar */}
            <div style={{ padding: '0 20px', marginBottom: 28 }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{
                        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--color-ink3)'
                    }} />
                    <input
                        type="text"
                        placeholder={t('home.commandBar')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="scribe-input"
                        style={{ paddingLeft: 40, paddingRight: 40 }}
                    />
                    {searchQuery ? (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{
                                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink3)'
                            }}
                        >
                            <X size={16} />
                        </button>
                    ) : (
                        <Mic size={16} style={{
                            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                            color: 'var(--color-accent)'
                        }} />
                    )}
                </div>
            </div>

            {/* Sessions List */}
            <div style={{ padding: '0 20px' }}>
                {loading ? (
                    /* Skeleton loading */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: 72, borderRadius: 16 }} />
                        ))}
                    </div>
                ) : Object.keys(groups).length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="empty-state"
                    >
                        <div className="icon-container">
                            <Mic size={32} style={{ color: 'var(--color-accent)' }} />
                        </div>
                        <h3>{t('home.noSessions')}</h3>
                        <p>{t('home.noSessionsSub')}</p>
                    </motion.div>
                ) : (
                    Object.entries(groups).map(([label, items], groupIndex) => (
                        <div key={label} style={{ marginBottom: 28 }}>
                            <div style={{
                                display: 'flex', alignItems: 'baseline', gap: 8,
                                marginBottom: 12, paddingLeft: 4
                            }}>
                                <h2 className="section-label" style={{ marginBottom: 0 }}>
                                    {label}
                                </h2>
                                <span style={{
                                    fontSize: 11, color: 'var(--color-ink3)', fontWeight: 500,
                                    background: 'var(--color-card)', padding: '2px 8px', borderRadius: 10
                                }}>
                                    {items.length}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {items.map((session, i) => {
                                    const isFinalized = session.notes?.[0]?.is_final
                                    return (
                                        <motion.button
                                            key={session.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (groupIndex * 0.05) + (i * 0.04), ease: [0.16, 1, 0.3, 1] }}
                                            onClick={() => handleSessionTap(session)}
                                            className="session-card"
                                            style={{
                                                borderLeft: `3px solid ${isFinalized ? 'var(--color-green)' : 'var(--color-orange)'}`,
                                            }}
                                        >
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.2px' }}>
                                                    {session.patient_name || 'Unknown Patient'}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                                    <span className={`badge ${isFinalized ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: 10 }}>
                                                        {isFinalized ? 'Finalized' : 'In Progress'}
                                                    </span>
                                                    <span style={{ fontSize: 12, color: 'var(--color-ink3)' }}>
                                                        {session.template_type?.toUpperCase() || 'SOAP'}
                                                    </span>
                                                    {session.patient_hn && (
                                                        <span style={{ fontSize: 12, color: 'var(--color-ink3)' }}>
                                                            HN {session.patient_hn}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 16 }}>
                                                <span style={{ fontSize: 12, color: 'var(--color-ink3)', fontVariantNumeric: 'tabular-nums' }}>
                                                    {new Date(session.created_at).toLocaleTimeString([], {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                                <ChevronRight size={14} style={{ color: 'var(--color-ink3)', opacity: 0.5 }} />
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FAB */}
            <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleFabClick}
                className="fab"
                aria-label="New session"
            >
                <Plus size={24} strokeWidth={2.5} />
            </motion.button>

            {/* New Session Bottom Sheet */}
            <AnimatePresence>
                {showNewSession && (
                    <NewSessionSheet
                        onClose={() => setShowNewSession(false)}
                        onCreated={handleSessionCreated}
                    />
                )}
                {showUpgradeModal && (
                    <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
                )}
            </AnimatePresence>

            <TabBar />
        </div>
    )
}
