import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pause, Play, Square } from 'lucide-react'
import { useRecorder } from '../hooks/useRecorder'
import { api } from '../api/client'
import { t } from '../i18n'

export default function Record() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const recorder = useRecorder()
    const [session, setSession] = useState(null)
    const [transcript, setTranscript] = useState('')
    const [showDiscard, setShowDiscard] = useState(false)
    const [micError, setMicError] = useState(false)

    useEffect(() => {
        loadSession()
        recorder.start().catch(err => {
            console.error('Mic access denied:', err)
            setMicError(true)
        })
        return () => recorder.reset()
    }, [])

    const loadSession = async () => {
        try {
            const data = await api.getSession(sessionId)
            setSession(data)
        } catch (err) {
            console.error('Failed to load session:', err)
            setSession({ patient_name: 'Patient', template_type: 'soap' })
        }
    }

    const handleDone = useCallback(async () => {
        recorder.stop()
        // Wait for audioBlob to be set by the recorder's onstop callback (via ref)
        const waitForBlob = () => new Promise((resolve) => {
            const check = setInterval(() => {
                if (recorder.audioBlobRef.current) {
                    clearInterval(check)
                    resolve(recorder.audioBlobRef.current)
                }
            }, 50)
            // Timeout after 3s
            setTimeout(() => { clearInterval(check); resolve(null) }, 3000)
        })
        const blob = await waitForBlob()
        navigate(`/processing/${sessionId}`, {
            state: { audioBlob: blob },
            replace: true
        })
    }, [recorder, sessionId, navigate])

    const handleDiscard = () => {
        recorder.reset()
        navigate('/', { replace: true })
    }

    return (
        <div style={{
            minHeight: '100dvh', display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(180deg, #0F0F1A 0%, #131328 30%, #161630 100%)'
        }}>
            {/* Mic Permission Error */}
            {micError && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'linear-gradient(180deg, #0F0F1A, #131328)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: 32, textAlign: 'center'
                }}>
                    <div style={{ fontSize: 48, marginBottom: 20 }}>🎙️</div>
                    <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                        Microphone Access Required
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6, maxWidth: 300, marginBottom: 32 }}>
                        Please allow microphone access in your browser settings to record consultations.
                    </p>
                    <button
                        onClick={() => { setMicError(false); recorder.start().catch(() => setMicError(true)) }}
                        style={{
                            padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                            marginBottom: 12, boxShadow: '0 4px 14px rgba(99,102,241,0.35)'
                        }}
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/', { replace: true })}
                        style={{
                            padding: '12px 24px', borderRadius: 12, background: 'transparent',
                            color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 14,
                            border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer'
                        }}
                    >
                        Go Back
                    </button>
                </div>
            )}
            {/* Top Bar */}
            <div className="safe-top" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 20px 12px'
            }}>
                <button
                    onClick={() => setShowDiscard(true)}
                    style={{
                        width: 36, height: 36, borderRadius: 18,
                        background: 'rgba(255,255,255,0.08)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'rgba(255,255,255,0.6)'
                    }}
                >
                    <X size={18} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="recording-dot" style={{
                        width: 8, height: 8, borderRadius: 4, background: '#FF3B30',
                        display: 'inline-block'
                    }} />
                    <span style={{
                        color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-sans)'
                    }}>
                        {recorder.formattedDuration}
                    </span>
                </div>
                <div style={{ width: 36 }} /> {/* Spacer for centering */}
            </div>

            {/* Patient Info */}
            <div style={{ textAlign: 'center', padding: '0 20px', marginBottom: 32 }}>
                <h2 style={{ color: 'white', fontWeight: 600, fontSize: 18 }}>
                    {session?.patient_name || 'Patient'}
                </h2>
                {session?.patient_hn && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>
                        HN {session.patient_hn}
                    </p>
                )}
            </div>

            {/* Orb */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative'
            }}>
                <div style={{ position: 'relative' }}>
                    {/* Ripple rings */}
                    {recorder.isRecording && !recorder.isPaused && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 3], opacity: [0.25, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                                style={{
                                    position: 'absolute', inset: -20,
                                    borderRadius: '50%', border: '1px solid rgba(99,102,241,0.2)'
                                }}
                            />
                            <motion.div
                                animate={{ scale: [1, 2.5], opacity: [0.2, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                                style={{
                                    position: 'absolute', inset: -20,
                                    borderRadius: '50%', border: '1px solid rgba(99,102,241,0.15)'
                                }}
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
                        style={{
                            width: 140, height: 140, borderRadius: '50%',
                            position: 'relative', zIndex: 10,
                            background: 'radial-gradient(circle at 38% 35%, #A5B4FC, #6366F1 45%, #4F46E5 70%, #4338CA)',
                            boxShadow: '0 0 80px rgba(99,102,241,0.4), 0 0 160px rgba(99,102,241,0.15), inset 0 0 30px rgba(255,255,255,0.1)'
                        }}
                    />
                </div>
            </div>

            {/* Status */}
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 500 }}>
                    {recorder.isPaused ? t('recording.paused') : t('recording.listening')}
                </p>
            </div>

            {/* Transcript Area */}
            <div style={{
                margin: '0 20px 20px', maxHeight: 130, overflowY: 'auto',
                borderRadius: 16, padding: '16px 18px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)'
            }}>
                {transcript ? (
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>
                        {transcript}
                    </p>
                ) : (
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14, fontStyle: 'italic' }}>
                        {recorder.isRecording ? 'Transcript will appear here...' : ''}
                    </p>
                )}
            </div>

            {/* Controls */}
            <div className="safe-bottom" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 32, paddingBottom: 40, paddingTop: 8
            }}>
                {/* Pause/Resume */}
                <button
                    onClick={recorder.isPaused ? recorder.resume : recorder.pause}
                    style={{
                        width: 52, height: 52, borderRadius: 26,
                        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'rgba(255,255,255,0.8)',
                        transition: 'background 0.2s'
                    }}
                >
                    {recorder.isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>

                {/* Done */}
                <button
                    onClick={handleDone}
                    style={{
                        width: 64, height: 64, borderRadius: 32,
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'white',
                        boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                        transition: 'transform 0.15s'
                    }}
                >
                    <Square size={20} fill="white" />
                </button>

                {/* Spacer for symmetry */}
                <div style={{ width: 52 }} />
            </div>

            {/* Discard Dialog */}
            <AnimatePresence>
                {showDiscard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 50,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            style={{
                                background: 'white', borderRadius: 20, padding: 24,
                                margin: '0 32px', maxWidth: 320, width: '100%',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                            }}
                        >
                            <p style={{
                                fontWeight: 600, textAlign: 'center', marginBottom: 20,
                                fontSize: 16, color: 'var(--color-ink)'
                            }}>
                                {t('recording.discard')}
                            </p>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                    onClick={() => setShowDiscard(false)}
                                    className="btn-secondary" style={{ flex: 1 }}
                                >
                                    {t('recording.discardCancel')}
                                </button>
                                <button
                                    onClick={handleDiscard}
                                    style={{
                                        flex: 1, padding: 13, borderRadius: 12,
                                        background: 'var(--color-red)', color: 'white',
                                        fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer'
                                    }}
                                >
                                    {t('recording.discardConfirm')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
