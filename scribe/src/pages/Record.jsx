import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pause, Play, Square, AlertCircle } from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useRecorder } from '@/hooks/useRecorder';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useToast } from '@/hooks/useToast';
import MobileLayout from '@/components/layout/MobileLayout';

export default function Record() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const recorder = useRecorder();
    const haptic = useHapticFeedback();
    const { toast } = useToast();
    const [session, setSession] = useState(null);
    const [showDiscard, setShowDiscard] = useState(false);
    const [micError, setMicError] = useState(false);
    const [showTips, setShowTips] = useState(true);

    useEffect(() => {
        loadSession();
        recorder.start().catch(err => {
            setMicError(true);
            haptic.error();
            toast({
                title: 'Microphone Access Required',
                description: 'Please allow microphone access to record consultations',
                variant: 'destructive',
            });
        });
        return () => recorder.reset();
    }, []);

    const loadSession = async () => {
        try {
            const data = await sessionsApi.get(sessionId);
            setSession(data);
        } catch (err) {
            setSession({ patient_name: 'Patient', template_type: 'soap' });
        }
    };

    const handleDone = useCallback(async () => {
        haptic.recordingStop();
        recorder.stop();

        const waitForBlob = () => new Promise((resolve) => {
            const check = setInterval(() => {
                if (recorder.audioBlobRef.current) {
                    clearInterval(check);
                    resolve(recorder.audioBlobRef.current);
                }
            }, 50);
            setTimeout(() => { clearInterval(check); resolve(null); }, 3000);
        });

        const blob = await waitForBlob();
        navigate(`/processing/${sessionId}`, {
            state: { audioBlob: blob },
            replace: true
        });
    }, [recorder, sessionId, navigate, haptic]);

    const handleDiscard = () => {
        recorder.reset();
        navigate('/', { replace: true });
    };

    const getDurationHint = () => {
        if (recorder.duration > 300) return { text: 'Consider wrapping up', color: 'text-critical' };
        if (recorder.duration > 120) return { text: 'Perfect length', color: 'text-success' };
        if (recorder.duration > 30) return { text: 'Keep talking...', color: 'text-muted-foreground' };
        return { text: 'Start speaking', color: 'text-muted-foreground' };
    };

    const durationHint = getDurationHint();

    return (
        <MobileLayout showTabBar={false}>
            <div className="min-h-dvh flex flex-col bg-background relative overflow-hidden">
                {/* Mic Permission Error */}
                <AnimatePresence>
                    {micError && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl p-6 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-20 h-20 rounded-2xl bg-critical/10 flex items-center justify-center mb-6"
                            >
                                <AlertCircle size={40} className="text-critical" />
                            </motion.div>
                            <h2 className="text-xl font-bold text-white mb-2">
                                Microphone Access Required
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-8">
                                Please allow microphone access to record consultations.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        setMicError(false);
                                        recorder.start().catch(() => setMicError(true));
                                    }}
                                    className="h-11 px-6"
                                >
                                    Try Again
                                </Button>
                                <Button
                                    onClick={() => navigate('/', { replace: true })}
                                    variant="outline"
                                    className="h-11 px-6"
                                >
                                    Go Back
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Top Bar */}
                <div className="safe-top flex items-center justify-between px-6 pb-4 pt-6 relative z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowDiscard(true)}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/60"
                        aria-label="Close recording"
                    >
                        <X size={18} />
                    </Button>

                    <div className="flex items-center gap-2">
                        <span className="recording-dot w-2 h-2 rounded-full bg-critical inline-block" />
                        <span className="text-white/85 text-sm font-semibold tabular-nums font-sans">
                            {recorder.formattedDuration}
                        </span>
                    </div>

                    <div className="w-10" />
                </div>

                {/* Patient Info */}
                <div className="text-center px-6 mb-4 relative z-10">
                    <h2 className="text-white font-semibold text-base">
                        {session?.patient_name || 'Patient'}
                    </h2>
                    {session?.patient_hn && (
                        <p className="text-white/40 text-xs mt-1">
                            HN {session.patient_hn}
                        </p>
                    )}
                </div>

                {/* Enhanced Orb (NO waveform - orb only) */}
                <div className="flex-1 flex items-center justify-center relative">
                    <div className="relative orb-container">
                        {/* Ripple rings */}
                        {recorder.isRecording && !recorder.isPaused && (
                            <>
                                <motion.div
                                    animate={{ scale: [1, 3], opacity: [0.25, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                                    className="absolute inset-0 rounded-full border border-primary/20"
                                />
                                <motion.div
                                    animate={{ scale: [1, 2.5], opacity: [0.2, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                                    className="absolute inset-0 rounded-full border border-primary/15"
                                />
                            </>
                        )}

                        {/* Main orb with enhanced glow */}
                        <motion.div
                            animate={
                                recorder.isPaused
                                    ? { scale: [1, 1.02, 1] }
                                    : { scale: [1, 1.08, 1] }
                            }
                            transition={{
                                duration: recorder.isPaused ? 3 : 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="orb-core"
                        />

                        {/* Outer glow ring */}
                        {recorder.isRecording && !recorder.isPaused && (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
                            />
                        )}
                    </div>
                </div>

                {/* Status */}
                <div className="text-center mb-3 relative z-10">
                    <Badge variant={recorder.isPaused ? 'secondary' : 'default'} className="text-xs">
                        {recorder.isPaused ? 'Paused' : 'Listening...'}
                    </Badge>
                </div>

                {/* Large Timer Display */}
                <div className="text-center mb-6 px-6 relative z-10">
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

                {/* Recording Tips (Collapsible) */}
                {showTips && (
                    <Card className="mx-6 mb-6 bg-white/4 border-white/6 relative z-10">
                        <div className="py-4 px-5 text-center relative">
                            <button
                                onClick={() => setShowTips(false)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors"
                                aria-label="Dismiss tips"
                            >
                                <X size={14} />
                            </button>
                            <p className="text-white/50 text-xs leading-relaxed">
                                🎤 Speak clearly and naturally. Transcription happens after you stop.
                            </p>
                        </div>
                    </Card>
                )}

                {/* Controls */}
                <div className="safe-bottom flex items-center justify-center gap-8 pb-10 pt-2 relative z-10">
                    {/* Pause/Resume */}
                    <Button
                        variant="outline"
                        size="icon-lg"
                        onClick={recorder.isPaused ? recorder.resume : recorder.pause}
                        className="w-16 h-16 rounded-full bg-white/8 border-white/12 text-white/80 hover:bg-white/10 hover:text-white"
                        aria-label={recorder.isPaused ? 'Resume recording' : 'Pause recording'}
                    >
                        {recorder.isPaused ? <Play size={24} /> : <Pause size={24} />}
                    </Button>

                    {/* Done */}
                    <Button
                        onClick={handleDone}
                        size="icon-lg"
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary-hover text-white border-none shadow-lg shadow-primary-glow hover:shadow-xl transition-all"
                        aria-label="Stop recording and process"
                    >
                        <Square size={24} className="fill-white" />
                    </Button>

                    {/* Spacer for balance */}
                    <div className="w-16" />
                </div>

                {/* Discard Dialog */}
                <AnimatePresence>
                    {showDiscard && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
                            onClick={() => setShowDiscard(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                                className="bg-background-elevated rounded-2xl p-6 max-w-xs w-full mx-8 shadow-2xl border border-border-default"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <p className="font-semibold text-center mb-5 text-white text-base">
                                    Discard this recording?
                                </p>
                                <div className="flex gap-2.5">
                                    <Button
                                        onClick={() => setShowDiscard(false)}
                                        variant="secondary"
                                        className="flex-1 h-11"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleDiscard}
                                        variant="destructive"
                                        className="flex-1 h-11"
                                    >
                                        Discard
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </MobileLayout>
    );
}
