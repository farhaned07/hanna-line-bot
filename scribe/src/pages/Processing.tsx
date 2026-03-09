import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload, Sparkles, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'

type ProcessingStep = 'uploading' | 'transcribing' | 'generating' | 'complete' | 'error'

const steps = [
  { id: 'uploading', label: 'Uploading audio', icon: Upload },
  { id: 'transcribing', label: 'Transcribing speech', icon: Sparkles },
  { id: 'generating', label: 'Generating SOAP note', icon: FileText },
]

export function Processing() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('uploading')
  const [error, setError] = useState<string | null>(null)
  const [noteId, setNoteId] = useState<string | null>(null)
  const processingRef = useRef(false)

  useEffect(() => {
    if (!sessionId || processingRef.current) return
    processingRef.current = true

    const processRecording = async () => {
      try {
        // Get audio blob from sessionStorage
        const audioDataUrl = sessionStorage.getItem(`audio_${sessionId}`)
        if (!audioDataUrl) {
          throw new Error('Audio recording not found')
        }

        // Convert data URL back to Blob
        const response = await fetch(audioDataUrl)
        const audioBlob = await response.blob()

        // Clean up sessionStorage
        sessionStorage.removeItem(`audio_${sessionId}`)

        // Step 1: Upload and transcribe
        setCurrentStep('transcribing')
        const transcribeResult = await api.transcribe(sessionId, audioBlob)
        if (!transcribeResult.success) {
          throw new Error(transcribeResult.error || 'Transcription failed')
        }

        // Step 2: Generate note
        setCurrentStep('generating')
        const generateResult = await api.generateNote(sessionId)
        if (!generateResult.success || !generateResult.data) {
          throw new Error(generateResult.error || 'Note generation failed')
        }

        setNoteId(generateResult.data.note.id)
        setCurrentStep('complete')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Processing failed')
        setCurrentStep('error')
      }
    }

    processRecording()
  }, [sessionId])

  const handleViewNote = () => {
    if (noteId) {
      navigate(`/notes/${noteId}`)
    }
  }

  const handleRetry = () => {
    navigate(`/new`)
  }

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['uploading', 'transcribing', 'generating']
    const currentIndex = stepOrder.indexOf(currentStep)
    const stepIndex = stepOrder.indexOf(stepId)

    if (currentStep === 'complete') return 'complete'
    if (currentStep === 'error') return stepIndex <= currentIndex ? 'error' : 'pending'
    if (stepIndex < currentIndex) return 'complete'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-6 safe-top safe-bottom">
      {/* Processing Animation */}
      <div className="mb-12">
        {currentStep === 'error' ? (
          <div className="w-24 h-24 rounded-full bg-[hsl(var(--destructive)/0.1)] flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-[hsl(var(--destructive))]" />
          </div>
        ) : currentStep === 'complete' ? (
          <div className="w-24 h-24 rounded-full bg-[hsl(var(--success)/0.1)] flex items-center justify-center animate-scale-in">
            <CheckCircle className="w-12 h-12 text-[hsl(var(--success))]" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
            <Sparkles className="w-10 h-10 text-[hsl(var(--primary))]" />
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-2 text-center">
        {currentStep === 'error'
          ? 'Processing Failed'
          : currentStep === 'complete'
          ? 'Note Ready'
          : 'Processing Recording'}
      </h1>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8 text-center max-w-xs">
        {currentStep === 'error'
          ? error
          : currentStep === 'complete'
          ? 'Your clinical note has been generated successfully.'
          : 'Please wait while we process your recording...'}
      </p>

      {/* Steps */}
      {currentStep !== 'complete' && currentStep !== 'error' && (
        <div className="w-full max-w-xs mb-8">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const Icon = step.icon

            return (
              <div key={step.id} className="flex items-center gap-3 mb-3 last:mb-0">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    status === 'active' && 'bg-[hsl(var(--primary))]',
                    status === 'complete' && 'bg-[hsl(var(--success))]',
                    status === 'pending' && 'bg-[hsl(var(--muted))]',
                    status === 'error' && 'bg-[hsl(var(--destructive))]'
                  )}
                >
                  {status === 'complete' ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        status === 'active' ? 'text-white animate-pulse' : 'text-[hsl(var(--muted-foreground))]'
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    status === 'active'
                      ? 'text-[hsl(var(--foreground))]'
                      : status === 'complete'
                      ? 'text-[hsl(var(--success))]'
                      : 'text-[hsl(var(--muted-foreground))]'
                  )}
                >
                  {step.label}
                </span>
                {status === 'active' && (
                  <div className="ml-auto flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-pulse delay-100" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-pulse delay-200" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Actions */}
      {currentStep === 'complete' && (
        <Button onClick={handleViewNote} size="lg" className="w-full max-w-xs">
          View Note
        </Button>
      )}

      {currentStep === 'error' && (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={handleRetry} size="lg" className="w-full">
            Try Again
          </Button>
          <Button onClick={() => navigate('/')} variant="ghost" size="lg" className="w-full">
            Go Home
          </Button>
        </div>
      )}
    </div>
  )
}
