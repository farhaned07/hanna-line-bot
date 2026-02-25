import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Copy, Pencil, CheckCheck, Download, Share2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { api } from '../api/client'
import { t } from '../i18n'

const SECTION_LABELS = {
    subjective: 'Subjective',
    objective: 'Objective',
    assessment: 'Assessment',
    plan: 'Plan'
}

const SECTION_ICONS = {
    subjective: '💬',
    objective: '🔬',
    assessment: '📋',
    plan: '📌'
}

const SECTION_GRADIENTS = {
    subjective: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    objective: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    assessment: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)',
    plan: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
}


export default function NoteView() {
    const { noteId } = useParams()
    const navigate = useNavigate()
    const [note, setNote] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showTranscript, setShowTranscript] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        loadNote()
    }, [noteId])

    const loadNote = async () => {
        try {
            const data = await api.getNote(noteId)
            setNote(data)
            if (data.session_id) {
                const sess = await api.getSession(data.session_id)
                setSession(sess)
            }
        } catch (err) {
            console.error('Failed to load note:', err)
            setNote(null)
        } finally {
            setLoading(false)
        }
    }

    const handleFinalize = async () => {
        try {
            await api.finalizeNote(noteId)
            setNote(prev => ({ ...prev, is_final: true, updated_at: new Date().toISOString() }))
        } catch (err) {
            setNote(prev => ({ ...prev, is_final: true, updated_at: new Date().toISOString() }))
        }
    }

    const handleCopy = async () => {
        const text = note.content_text || formatNoteText(note.content)
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownloadPdf = () => {
        api.downloadPdf(noteId)
    }

    const formatNoteText = (content) => {
        if (!content) return ''
        return Object.entries(content)
            .map(([key, val]) => `${SECTION_LABELS[key] || key}\n${val}`)
            .join('\n\n')
    }

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'just now'
        if (mins < 60) return `${mins}m ago`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours}h ago`
        return new Date(dateStr).toLocaleDateString()
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: 32, height: 32, borderRadius: '50%',
                        border: '3px solid #E5E7EB', borderTopColor: '#6366F1'
                    }}
                />
            </div>
        )
    }

    if (!note) {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', gap: 16 }}>
                <div style={{ fontSize: 48 }}>📄</div>
                <p style={{ color: '#6B7280', fontSize: 16, fontWeight: 500 }}>Note not found</p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '12px 28px', borderRadius: 12,
                        background: '#6366F1', color: '#fff',
                        fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                    }}
                >
                    Back to Home
                </button>
            </div>
        )
    }

    const content = note.content || {}

    return (
        <div style={{ minHeight: '100dvh', background: '#FAFAFA', paddingBottom: 110 }}>
            {/* Top Nav Bar */}
            <div className="safe-top" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px 16px'
            }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/')}
                    style={{
                        width: 40, height: 40, borderRadius: 14,
                        background: '#fff', border: '1px solid #F0F0F0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#374151',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
                    }}
                >
                    <ArrowLeft size={18} />
                </motion.button>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 20,
                        background: note.is_final
                            ? 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.15) 100%)'
                            : 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.15) 100%)',
                        fontSize: 12, fontWeight: 600,
                        border: `1px solid ${note.is_final ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                        color: note.is_final ? '#059669' : '#D97706'
                    }}
                >
                    {note.is_final && <Check size={12} />}
                    {note.is_final ? 'Clinician-reviewed' : 'Draft · Not reviewed'}
                </motion.div>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* AI Attribution */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
                >
                    <div style={{
                        width: 28, height: 28, borderRadius: 10,
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(99,102,241,0.3)'
                    }}>
                        <Sparkles size={14} color="#fff" />
                    </div>
                    <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, letterSpacing: '0.2px' }}>
                        Generated by Hanna AI · {timeAgo(note.created_at)}
                    </span>
                </motion.div>

                {/* Patient Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <h1 style={{
                        fontSize: 26, fontWeight: 800, color: '#111827',
                        letterSpacing: '-0.8px', lineHeight: 1.15
                    }}>
                        {session?.patient_name || 'Patient Note'}
                    </h1>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginTop: 6,
                        flexWrap: 'wrap'
                    }}>
                        {session?.patient_hn && (
                            <span style={{
                                fontSize: 12, color: '#6366F1', fontWeight: 600,
                                background: 'rgba(99,102,241,0.08)', padding: '3px 10px',
                                borderRadius: 8
                            }}>
                                HN {session.patient_hn}
                            </span>
                        )}
                        <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
                            {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span style={{
                            fontSize: 11, color: '#6366F1', fontWeight: 700,
                            letterSpacing: '0.5px'
                        }}>
                            {note.template_type?.toUpperCase()}
                        </span>
                    </div>
                </motion.div>

                {/* Divider */}
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #E5E7EB 20%, #E5E7EB 80%, transparent)', margin: '20px 0' }} />

                {/* SOAP Sections */}
                {Object.entries(SECTION_LABELS).map(([key, label], index) => {
                    if (!content[key]) return null
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ marginBottom: 20 }}
                        >
                            {/* Section Header */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10
                            }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 8,
                                    background: SECTION_GRADIENTS[key],
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14,
                                    boxShadow: `0 2px 8px ${key === 'subjective' ? 'rgba(102,126,234,0.3)' : key === 'objective' ? 'rgba(17,153,142,0.3)' : key === 'assessment' ? 'rgba(242,153,74,0.3)' : 'rgba(168,85,247,0.3)'}`
                                }}>
                                    {SECTION_ICONS[key]}
                                </div>
                                <h3 style={{
                                    fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '1.2px', color: '#374151'
                                }}>
                                    {label}
                                </h3>
                            </div>

                            {/* Section Content Card */}
                            <div style={{
                                background: '#fff',
                                borderRadius: 16,
                                padding: '16px 18px',
                                border: '1px solid #F3F4F6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                            }}>
                                <div style={{
                                    fontSize: 15, color: '#374151', lineHeight: 1.75,
                                    letterSpacing: '-0.1px'
                                }}
                                    dangerouslySetInnerHTML={{ __html: content[key] }}
                                />
                            </div>
                        </motion.div>
                    )
                })}

                {/* Free-form content */}
                {content.text && (
                    <div style={{
                        background: '#fff', borderRadius: 16,
                        padding: '16px 18px', marginBottom: 24,
                        border: '1px solid #F3F4F6',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    }}>
                        <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.75 }}
                            dangerouslySetInnerHTML={{ __html: content.text }}
                        />
                    </div>
                )}

                {/* Transcript Toggle */}
                {session?.transcript && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <button
                            onClick={() => setShowTranscript(!showTranscript)}
                            style={{
                                width: '100%', padding: '14px 16px',
                                background: '#fff', borderRadius: 14,
                                border: '1px solid #F3F4F6', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                marginBottom: 16,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            }}
                        >
                            <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>
                                {showTranscript ? 'Hide' : 'View'} transcript
                            </span>
                            {showTranscript ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
                        </button>
                        <AnimatePresence>
                            {showTranscript && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{
                                        overflow: 'hidden', padding: '16px',
                                        background: '#F9FAFB', borderRadius: 14,
                                        marginBottom: 16, border: '1px solid #F3F4F6'
                                    }}
                                >
                                    <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                        {session.transcript}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Bottom Actions */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '14px 20px',
                paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 14px)',
                background: 'rgba(250,250,250,0.85)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
            }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    {/* Copy */}
                    <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={handleCopy}
                        style={{
                            flex: 1, padding: '13px 12px', borderRadius: 14,
                            background: '#fff', border: '1px solid #E5E7EB',
                            color: copied ? '#059669' : '#374151',
                            fontWeight: 600, fontSize: 13, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
                        {copied ? 'Copied' : 'Copy'}
                    </motion.button>

                    {/* PDF */}
                    <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={handleDownloadPdf}
                        style={{
                            flex: 1, padding: '13px 12px', borderRadius: 14,
                            background: '#fff', border: '1px solid #E5E7EB',
                            color: '#374151',
                            fontWeight: 600, fontSize: 13, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        }}
                    >
                        <Download size={15} />
                        PDF
                    </motion.button>

                    {/* Edit or Finalize */}
                    {!note.is_final ? (
                        <>
                            <motion.button
                                whileTap={{ scale: 0.93 }}
                                onClick={() => navigate(`/edit/${noteId}`)}
                                style={{
                                    flex: 1, padding: '13px 12px', borderRadius: 14,
                                    background: '#fff', border: '1px solid #E5E7EB',
                                    color: '#374151',
                                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                }}
                            >
                                <Pencil size={14} />
                                Edit
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.93 }}
                                onClick={handleFinalize}
                                style={{
                                    flex: 1.2, padding: '13px 12px', borderRadius: 14,
                                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                    color: '#fff', border: 'none',
                                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                                }}
                            >
                                <Check size={14} />
                                Finalize
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.93 }}
                            onClick={() => navigate(`/edit/${noteId}`)}
                            style={{
                                flex: 1, padding: '13px 12px', borderRadius: 14,
                                background: '#fff', border: '1px solid #E5E7EB',
                                color: '#374151',
                                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                        >
                            <Pencil size={14} />
                            Amend
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    )
}
