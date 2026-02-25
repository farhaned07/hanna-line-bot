import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api/client'
import { t } from '../i18n'

const STAGES = [
    { key: 'upload', label: 'Uploading audio...' },
    { key: 'transcribe', label: 'Transcribing with Whisper...' },
    { key: 'generate', label: 'Generating clinical note...' }
]

export default function Processing() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [stage, setStage] = useState(0)
    const [error, setError] = useState(null)
    const [bgProgress, setBgProgress] = useState(0)

    useEffect(() => {
        processAudio()
    }, [])

    // Animate background from dark to white
    useEffect(() => {
        const interval = setInterval(() => {
            setBgProgress(prev => Math.min(prev + 0.5, 100))
        }, 50)
        return () => clearInterval(interval)
    }, [])

    const processAudio = async () => {
        try {
            const audioBlob = location.state?.audioBlob
            if (!audioBlob) {
                setError('No audio recording found. Please try recording again.')
                return
            }

            // Stage 1: Transcribe
            setStage(0)
            setStage(1)
            const { text: transcript } = await api.transcribe(audioBlob)

            // Update session with transcript
            await api.updateSession(sessionId, { transcript, status: 'transcribed' })

            // Stage 2: Generate note
            setStage(2)
            const note = await api.generateNote(sessionId)

            // Navigate to note view
            navigate(`/note/${note.id}`, { replace: true })
        } catch (err) {
            console.error('Processing failed:', err)
            setError(err.message || 'Processing failed')
        }
    }

    const progress = ((stage + 1) / STAGES.length) * 100

    return (
        <div style={{
            minHeight: '100dvh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(180deg, 
                hsl(235, 30%, ${12 + bgProgress * 0.88}%) 0%, 
                hsl(0, 0%, ${12 + bgProgress * 0.88}%) 100%)`,
            transition: 'background 0.3s',
            padding: 20
        }}>
            {/* Orb */}
            <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: bgProgress > 70
                        ? 'radial-gradient(circle at 38% 35%, #7EC4FF, #4A90D9 50%, #357ABD)'
                        : 'radial-gradient(circle at 38% 35%, #7EC4FF, #4A90D9 45%, #357ABD 70%, #2A5F9E)',
                    boxShadow: `0 0 ${60 + bgProgress * 0.4}px rgba(74,144,217,${0.3 + bgProgress * 0.002})`,
                    marginBottom: 48
                }}
            />

            {error ? (
                /* Error State */
                <div style={{ textAlign: 'center' }}>
                    <p style={{
                        fontSize: 17, fontWeight: 600, marginBottom: 8,
                        color: bgProgress > 50 ? 'var(--color-ink)' : 'white'
                    }}>
                        Something went wrong
                    </p>
                    <p style={{
                        fontSize: 14, marginBottom: 24,
                        color: bgProgress > 50 ? 'var(--color-ink2)' : 'rgba(255,255,255,0.6)'
                    }}>
                        {error}
                    </p>
                    <button
                        onClick={() => { setError(null); setStage(0); processAudio() }}
                        className="btn-primary"
                        style={{ width: 'auto', padding: '12px 32px', borderRadius: 12 }}
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                /* Progress */
                <div style={{ textAlign: 'center', width: '100%', maxWidth: 280 }}>
                    <p style={{
                        fontSize: 16, fontWeight: 600, marginBottom: 16,
                        color: bgProgress > 50 ? 'var(--color-ink)' : 'white'
                    }}>
                        {STAGES[stage]?.label}
                    </p>

                    {/* Progress bar */}
                    <div style={{
                        width: '100%', height: 4, borderRadius: 2,
                        background: bgProgress > 50 ? 'var(--color-card)' : 'rgba(255,255,255,0.1)'
                    }}>
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            style={{
                                height: '100%', borderRadius: 2,
                                background: 'var(--color-accent)'
                            }}
                        />
                    </div>

                    {/* Stage indicators */}
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16
                    }}>
                        {STAGES.map((s, i) => (
                            <div key={s.key} style={{
                                width: 6, height: 6, borderRadius: 3,
                                background: i <= stage ? 'var(--color-accent)' : (
                                    bgProgress > 50 ? 'var(--color-border)' : 'rgba(255,255,255,0.15)'
                                ),
                                transition: 'background 0.3s'
                            }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
