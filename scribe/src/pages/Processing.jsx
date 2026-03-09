import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Mic, FileText, Sparkles } from 'lucide-react';
import { transcriptionApi, notesApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import DashboardLayout from '@/components/layout/DashboardLayout';

const STEPS = [
    { id: 'upload', label: 'Uploading audio', icon: Mic },
    { id: 'transcribe', label: 'Transcribing conversation', icon: FileText },
    { id: 'generate', label: 'Generating clinical note', icon: Sparkles },
];

export default function Processing() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(null);
    const [noteId, setNoteId] = useState(null);

    useEffect(() => {
        const audioBlob = location.state?.audioBlob;
        if (!audioBlob) {
            setError('No audio data found');
            return;
        }
        processAudio(audioBlob);
    }, []);

    const processAudio = async (audioBlob) => {
        try {
            // Step 1: Upload & Transcribe
            setCurrentStep(0);
            const transcription = await transcriptionApi.transcribe(audioBlob);
            
            // Step 2: Generate Note
            setCurrentStep(1);
            const note = await notesApi.generateNote(sessionId, 'soap');
            
            setCurrentStep(2);
            setNoteId(note.id);
            
            // Navigate to note editor after short delay
            setTimeout(() => {
                navigate(`/scribe/app/note/${note.id}`, { replace: true });
            }, 800);
            
        } catch (err) {
            console.error('Processing error:', err);
            setError(err.message || 'Processing failed. Please try again.');
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-dvh bg-background flex items-center justify-center p-4 relative">
                {/* Ambient Background Glow */}
                <div className="ambient-glow" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="inline-block mb-6"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary-glow/50">
                                <Loader2 size={32} className="text-white animate-spin" />
                            </div>
                        </motion.div>
                        
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Processing Consultation
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            AI is generating your clinical note
                        </p>
                    </div>

                    {/* Progress Card */}
                    <Card className="border-border bg-card shadow-xl">
                        <CardContent className="p-6 space-y-4">
                            {STEPS.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{
                                        opacity: index <= currentStep ? 1 : 0.4,
                                        x: 0,
                                    }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                        index < currentStep
                                            ? 'bg-success text-white'
                                            : index === currentStep
                                            ? 'bg-primary text-white shadow-lg shadow-primary-glow/50'
                                            : 'bg-background-tertiary text-muted-foreground'
                                    }`}>
                                        {index < currentStep ? (
                                            <CheckCircle2 size={20} />
                                        ) : (
                                            <step.icon size={20} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${
                                            index <= currentStep ? 'text-white' : 'text-muted-foreground'
                                        }`}>
                                            {step.label}
                                        </p>
                                        {index === currentStep && index < STEPS.length - 1 && (
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 2 }}
                                                className="h-0.5 bg-gradient-to-r from-primary to-transparent mt-2"
                                            />
                                        )}
                                    </div>
                                    {index === currentStep && index < STEPS.length - 1 && (
                                        <Loader2 size={16} className="text-primary animate-spin" />
                                    )}
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-critical/10 border border-critical/20 rounded-xl text-critical text-sm text-center"
                        >
                            <p className="font-medium mb-2">Processing Failed</p>
                            <p>{error}</p>
                            <Button
                                onClick={() => navigate(`/scribe/app/record/${sessionId}`)}
                                variant="destructive"
                                className="mt-3 h-10 px-6"
                            >
                                Try Again
                            </Button>
                        </motion.div>
                    )}

                    {/* Success - Navigate to note */}
                    {currentStep === 2 && noteId && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-success text-sm font-medium">
                                Note generated successfully!
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">
                                Redirecting to editor...
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
