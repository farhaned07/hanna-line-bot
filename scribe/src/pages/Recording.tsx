import { useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, Pause, Play, Square, Mic } from 'lucide-react'
import { useRecorder } from '../hooks/useRecorder'
import { formatDuration } from '../lib/utils'
import { cn } from '../lib/utils'

export function Recording() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const {
    state,
    duration,
    audioBlob,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useRecorder()

  // Auto-start recording on mount
  useEffect(() => {
    if (state === 'idle') {
      startRecording()
    }
  }, [state, startRecording])

  // Navigate to processing when stopped
  useEffect(() => {
    if (state === 'stopped' && audioBlob && sessionId) {
      // Store blob in sessionStorage for the processing page
      const reader = new FileReader()
      reader.onloadend = () => {
        sessionStorage.setItem(`audio_${sessionId}`, reader.result as string)
        navigate(`/processing/${sessionId}`)
      }
      reader.readAsDataURL(audioBlob)
    }
  }, [state, audioBlob, sessionId, navigate])

  const handleCancel = useCallback(() => {
    if (window.confirm('Are you sure you want to cancel this recording?')) {
      stopRecording()
      navigate('/')
    }
  }, [stopRecording, navigate])

  const handleTogglePause = useCallback(() => {
    if (state === 'recording') {
      pauseRecording()
    } else if (state === 'paused') {
      resumeRecording()
    }
  }, [state, pauseRecording, resumeRecording])

  const handleStop = useCallback(() => {
    if (duration < 5) {
      alert('Recording must be at least 5 seconds')
      return
    }
    stopRecording()
  }, [duration, stopRecording])

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-top">
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
        >
          <X className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              state === 'recording'
                ? 'bg-[hsl(var(--destructive))] recording-dot'
                : 'bg-[hsl(var(--warning))]'
            )}
          />
          <span className="text-sm font-medium text-[hsl(var(--foreground))]">
            {state === 'recording' ? 'Recording' : state === 'paused' ? 'Paused' : 'Starting...'}
          </span>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.3)]">
            <p className="text-sm text-[hsl(var(--destructive))] text-center">{error}</p>
          </div>
        )}

        {/* Timer */}
        <div className="mb-12">
          <p className="text-6xl font-light text-[hsl(var(--foreground))] tabular-nums tracking-tight">
            {formatDuration(duration)}
          </p>
        </div>

        {/* Orb */}
        <div className="orb-container mb-16">
          {state === 'recording' && (
            <>
              <div className="orb-ring" />
              <div className="orb-ring" />
            </>
          )}
          <div
            className={cn(
              'orb-core flex items-center justify-center',
              state === 'paused' && 'opacity-60'
            )}
          >
            <Mic
              className={cn(
                'w-12 h-12 text-white/80',
                state === 'recording' && 'animate-pulse'
              )}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {/* Pause/Resume */}
          <button
            onClick={handleTogglePause}
            disabled={state === 'idle' || state === 'stopped'}
            className="w-14 h-14 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center hover:bg-[hsl(var(--secondary)/0.8)] transition-colors disabled:opacity-50"
          >
            {state === 'paused' ? (
              <Play className="w-6 h-6 text-[hsl(var(--foreground))] ml-0.5" />
            ) : (
              <Pause className="w-6 h-6 text-[hsl(var(--foreground))]" />
            )}
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            disabled={state === 'idle' || state === 'stopped' || duration < 5}
            className="w-20 h-20 rounded-full bg-[hsl(var(--destructive))] flex items-center justify-center hover:bg-[hsl(var(--destructive)/0.9)] transition-colors shadow-lg shadow-[hsl(var(--destructive)/0.3)] disabled:opacity-50 disabled:shadow-none"
          >
            <Square className="w-8 h-8 text-white fill-white" />
          </button>

          {/* Spacer for symmetry */}
          <div className="w-14 h-14" />
        </div>

        {/* Hint */}
        <p className="mt-8 text-sm text-[hsl(var(--muted-foreground))] text-center">
          {duration < 5
            ? 'Record at least 5 seconds'
            : 'Tap the stop button when finished'}
        </p>
      </main>
    </div>
  )
}
