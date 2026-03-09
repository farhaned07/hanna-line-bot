import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Copy,
  Share2,
} from 'lucide-react'
import { api } from '../lib/api'
import type { Handover as HandoverType } from '../lib/types'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { BottomNav } from '../components/BottomNav'
import { formatDateTime } from '../lib/utils'
import { cn } from '../lib/utils'

export function Handover() {
  const navigate = useNavigate()
  const [handover, setHandover] = useState<HandoverType | null>(null)
  const [pastHandovers, setPastHandovers] = useState<HandoverType[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchHandovers = async () => {
      const response = await api.getHandovers()
      if (response.success && response.data) {
        setPastHandovers(response.data)
        if (response.data.length > 0) {
          // Show most recent handover
          setHandover(response.data[0])
        }
      }
      setIsLoading(false)
    }

    fetchHandovers()
  }, [])

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Calculate shift times (last 8 hours by default)
    const now = new Date()
    const shiftStart = new Date(now.getTime() - 8 * 60 * 60 * 1000)

    const response = await api.generateHandover({
      shift_start: shiftStart.toISOString(),
      shift_end: now.toISOString(),
    })

    if (response.success && response.data) {
      setHandover(response.data)
      setPastHandovers((prev) => [response.data!, ...prev])
    }

    setIsGenerating(false)
  }

  const handleCopy = async () => {
    if (!handover) return

    const text = `
SHIFT HANDOVER SUMMARY
${formatDateTime(handover.shift_start)} - ${formatDateTime(handover.shift_end)}

${handover.summary}

CRITICAL PATIENTS:
${handover.critical_patients.map((p) => `- ${p.name}${p.hn ? ` (${p.hn})` : ''}: ${p.condition}`).join('\n')}

PENDING TASKS:
${handover.pending_tasks.map((t) => `- ${t}`).join('\n')}
    `.trim()

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (!handover || !navigator.share) return

    try {
      await navigator.share({
        title: 'Shift Handover Summary',
        text: handover.summary,
      })
    } catch {
      // User cancelled or share failed
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] safe-top pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[hsl(var(--background)/0.95)] backdrop-blur-sm border-b border-[hsl(var(--border))]">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[hsl(var(--foreground))]" />
            </button>
            <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              Handover
            </h1>
          </div>
          {handover && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
              {'share' in navigator && (
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          isLoading={isGenerating}
          size="lg"
          className="w-full mb-6"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Handover Summary
        </Button>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : !handover ? (
          <EmptyState
            icon={<Clock className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />}
            title="No handover yet"
            description="Generate a handover summary based on your notes from this shift."
          />
        ) : (
          <>
            {/* Current Handover */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Shift Summary</CardTitle>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {formatDateTime(handover.created_at)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">
                  {handover.summary}
                </p>
              </CardContent>
            </Card>

            {/* Critical Patients */}
            {handover.critical_patients.length > 0 && (
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[hsl(var(--destructive))]" />
                    Critical Patients
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col gap-3">
                    {handover.critical_patients.map((patient, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-[hsl(var(--muted))]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-[hsl(var(--foreground))]">
                            {patient.name}
                          </span>
                          <Badge variant={getPriorityColor(patient.priority) as 'destructive' | 'warning' | 'default'}>
                            {patient.priority}
                          </Badge>
                        </div>
                        {patient.hn && (
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                            HN: {patient.hn}
                          </p>
                        )}
                        <p className="text-sm text-[hsl(var(--foreground))]">
                          {patient.condition}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pending Tasks */}
            {handover.pending_tasks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="flex flex-col gap-2">
                    {handover.pending_tasks.map((task, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-[hsl(var(--foreground))]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] mt-2 shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
