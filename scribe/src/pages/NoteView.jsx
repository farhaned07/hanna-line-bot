import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Copy, Pencil, CheckCheck, Download, Share2, ChevronDown, ChevronUp, Sparkles, Users, AlertTriangle } from 'lucide-react'
import { api } from '../api/client'
import { t } from '../i18n'
import FollowupEnrollmentModal from '../components/FollowupEnrollmentModal'
import MedicalDisclaimer from '../components/MedicalDisclaimer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

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
    subjective: 'from-indigo-500 to-purple-600',
    objective: 'from-emerald-500 to-teal-600',
    assessment: 'from-amber-500 to-yellow-600',
    plan: 'from-violet-500 to-indigo-600'
}

export default function NoteView() {
    const { noteId } = useParams()
    const navigate = useNavigate()
    const { toast } = useToast()
    const [note, setNote] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showTranscript, setShowTranscript] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showFollowupModal, setShowFollowupModal] = useState(false)
    const [justFinalized, setJustFinalized] = useState(false)

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
            setNote(null)
        } finally {
            setLoading(false)
        }
    }

    const handleFinalize = async () => {
        try {
            await api.finalizeNote(noteId)
            setNote(prev => ({ ...prev, is_final: true, updated_at: new Date().toISOString() }))
            setJustFinalized(true)
            setTimeout(() => setShowFollowupModal(true), 500)
        } catch (err) {
            setNote(prev => ({ ...prev, is_final: true, updated_at: new Date().toISOString() }))
            setJustFinalized(true)
            setTimeout(() => setShowFollowupModal(true), 500)
        }
    }

    const handleCopy = async () => {
        const text = note.content_text || formatNoteText(note.content)
        await navigator.clipboard.writeText(text)
        setCopied(true)
        toast({
            title: "Copied to clipboard",
            description: "The note has been copied.",
            duration: 2000
        })
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

    const renderContent = (text) => {
        if (!text) return ''
        if (/<[a-z][\s\S]*>/i.test(text)) return text
        return text.replace(/\n/g, '<br>')
    }

    if (loading) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-border border-t-primary rounded-full"
                />
            </div>
        )
    }

    if (!note) {
        return (
            <div className="min-h-dvh flex flex-col items-center justify-center bg-background p-6 text-center">
                <div className="text-5xl mb-4">📄</div>
                <p className="text-muted-foreground text-base mb-6">Note not found</p>
                <Button onClick={() => navigate('/')}>
                    Back to Home
                </Button>
            </div>
        )
    }

    const content = note.content || {}

    return (
        <div className="min-h-dvh bg-background pb-28">
            {/* Top Nav Bar */}
            <div className="safe-top flex items-center justify-between px-4 pb-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-lg border-border bg-card hover:bg-accent text-foreground shadow-sm"
                >
                    <ArrowLeft size={18} />
                </Button>
                
                <Badge
                    variant={note.is_final ? 'success' : 'warning'}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold"
                >
                    {note.is_final && <Check size={12} />}
                    {note.is_final ? 'Clinician-reviewed' : 'Draft · Not reviewed'}
                </Badge>
            </div>

            <div className="px-5">
                {/* AI Attribution */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 mb-4"
                >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-primary-glow">
                        <Sparkles size={14} className="text-primary-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium tracking-wide">
                        Generated by Hanna AI · {timeAgo(note.created_at)}
                    </span>
                </motion.div>

                {/* Patient Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <h1 className="text-2xl font-extrabold text-foreground -tracking-wide leading-tight">
                        {session?.patient_name || 'Patient Note'}
                    </h1>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {session?.patient_hn && (
                            <Badge variant="primary" className="text-xs font-semibold px-2.5 py-0.5">
                                HN {session.patient_hn}
                            </Badge>
                        )}
                        <span className="text-xs text-muted-foreground font-medium">
                            {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <Badge variant="primary" className="text-[11px] font-bold tracking-wide">
                            {note.template_type?.toUpperCase()}
                        </Badge>
                    </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-5" />

                {/* SOAP Sections */}
                {Object.entries(SECTION_LABELS).map(([key, label], index) => {
                    if (!content[key]) return null
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.08 }}
                            className="mb-5"
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-2.5 mb-2.5">
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${SECTION_GRADIENTS[key]} flex items-center justify-center text-base shadow-lg`}>
                                    {SECTION_ICONS[key]}
                                </div>
                                <h3 className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {label}
                                </h3>
                            </div>

                            {/* Section Content Card */}
                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-4 pt-4">
                                    <div
                                        className="text-sm text-foreground leading-relaxed -tracking-wide"
                                        dangerouslySetInnerHTML={{ __html: renderContent(content[key]) }}
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}

                {/* Free-form content */}
                {content.text && (
                    <Card className="border-border bg-card shadow-sm mb-6">
                        <CardContent className="p-4 pt-4">
                            <div
                                className="text-sm text-foreground leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: renderContent(content.text) }}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Transcript Toggle */}
                {session?.transcript && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mb-4"
                    >
                        <Button
                            variant="outline"
                            onClick={() => setShowTranscript(!showTranscript)}
                            className="w-full h-11 justify-between border-border bg-card hover:bg-accent text-foreground"
                        >
                            <span className="text-sm font-medium">
                                {showTranscript ? 'Hide' : 'View'} transcript
                            </span>
                            {showTranscript ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                        
                        <AnimatePresence>
                            {showTranscript && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-2 p-4 bg-accent/50 rounded-lg border border-border"
                                >
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {session.transcript}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Medical Disclaimer */}
            <div className="px-5 pb-4">
                <MedicalDisclaimer />
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom,0px),14px)] bg-background/85 backdrop-blur-xl border-t border-border/50">
                <div className="flex gap-2">
                    {/* Copy */}
                    <Button
                        variant="outline"
                        onClick={handleCopy}
                        className="flex-1 h-11 border-border bg-card hover:bg-accent text-foreground"
                    >
                        {copied ? <CheckCheck size={15} className="mr-1.5 text-success" /> : <Copy size={15} className="mr-1.5" />}
                        {copied ? 'Copied' : 'Copy'}
                    </Button>

                    {/* PDF */}
                    <Button
                        variant="outline"
                        onClick={handleDownloadPdf}
                        className="flex-1 h-11 border-border bg-card hover:bg-accent text-foreground"
                    >
                        <Download size={15} className="mr-1.5" />
                        PDF
                    </Button>

                    {/* Edit or Finalize */}
                    {!note.is_final ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/note/${noteId}/edit`)}
                                className="flex-1 h-11 border-border bg-card hover:bg-accent text-foreground"
                            >
                                <Pencil size={14} className="mr-1.5" />
                                Edit
                            </Button>
                            <Button
                                onClick={handleFinalize}
                                className="flex-[1.2] h-11 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground border-none shadow-primary-glow"
                            >
                                <Check size={14} className="mr-1.5" />
                                Finalize
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/note/${noteId}/edit`)}
                            className="flex-1 h-11 border-border bg-card hover:bg-accent text-foreground"
                        >
                            <Pencil size={14} className="mr-1.5" />
                            Amend
                        </Button>
                    )}
                </div>
            </div>

            {/* Follow-up Enrollment Modal */}
            {showFollowupModal && session && (
                <FollowupEnrollmentModal
                    session={session}
                    onClose={() => setShowFollowupModal(false)}
                />
            )}
        </div>
    )
}
