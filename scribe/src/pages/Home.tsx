import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  FileText,
  Clock,
  User,
  ChevronRight,
  Mic,
  Trash2,
} from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import type { Note } from '../lib/types'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { BottomNav } from '../components/BottomNav'
import { formatRelativeTime, getTemplateLabel, truncate } from '../lib/utils'

export function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await api.getNotes()
      if (response.success && response.data) {
        setNotes(response.data)
      }
      setIsLoading(false)
    }

    fetchNotes()
  }, [])

  const handleDelete = async (noteId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!window.confirm('Are you sure you want to delete this note?')) return

    setDeletingId(noteId)
    // Note: API would need a delete endpoint, for now just remove from UI
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    setDeletingId(null)
  }

  const recentNotes = notes.slice(0, 10)

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] safe-top pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Welcome back,</p>
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              {user?.name?.split(' ')[0] || 'Doctor'}
            </h1>
          </div>
          <Link
            to="/settings"
            className="w-10 h-10 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center"
          >
            <User className="w-5 h-5 text-[hsl(var(--foreground))]" />
          </Link>
        </div>

        {/* Quick Action */}
        <Card className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-hover))] border-0">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  Start Recording
                </h2>
                <p className="text-sm text-white/70">
                  Voice-to-SOAP in seconds
                </p>
              </div>
              <Button
                onClick={() => navigate('/new')}
                variant="secondary"
                size="lg"
                className="bg-white text-[hsl(var(--primary))] hover:bg-white/90"
              >
                <Mic className="w-5 h-5 mr-2" />
                Record
              </Button>
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Recent Notes */}
      <main className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Recent Notes
          </h2>
          {notes.length > 0 && (
            <Link
              to="/notes"
              className="text-sm text-[hsl(var(--primary))] font-medium flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : recentNotes.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />}
            title="No notes yet"
            description="Start your first recording to create a clinical note."
            action={
              <Button onClick={() => navigate('/new')}>
                <Plus className="w-4 h-4 mr-2" />
                New Recording
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {recentNotes.map((note) => (
              <Link
                key={note.id}
                to={`/notes/${note.id}`}
                className="block"
              >
                <Card className="hover:border-[hsl(var(--primary)/0.5)] transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[hsl(var(--foreground))] truncate">
                            {note.patient_name}
                          </span>
                          <Badge
                            variant={note.status === 'finalized' ? 'success' : 'warning'}
                            className="shrink-0"
                          >
                            {note.status === 'finalized' ? 'Final' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] truncate mb-1">
                          {truncate(note.assessment || note.subjective || 'No content', 60)}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(note.created_at)}
                          </span>
                          <span>{getTemplateLabel(note.template)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(note.id, e)}
                        disabled={deletingId === note.id}
                        className="p-2 rounded-lg hover:bg-[hsl(var(--destructive)/0.1)] transition-colors shrink-0"
                      >
                        {deletingId === note.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]" />
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
