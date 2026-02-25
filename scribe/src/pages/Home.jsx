import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Mic, Search, X, ChevronRight, FileText, Clock, CheckCircle2 } from 'lucide-react'
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
        <div style={{ minHeight: '100dvh', background: '#FAFAFA', paddingBottom: 90 }}>
            {/* Header */}
            <div className="safe-top" style={{ padding: '0 20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <p style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 500 }}>
                        {getGreeting()}
                    </p>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontWeight: 700, fontSize: 13, color: '#6366F1',
                        letterSpacing: '-0.3px'
                    }}>
                        <span style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            boxShadow: '0 0 8px rgba(99,102,241,0.5)'
                        }} />
                        hanna scribe
                    </div>
                </div>
                <h1 style={{
                    fontSize: 30, fontWeight: 800, color: '#111827',
                    letterSpacing: '-1px', lineHeight: 1.1
                }}>
                    {user?.display_name || user?.email || 'Doctor'}
                </h1>
            </div>

            {/* Search Bar */}
            <div style={{ padding: '0 20px', marginBottom: 28 }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{
                        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                        color: '#9CA3AF'
                    }} />
                    <input
                        type="text"
                        placeholder={t('home.commandBar')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '13px 40px 13px 40px',
                            borderRadius: 14, background: '#fff',
                            border: '1px solid #F0F0F0', fontSize: 14,
                            color: '#374151', outline: 'none',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#6366F1'
                            e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08), 0 1px 3px rgba(0,0,0,0.04)'
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#F0F0F0'
                            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'
                        }}
                    />
                    {searchQuery ? (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{
                                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                background: '#F3F4F6', border: 'none', cursor: 'pointer',
                                color: '#9CA3AF', width: 22, height: 22, borderRadius: 11,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <X size={12} />
                        </button>
                    ) : (
                        <Mic size={16} style={{
                            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                            color: '#6366F1'
                        }} />
                    )}
                </div>
            </div>

            {/* Sessions List */}
            <div style={{ padding: '0 20px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                height: 80, borderRadius: 16,
                                background: 'linear-gradient(90deg, #F3F4F6 25%, #FAFAFA 50%, #F3F4F6 75%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s ease-in-out infinite'
                            }} />
                        ))}
                    </div>
                ) : Object.keys(groups).length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{ textAlign: 'center', padding: '60px 32px 32px' }}
                    >
                        <div style={{
                            width: 80, height: 80, margin: '0 auto 20px',
                            borderRadius: 24,
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.12) 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(99,102,241,0.08)'
                        }}>
                            <Mic size={32} style={{ color: '#6366F1' }} />
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 8, letterSpacing: '-0.3px' }}>
                            {t('home.noSessions')}
                        </h3>
                        <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.5, maxWidth: 240, margin: '0 auto' }}>
                            {t('home.noSessionsSub')}
                        </p>
                    </motion.div>
                ) : (
                    Object.entries(groups).map(([label, items], groupIndex) => (
                        <div key={label} style={{ marginBottom: 24 }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                marginBottom: 10, paddingLeft: 4
                            }}>
                                <h2 style={{
                                    fontSize: 12, fontWeight: 700, color: '#9CA3AF',
                                    textTransform: 'uppercase', letterSpacing: '0.8px',
                                    marginBottom: 0
                                }}>
                                    {label}
                                </h2>
                                <span style={{
                                    fontSize: 11, color: '#9CA3AF', fontWeight: 600,
                                    background: '#F3F4F6', padding: '2px 8px', borderRadius: 10
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
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSessionTap(session)}
                                            style={{
                                                width: '100%', display: 'flex', alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '14px 16px',
                                                background: '#fff',
                                                borderRadius: 16, cursor: 'pointer',
                                                textAlign: 'left', border: '1px solid #F0F0F0',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                                                transition: 'box-shadow 0.2s, border-color 0.2s',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                                                {/* Status Icon */}
                                                <div style={{
                                                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                                                    background: isFinalized
                                                        ? 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.15) 100%)'
                                                        : 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.15) 100%)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {isFinalized
                                                        ? <CheckCircle2 size={18} color="#059669" />
                                                        : <Clock size={18} color="#D97706" />
                                                    }
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{
                                                        fontWeight: 600, fontSize: 15, color: '#111827',
                                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap', letterSpacing: '-0.2px'
                                                    }}>
                                                        {session.patient_name || 'Unknown Patient'}
                                                    </p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                                        <span style={{
                                                            fontSize: 11, fontWeight: 600,
                                                            color: isFinalized ? '#059669' : '#D97706',
                                                            background: isFinalized
                                                                ? 'rgba(16,185,129,0.08)'
                                                                : 'rgba(245,158,11,0.08)',
                                                            padding: '2px 8px', borderRadius: 6
                                                        }}>
                                                            {isFinalized ? 'Finalized' : 'In Progress'}
                                                        </span>
                                                        <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                                                            {session.template_type?.toUpperCase() || 'SOAP'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                                                <span style={{ fontSize: 12, color: '#9CA3AF', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                                                    {new Date(session.created_at).toLocaleTimeString([], {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                                <ChevronRight size={14} style={{ color: '#D1D5DB' }} />
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
                whileHover={{ scale: 1.05 }}
                onClick={handleFabClick}
                aria-label="New session"
                style={{
                    position: 'fixed',
                    bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
                    right: 20,
                    width: 56, height: 56, borderRadius: 18,
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(99,102,241,0.4), 0 2px 4px rgba(99,102,241,0.2)',
                    border: 'none', cursor: 'pointer', zIndex: 50,
                }}
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
