import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Download,
  CheckCircle,
  Clock,
  User,
  Hash,
  FileText,
  RefreshCw,
} from 'lucide-react'
import { api } from '../lib/api'
import type { Note, SOAPSection } from '../lib/types'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { formatDateTime, getTemplateLabel, getSectionLabel } from '../lib/utils'
import { cn } from '../lib/utils'

const soapSections: SOAPSection[] = ['subjective', 'objective', 'assessment', 'plan']

export function NoteView() {
  const { noteId } = useParams<{ noteId: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [regeneratingSection, setRegeneratingSection] = useState<SOAPSection | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)

  useEffect(() => {
    if (!noteId) return

    const fetchNote = async () => {
      const response = await api.getNote(noteId)
      if (response.success && response.data) {
        setNote(response.data)
      } else {
        setError(response.error || 'Failed to load note')
      }
      setIsLoading(false)
    }

    fetchNote()
  }, [noteId])

  const handleRegenerateSection = async (section: SOAPSection) => {
    if (!noteId || regeneratingSection) return

    setRegeneratingSection(section)
    const response = await api.regenerateSection(noteId, section)
    if (response.success && response.data && note) {
      setNote({ ...note, [section]: response.data.content })
    }
    setRegeneratingSection(null)
  }

  const handleExportPdf = async () => {
    if (!noteId) return

    setIsExporting(true)
    const blob = await api.exportNotePdf(noteId)
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `note-${noteId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    }
    setIsExporting(false)
  }

  const handleFinalize = async () => {
    if (!noteId || note?.status === 'finalized') return

    setIsFinalizing(true)
    const response = await api.finalizeNote(noteId)
    if (response.success && response.data) {
      setNote(response.data)
    }
    setIsFinalizing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-6">
        <p className="text-[hsl(var(--destructive))] mb-4">{error || 'Note not found'}</p>
        <Button onClick={() => navigate('/')} variant="outline">
          Go Home
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] safe-top pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[hsl(var(--background)/0.95)] backdrop-blur-sm border-b border-[hsl(var(--border))]">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[hsl(var(--foreground))]" />
            </button>
            <span className="text-lg font-semibold text-[hsl(var(--foreground))]">Note</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportPdf}
              disabled={isExporting}
            >
              {isExporting ? (
                <Spinner size="sm" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/notes/${noteId}/edit`)}
            >
              <Edit className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Patient Info Card */}
        <Card className="mb-4">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <span className="font-semibold text-[hsl(var(--foreground))]">
                    {note.patient_name}
                  </span>
                </div>
                {note.patient_hn && (
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <Hash className="w-3.5 h-3.5" />
                    <span>{note.patient_hn}</span>
                  </div>
                )}
              </div>
              <Badge variant={note.status === 'finalized' ? 'success' : 'warning'}>
                {note.status === 'finalized' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Finalized
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>{getTemplateLabel(note.template)}</span>
              </div>
              <span>{formatDateTime(note.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        {/* SOAP Sections */}
        {soapSections.map((section) => (
          <Card key={section} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{getSectionLabel(section)}</CardTitle>
                {note.status !== 'finalized' && (
                  <button
                    onClick={() => handleRegenerateSection(section)}
                    disabled={regeneratingSection === section}
                    className={cn(
                      'p-1.5 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors',
                      regeneratingSection === section && 'animate-spin'
                    )}
                  >
                    <RefreshCw className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {regeneratingSection === section ? (
                <div className="py-4 flex items-center justify-center">
                  <Spinner size="sm" />
                </div>
              ) : (
                <p className="text-sm text-[hsl(var(--foreground))] whitespace-pre-wrap leading-relaxed">
                  {note[section] || 'No content'}
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Finalize Button */}
        {note.status !== 'finalized' && (
          <Button
            onClick={handleFinalize}
            isLoading={isFinalizing}
            size="lg"
            className="w-full"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Finalize Note
          </Button>
        )}
      </main>
    </div>
  )
}
