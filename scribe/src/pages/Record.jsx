import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pause, Play, Square, Mic } from 'lucide-react'
import ErrorBoundary from '../components/ErrorBoundary'
import RecordingErrorFallback from '../components/RecordingErrorFallback'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRecorder } from '../hooks/useRecorder'
import { useHapticFeedback } from '../hooks/useHapticFeedback'
import { api } from '../api/client'
import { t } from '../i18n'

function RecordContent() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const recorder = useRecorder()
    const haptic = useHapticFeedback()
    const [session, setSession] = useState(null)
    const [showDiscard, setShowDiscard] = useState(false)
    const [micError, setMicError] = useState(false)

    useEffect(() => {
        loadSession()
        recorder.start().catch(err => {
            setMicError(true)
            haptic.error()
        })
        return () => recorder.reset()
    }, [])

    const loadSession = async () => {
        try {
            const data = await api.getSession(sessionId)
            setSession(data)
        } catch (err) {
            setSession({ patient_name: 'Patient', template_type: 'soap' })
        }
    }

    const handleDone = useCallback(async () => {
        haptic.recordingStop()
        recorder.stop()
        const waitForBlob = () => new Promise((resolve) => {
            const check = setInterval(() => {
                if (recorder.audioBlobRef.current) {
                    clearInterval(check)
                    resolve(recorder.audioBlobRef.current)
                }
            }, 50)
            setTimeout(() => { clearInterval(check); resolve(null) }, 3000)
        })
        const blob = await waitForBlob()
        navigate(`/processing/${sessionId}`, {
            state: { audioBlob: blob },
            replace: true
        })
    }, [recorder, sessionId, navigate, haptic])

    const handleDiscard = () => {
        recorder.reset()
        navigate('/', { replace: true })
    }

    const getDurationHint = () => {
        if (recorder.duration > 300) return { text: 'Consider wrapping up', color: 'text-destructive' }
        if (recorder.duration > 120) return { text: 'Perfect length', color: 'text-warning' }
        if (recorder.duration > 30) return { text: 'Keep talking...', color: 'text-muted-foreground' }
        return { text: 'Start speaking', color: 'text-muted-foreground' }
    }

    const durationHint = getDurationHint()

    return (
        <div className="min-h-dvh flex flex-col bg-gradient-to-b from-background via-background to-slate-900">
            {/* Mic Permission Error */}
            {micError && (
                <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-gradient-to-b from-background to-slate-900 p-8 text-center">
                    <div className="text-5xl mb-5">🎙️</div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                        Microphone Access Required
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-8">
                        Please allow microphone access in your browser settings to record consultations.
                    </p>
                    <Button
                        onClick={() => { setMicError(false); recorder.start().catch(() => setMicError(true)) }}
                        className="mb-3 h-11 px-8 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground font-semibold shadow-lg"
                    >
                        Try Again
                    </Button>
                    <Button
                        onClick={() => navigate('/', { replace: true })}
                        variant="outline"
                        className="h-10 px-6 border-slate-700 text-muted-foreground"
                    >
                        Go Back
                    </Button>
                </div>
            )}

            {/* Top Bar */}
            <div className="safe-top flex items-center justify-between px-5 pb-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDiscard(true)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/60"
                >
                    <X size={18} />
                </Button>
                
                <div className="flex items-center gap-2">
                    <span className="recording-dot w-2 h-2 rounded-full bg-red-500 inline-block" />
                    <span className="text-white/85 text-sm font-semibold tabular-nums font-sans">
                        {recorder.formattedDuration}
                    </span>
                </div>
                
                <div className="w-9" /> {/* Spacer for centering */}
            </div>

            {/* Patient Info */}
            <div className="text-center px-5 mb-8">
                <h2 className="text-white font-semibold text-base">
                    {session?.patient_name || 'Patient'}
                </h2>
                {session?.patient_hn && (
                    <p className="text-white/40 text-xs mt-1">
                        HN {session.patient_hn}
                    </p>
                )}
            </div>

            {/* Orb */}
            <div className="flex-1 flex items-center justify-center relative">
                <div className="relative">
                    {/* Ripple rings */}
                    {recorder.isRecording && !recorder.isPaused && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 3], opacity: [0.25, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                                className="absolute inset--5 rounded-full border border-primary/20"
                            />
                            <motion.div
                                animate={{ scale: [1, 2.5], opacity: [0.2, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                                className="absolute inset--5 rounded-full border border-primary/15"
                            />
                        </>
                    )}

                    {/* Main orb */}
                    <motion.div
                        animate={
                            recorder.isPaused
                                ? { scale: [1, 1.02, 1] }
                                : { scale: [1, 1.06, 1] }
                        }
                        transition={{
                            duration: recorder.isPaused ? 3 : 2,
                            repeat: Infinity, ease: 'easeInOut'
                        }}
                        className="orb-core"
                    />
                </div>
            </div>

            {/* Status */}
            <div className="text-center mb-3">
                <p className="text-white/45 text-xs font-medium">
                    {recorder.isPaused ? t('recording.paused') : t('recording.listening')}
                </p>
            </div>

            {/* Large Timer Display */}
            <div className="text-center mb-6 px-5">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-6xl font-extrabold text-white tabular-nums -tracking-wider text-shadow-lg"
                >
                    {recorder.formattedDuration}
                </motion.div>
                {/* Duration hint */}
                <div className={`text-xs font-semibold mt-2 ${durationHint.color}`}>
                    {durationHint.text}
                </div>
            </div>

            {/* Recording Tips */}
            <Card className="mx-5 mb-5 bg-white/4 border-white/6">
                <CardContent className="py-4 px-5 text-center">
                    <p className="text-white/50 text-xs leading-relaxed">
                        🎤 Speak clearly and naturally. Transcription happens after you stop.
                    </p>
                </CardContent>
            </Card>

            {/* Controls */}
            <div className="safe-bottom flex items-center justify-center gap-8 pb-10 pt-2">
                {/* Pause/Resume */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={recorder.isPaused ? recorder.resume : recorder.pause}
                    className="w-13 h-13 rounded-full bg-white/8 border-white/12 text-white/80 hover:bg-white/10"
                >
                    {recorder.isPaused ? <Play size={20} /> : <Pause size={20} />}
                </Button>

                {/* Done */}
                <Button
                    onClick={handleDone}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-hover text-white border-none shadow-primary-glow hover:shadow-primary-glow-hover transition-transform"
                    size="icon"
                >
                    <Square size={20} className="fill-white" />
                </Button>

                {/* Spacer for symmetry */}
                <div className="w-13" />
            </div>

            {/* Discard Dialog */}
            <AnimatePresence>
                {showDiscard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md"
                        onClick={() => setShowDiscard(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            className="bg-card rounded-2xl p-6 max-w-xs w-full mx-8 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="font-semibold text-center mb-5 text-foreground text-base">
                                {t('recording.discard')}
                            </p>
                            <div className="flex gap-2.5">
                                <Button
                                    onClick={() => setShowDiscard(false)}
                                    variant="secondary"
                                    className="flex-1 h-10"
                                >
                                    {t('recording.discardCancel')}
                                </Button>
                                <Button
                                    onClick={handleDiscard}
                                    variant="destructive"
                                    className="flex-1 h-10"
                                >
                                    {t('recording.discardConfirm')}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Export with Error Boundary
export default function Record() {
    return (
        <ErrorBoundary 
            componentName="Record"
            fallback={RecordingErrorFallback}
        >
            <RecordContent />
        </ErrorBoundary>
    )
}
