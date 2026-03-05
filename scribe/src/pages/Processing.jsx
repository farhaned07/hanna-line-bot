import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { api } from '../api/client'
import { t } from '../i18n'

const STAGES = [
    { 
        key: 'upload', 
        label: 'Uploading audio...', 
        sublabel: 'Preparing your recording',
        timeEstimate: '1-2 seconds'
    },
    { 
        key: 'transcribe', 
        label: 'Transcribing...', 
        sublabel: 'AI is converting speech to text',
        timeEstimate: '10-30 seconds',
        detail: 'Recognizing medical terms in Thai, Bangla & English'
    },
    { 
        key: 'generate', 
        label: 'Generating SOAP note...', 
        sublabel: 'Creating structured clinical note',
        timeEstimate: '5-15 seconds',
        detail: 'Organizing into Subjective, Objective, Assessment, Plan'
    }
]

export default function Processing() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [stage, setStage] = useState(0)
    const [error, setError] = useState(null)
    const [startTime] = useState(Date.now())
    const [detectedLang, setDetectedLang] = useState(null)
    const audioBlobRef = useState(() => location.state?.audioBlob)[0]

    useEffect(() => {
        processAudio()
    }, [])

    const processAudio = async () => {
        try {
            const audioBlob = audioBlobRef
            if (!audioBlob) {
                setError('No audio recording found. Please try recording again.')
                return
            }

            // Stage 0: Upload
            setStage(0)
            await new Promise(r => setTimeout(r, 600))

            // Stage 1: Transcribe
            setStage(1)
            const { text: transcript } = await api.transcribe(audioBlob)
            await api.updateSession(sessionId, { transcript, status: 'transcribed' })
            
            // Detect language from transcript
            const hasThai = /[ก-๙]/.test(transcript)
            const hasBangla = /[ঀ-৿]/.test(transcript)
            if (hasThai) setDetectedLang('Thai 🇹🇭')
            else if (hasBangla) setDetectedLang('Bangla 🇧🇩')
            else setDetectedLang('English 🇬🇧')

            // Stage 2: Generate note
            setStage(2)
            const note = await api.generateNote(sessionId)
            navigate(`/note/${note.id}`, { replace: true })
        } catch (err) {
            console.error('Processing failed:', err)
            setError(err.message || 'Processing failed')
        }
    }

    return (
        <div style={{
            minHeight: '100dvh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#0F0F1A',
            padding: 32
        }}>
            {/* Background glow */}
            <div style={{
                position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            {/* Orb with rings */}
            <div style={{ position: 'relative', marginBottom: 56 }}>
                {/* Outer ring */}
                {!error && (
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.05, 0.15] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute', top: -30, left: -30,
                            width: 160, height: 160, borderRadius: '50%',
                            border: '1px solid rgba(99,102,241,0.2)',
                        }}
                    />
                )}
                {/* Inner ring */}
                {!error && (
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.1, 0.25] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        style={{
                            position: 'absolute', top: -15, left: -15,
                            width: 130, height: 130, borderRadius: '50%',
                            border: '1px solid rgba(99,102,241,0.15)',
                        }}
                    />
                )}
                {/* Orb */}
                <motion.div
                    animate={error
                        ? { scale: [1, 1.02, 1] }
                        : { scale: [1, 1.06, 1] }
                    }
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        width: 100, height: 100, borderRadius: '50%',
                        background: error
                            ? 'radial-gradient(circle at 38% 35%, #FCA5A5, #EF4444 55%, #B91C1C)'
                            : 'radial-gradient(circle at 38% 35%, #A5B4FC, #6366F1 45%, #4338CA 80%)',
                        boxShadow: error
                            ? '0 0 60px rgba(239,68,68,0.3), 0 0 120px rgba(239,68,68,0.1)'
                            : '0 0 60px rgba(99,102,241,0.35), 0 0 120px rgba(99,102,241,0.1)',
                    }}
                />
            </div>

            {error ? (
                /* Error State */
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', maxWidth: 300 }}
                >
                    <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#F9FAFB', letterSpacing: '-0.3px' }}>
                        Processing failed
                    </p>
                    <p style={{ fontSize: 14, marginBottom: 32, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                        {error}
                    </p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            style={{
                                padding: '12px 24px', borderRadius: 12,
                                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 14,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                            }}
                        >
                            <Home size={15} />
                            Home
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setError(null); setStage(0); processAudio() }}
                            style={{
                                padding: '12px 24px', borderRadius: 12,
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                border: 'none', color: '#fff', fontWeight: 600, fontSize: 14,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                boxShadow: '0 4px 14px rgba(99,102,241,0.35)'
                            }}
                        >
                            <RotateCcw size={14} />
                            Try Again
                        </motion.button>
                    </div>
                </motion.div>
            ) : (
                /* Progress */
                <div style={{ textAlign: 'center', width: '100%', maxWidth: 320 }}>
                    {/* Main label */}
                    <motion.p
                        key={stage}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: '#F9FAFB', letterSpacing: '-0.5px' }}
                    >
                        {STAGES[stage]?.label}
                    </motion.p>
                    
                    {/* Sublabel */}
                    <motion.p
                        key={`sub-${stage}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontWeight: 400 }}
                    >
                        {STAGES[stage]?.sublabel}
                    </motion.p>
                    
                    {/* Time estimate */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', borderRadius: 16,
                        background: 'rgba(99,102,241,0.15)',
                        marginBottom: 16
                    }}>
                        <div style={{
                            width: 6, height: 6, borderRadius: 3,
                            background: '#6366F1',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                            ~{STAGES[stage]?.timeEstimate}
                        </span>
                    </div>
                    
                    {/* Language detected (stage 1+) */}
                    {stage >= 1 && detectedLang && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '6px 12px', borderRadius: 12,
                                background: 'rgba(255,255,255,0.08)',
                                marginBottom: 16
                            }}
                        >
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                                Detected:
                            </span>
                            <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>
                                {detectedLang}
                            </span>
                        </motion.div>
                    )}
                    
                    {/* Detail text */}
                    {STAGES[stage]?.detail && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 24, maxWidth: 280, margin: '0 auto' }}
                        >
                            {STAGES[stage]?.detail}
                        </motion.p>
                    )}
                    </motion.p>

                    {/* Progress Steps */}
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        {STAGES.map((s, i) => (
                            <motion.div
                                key={s.key}
                                animate={{
                                    width: i === stage ? 32 : 8,
                                    background: i <= stage
                                        ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                                        : 'rgba(255,255,255,0.1)'
                                }}
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                style={{
                                    height: 8, borderRadius: 4,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
