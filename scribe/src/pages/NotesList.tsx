import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  Clock,
  Search,
  Filter,
  Trash2,
} from 'lucide-react'
import { api } from '../lib/api'
import type { Note } from '../lib/types'
import { Input } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { BottomNav } from '../components/BottomNav'
import { formatRelativeTime, getTemplateLabel, truncate } from '../lib/utils'
import { cn } from '../lib/utils'

type FilterStatus = 'all' | 'draft' | 'finalized'

export function NotesList() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('all')
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
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    setDeletingId(null)
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      note.patient_hn?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || note.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] safe-top pb-24">
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
            All Notes
          </h1>
        </div>

        {/* Search & Filter */}
        <div className="px-4 pb-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name or HN..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'draft', 'finalized'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  filter === status
                    ? 'bg-[hsl(var(--primary))] text-white'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />}
            title={search || filter !== 'all' ? 'No matching notes' : 'No notes yet'}
            description={
              search || filter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Start recording to create your first clinical note.'
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filteredNotes.map((note) => (
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
