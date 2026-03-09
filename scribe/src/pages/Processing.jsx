import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { api } from '../api/client'
import { t } from '../i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

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

            setStage(0)
            await new Promise(r => setTimeout(r, 600))

            setStage(1)
            const { text: transcript } = await api.transcribe(audioBlob)
            await api.updateSession(sessionId, { transcript, status: 'transcribed' })

            const hasThai = /[ก-๙]/.test(transcript)
            const hasBangla = /[ঀ-৿]/.test(transcript)
            if (hasThai) setDetectedLang('Thai 🇹🇭')
            else if (hasBangla) setDetectedLang('Bangla 🇧🇩')
            else setDetectedLang('English 🇬🇧')

            setStage(2)
            const note = await api.generateNote(sessionId)
            navigate(`/note/${note.id}`, { replace: true })
        } catch (err) {
            setError(err.message || 'Processing failed')
        }
    }

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-background p-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            {/* Orb with rings */}
            <div className="relative mb-14">
                {/* Outer ring */}
                {!error && (
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.05, 0.15] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-[30px] -left-[30px] w-[160px] h-[160px] rounded-full border border-primary/20"
                    />
                )}
                {/* Inner ring */}
                {!error && (
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.1, 0.25] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        className="absolute -top-[15px] -left-[15px] w-[130px] h-[130px] rounded-full border border-primary/15"
                    />
                )}
                {/* Orb */}
                <motion.div
                    animate={error
                        ? { scale: [1, 1.02, 1] }
                        : { scale: [1, 1.06, 1] }
                    }
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className={`w-[100px] h-[100px] rounded-full ${
                        error 
                            ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 shadow-red-glow' 
                            : 'orb-core'
                    }`}
                />
            </div>

            {error ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-xs"
                >
                    <h2 className="text-lg font-bold text-foreground mb-2">
                        Processing failed
                    </h2>
                    <p className="text-sm text-muted-foreground mb-8">
                        {error}
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="h-10 px-4 border-slate-700 text-muted-foreground"
                        >
                            <Home size={15} className="mr-2" />
                            Home
                        </Button>
                        <Button
                            onClick={() => { setError(null); setStage(0); processAudio() }}
                            className="h-10 px-4 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-primary-glow"
                        >
                            <RotateCcw size={14} className="mr-2" />
                            Try Again
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center w-full max-w-sm">
                    <motion.p
                        key={stage}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-bold text-foreground mb-2 -tracking-wide"
                    >
                        {STAGES[stage]?.label}
                    </motion.p>

                    <motion.p
                        key={`sub-${stage}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm text-muted-foreground mb-2 font-normal"
                    >
                        {STAGES[stage]?.sublabel}
                    </motion.p>

                    <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-4 bg-primary/15">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-semibold text-muted-foreground">
                            ~{STAGES[stage]?.timeEstimate}
                        </span>
                    </Badge>

                    {stage >= 1 && detectedLang && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/8 mb-4"
                        >
                            <span className="text-xs text-muted-foreground">
                                Detected:
                            </span>
                            <span className="text-xs font-semibold text-foreground">
                                {detectedLang}
                            </span>
                        </motion.div>
                    )}

                    {STAGES[stage]?.detail && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xs text-muted-foreground mb-6 max-w-xs"
                        >
                            {STAGES[stage]?.detail}
                        </motion.p>
                    )}

                    <div className="flex gap-1.5 justify-center">
                        {STAGES.map((s, i) => (
                            <motion.div
                                key={s.key}
                                animate={{
                                    width: i === stage ? 32 : 8,
                                    background: i <= stage
                                        ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-hover)) 100%)'
                                        : 'rgba(255,255,255,0.1)'
                                }}
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="h-2 rounded-md"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
