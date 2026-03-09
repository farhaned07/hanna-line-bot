import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Sparkles, Send } from 'lucide-react'
import { api } from '../lib/api'
import type { Note, SOAPSection } from '../lib/types'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Spinner } from '../components/ui/Spinner'
import { getSectionLabel } from '../lib/utils'
import { cn } from '../lib/utils'

const soapSections: SOAPSection[] = ['subjective', 'objective', 'assessment', 'plan']

export function NoteEditor() {
  const { noteId } = useParams<{ noteId: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [editedNote, setEditedNote] = useState<Partial<Note>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<SOAPSection>('subjective')
  const [aiCommand, setAiCommand] = useState('')
  const [isProcessingCommand, setIsProcessingCommand] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!noteId) return

    const fetchNote = async () => {
      const response = await api.getNote(noteId)
      if (response.success && response.data) {
        setNote(response.data)
        setEditedNote({
          subjective: response.data.subjective,
          objective: response.data.objective,
          assessment: response.data.assessment,
          plan: response.data.plan,
        })
      } else {
        setError(response.error || 'Failed to load note')
      }
      setIsLoading(false)
    }

    fetchNote()
  }, [noteId])

  const handleSectionChange = useCallback(
    (section: SOAPSection, value: string) => {
      setEditedNote((prev) => ({ ...prev, [section]: value }))
    },
    []
  )

  const handleSave = async () => {
    if (!noteId) return

    setIsSaving(true)
    const response = await api.updateNote(noteId, editedNote)
    if (response.success && response.data) {
      setNote(response.data)
      navigate(`/notes/${noteId}`)
    }
    setIsSaving(false)
  }

  const handleAiCommand = async () => {
    if (!noteId || !aiCommand.trim() || isProcessingCommand) return

    setIsProcessingCommand(true)
    const response = await api.aiCommand(noteId, aiCommand)
    if (response.success && response.data) {
      setNote(response.data)
      setEditedNote({
        subjective: response.data.subjective,
        objective: response.data.objective,
        assessment: response.data.assessment,
        plan: response.data.plan,
      })
      setAiCommand('')
    }
    setIsProcessingCommand(false)
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

  if (note.status === 'finalized') {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-6">
        <p className="text-[hsl(var(--muted-foreground))] mb-4">This note has been finalized and cannot be edited.</p>
        <Button onClick={() => navigate(`/notes/${noteId}`)} variant="outline">
          View Note
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col safe-top">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[hsl(var(--background)/0.95)] backdrop-blur-sm border-b border-[hsl(var(--border))]">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/notes/${noteId}`)}
              className="p-2 -ml-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[hsl(var(--foreground))]" />
            </button>
            <span className="text-lg font-semibold text-[hsl(var(--foreground))]">Edit Note</span>
          </div>
          <Button onClick={handleSave} isLoading={isSaving} size="sm">
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </Button>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-[hsl(var(--border))]">
          {soapSections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                activeSection === section
                  ? 'text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              {getSectionLabel(section)}
            </button>
          ))}
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <textarea
            value={editedNote[activeSection] || ''}
            onChange={(e) => handleSectionChange(activeSection, e.target.value)}
            placeholder={`Enter ${getSectionLabel(activeSection).toLowerCase()} notes...`}
            className="w-full h-full min-h-[300px] p-4 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-base leading-relaxed resize-none focus:outline-none focus:border-[hsl(var(--ring))] focus:ring-2 focus:ring-[hsl(var(--ring)/0.2)] placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>

        {/* AI Command Bar */}
        <div className="sticky bottom-0 p-4 bg-[hsl(var(--background)/0.95)] backdrop-blur-sm border-t border-[hsl(var(--border))]">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--primary))]" />
              <Input
                value={aiCommand}
                onChange={(e) => setAiCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAiCommand()
                  }
                }}
                placeholder="Ask AI to edit (e.g., 'Add vital signs to objective')"
                className="pl-10 pr-12"
              />
            </div>
            <Button
              onClick={handleAiCommand}
              disabled={!aiCommand.trim() || isProcessingCommand}
              size="icon"
              className="shrink-0"
            >
              {isProcessingCommand ? (
                <Spinner size="sm" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mt-2">
            Try: "Make the plan more detailed" or "Add medication dosages"
          </p>
        </div>
      </main>
    </div>
  )
}
