import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MoreHorizontal, FileText, ChevronDown, ChevronUp, Check, Copy, Pencil, CheckCheck } from 'lucide-react'
import { api } from '../api/client'
import { t } from '../i18n'

const SECTION_LABELS = {
    subjective: 'Subjective',
    objective: 'Objective',
    assessment: 'Assessment',
    plan: 'Plan'
}

const SECTION_COLORS = {
    subjective: '#4A90D9',
    objective: '#34C759',
    assessment: '#FF9500',
    plan: '#AF52DE'
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
            // Dev mode: just toggle
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

    if (loading) {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: 28, height: 28, border: '3px solid var(--color-accent)',
                    borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!note) {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--color-ink2)' }}>Note not found</p>
            </div>
        )
    }

    const content = note.content || {}

    return (
        <div style={{ minHeight: '100dvh', background: '#F5F5F5', paddingBottom: 100 }}>
            {/* Top Bar */}
            <div className="safe-top" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px 12px'
            }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        width: 36, height: 36, borderRadius: 12,
                        background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--color-ink2)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                >
                    <ArrowLeft size={18} />
                </button>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 20,
                    background: note.is_final ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)',
                    fontSize: 12, fontWeight: 600,
                    color: note.is_final ? 'var(--color-green)' : 'var(--color-orange)'
                }}>
                    {note.is_final && <Check size={12} />}
                    {note.is_final ? t('note.finalized') : t('note.draft')}
                </div>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* Attribution */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{
                        width: 22, height: 22, borderRadius: 11,
                        background: 'var(--color-accent-soft)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--color-accent)' }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-ink3)' }}>
                        {t('note.generatedBy')} · {timeAgo(note.created_at)}
                    </span>
                </div>

                {/* Patient Info */}
                <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.5px' }}>
                    {session?.patient_name || 'Unknown Patient'}
                </h1>
                <p style={{ fontSize: 13, color: 'var(--color-ink3)', marginTop: 4 }}>
                    {session?.patient_hn ? `HN ${session.patient_hn} · ` : ''}
                    {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' · '}
                    {note.template_type?.toUpperCase()}
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--color-border)', margin: '20px 0' }} />

                {/* SOAP Sections */}
                {Object.entries(SECTION_LABELS).map(([key, label]) => {
                    if (!content[key]) return null
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginBottom: 24 }}
                        >
                            <h3 style={{
                                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '1px', marginBottom: 10,
                                color: SECTION_COLORS[key] || 'var(--color-ink2)'
                            }}>
                                {label}
                            </h3>
                            <div style={{
                                borderLeft: `3px solid ${SECTION_COLORS[key] || 'var(--color-border)'}`,
                                paddingLeft: 16
                            }}>
                                <p style={{
                                    fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.7,
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {content[key]}
                                </p>
                            </div>
                        </motion.div>
                    )
                })}

                {/* Free-form content */}
                {content.text && (
                    <div style={{ borderLeft: '3px solid var(--color-border)', paddingLeft: 16, marginBottom: 24 }}>
                        <p style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {content.text}
                        </p>
                    </div>
                )}

                {/* View Transcript */}
                {session?.transcript && (
                    <>
                        <button
                            onClick={() => setShowTranscript(!showTranscript)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '10px 14px', borderRadius: 10,
                                background: 'var(--color-card)', border: 'none',
                                cursor: 'pointer', fontSize: 13, color: 'var(--color-ink2)',
                                fontWeight: 500, marginBottom: 12
                            }}
                        >
                            <FileText size={14} />
                            {t('note.viewTranscript')}
                            {showTranscript ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        <AnimatePresence>
                            {showTranscript && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden', marginBottom: 16 }}
                                >
                                    <div style={{
                                        padding: 16, borderRadius: 12,
                                        background: 'var(--color-card)',
                                        fontSize: 14, color: 'var(--color-ink2)', lineHeight: 1.7
                                    }}>
                                        {session.transcript}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>

            {/* Bottom Actions */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '12px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(0,0,0,0.06)'
            }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    {!note.is_final && (
                        <button
                            onClick={() => navigate(`/note/${noteId}/edit`)}
                            className="btn-secondary"
                        >
                            <Pencil size={14} />
                            {t('note.edit')}
                        </button>
                    )}
                    <button onClick={handleDownloadPdf} className="btn-secondary">
                        <FileText size={14} />
                        {t('note.pdf')}
                    </button>
                    <button onClick={handleCopy} className="btn-secondary">
                        {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : t('note.copy')}
                    </button>
                    {!note.is_final && (
                        <button
                            onClick={handleFinalize}
                            style={{
                                flex: 1, padding: 13, borderRadius: 12,
                                background: 'var(--color-accent)', color: 'white',
                                fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                            }}
                        >
                            <Check size={14} />
                            {t('note.finalize')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function timeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
}
