import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Hash, FileText } from 'lucide-react'
import { api } from '../lib/api'
import type { SessionTemplate } from '../lib/types'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { cn } from '../lib/utils'

const templates: { value: SessionTemplate; label: string; description: string }[] = [
  { value: 'general', label: 'General Consult', description: 'Standard outpatient visit' },
  { value: 'follow_up', label: 'Follow-up', description: 'Returning patient check' },
  { value: 'procedure', label: 'Procedure', description: 'Procedural documentation' },
  { value: 'admission', label: 'Admission', description: 'Hospital admission note' },
  { value: 'discharge', label: 'Discharge', description: 'Discharge summary' },
]

export function NewSession() {
  const navigate = useNavigate()
  const [patientName, setPatientName] = useState('')
  const [patientHn, setPatientHn] = useState('')
  const [template, setTemplate] = useState<SessionTemplate>('general')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = async () => {
    if (!patientName.trim()) {
      setError('Patient name is required')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await api.createSession({
        patient_name: patientName.trim(),
        patient_hn: patientHn.trim() || undefined,
        template,
      })

      if (response.success && response.data) {
        navigate(`/recording/${response.data.id}`)
      } else {
        setError(response.error || 'Failed to create session')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] safe-top safe-bottom">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[hsl(var(--background)/0.95)] backdrop-blur-sm border-b border-[hsl(var(--border))]">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[hsl(var(--foreground))]" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-[hsl(var(--foreground))]">
            New Recording
          </h1>
        </div>
      </header>

      <main className="p-4 pb-24 max-w-lg mx-auto">
        <div className="flex flex-col gap-6">
          {/* Patient Info */}
          <Card>
            <CardContent className="pt-5">
              <h2 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-4">
                Patient Information
              </h2>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                  <Input
                    type="text"
                    placeholder="Patient name *"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="pl-12"
                    autoFocus
                  />
                </div>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                  <Input
                    type="text"
                    placeholder="HN (optional)"
                    value={patientHn}
                    onChange={(e) => setPatientHn(e.target.value)}
                    className="pl-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardContent className="pt-5">
              <h2 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-4">
                Note Template
              </h2>
              <div className="flex flex-col gap-2">
                {templates.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTemplate(t.value)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                      template === t.value
                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]'
                        : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        template === t.value
                          ? 'bg-[hsl(var(--primary))]'
                          : 'bg-[hsl(var(--muted))]'
                      )}
                    >
                      <FileText
                        className={cn(
                          'w-5 h-5',
                          template === t.value
                            ? 'text-white'
                            : 'text-[hsl(var(--muted-foreground))]'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'font-medium',
                          template === t.value
                            ? 'text-[hsl(var(--primary))]'
                            : 'text-[hsl(var(--foreground))]'
                        )}
                      >
                        {t.label}
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {t.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <p className="text-sm text-[hsl(var(--destructive))] text-center">
              {error}
            </p>
          )}

          {/* Start Button */}
          <Button
            onClick={handleStart}
            isLoading={isLoading}
            size="lg"
            className="w-full"
          >
            Start Recording
          </Button>
        </div>
      </main>
    </div>
  )
}
