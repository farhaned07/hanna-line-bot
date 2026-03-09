import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Wand2, Check, Save, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { api } from '../api/client'
import { t, getLocale } from '../i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

const SECTION_ORDER = ['subjective', 'objective', 'assessment', 'plan']
const SECTION_LABELS = {
    subjective: 'Subjective',
    objective: 'Objective',
    assessment: 'Assessment',
    plan: 'Plan'
}

const SECTION_ICONS = {
    subjective: '💬',
    objective: '🔬',
    assessment: '📋',
    plan: '📌'
}

const SECTION_GRADIENTS = {
    subjective: 'from-indigo-500 to-purple-600',
    objective: 'from-emerald-500 to-teal-600',
    assessment: 'from-amber-500 to-yellow-600',
    plan: 'from-violet-500 to-indigo-600'
}

function SectionEditor({ sectionKey, content, onChange, onRegenerate, isRegenerating }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false, codeBlock: false,
                blockquote: false, horizontalRule: false
            }),
            Placeholder.configure({
                placeholder: `Enter ${SECTION_LABELS[sectionKey] || sectionKey} notes...`
            })
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        }
    })

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '')
        }
    }, [content])

    if (!editor) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
        >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-2 pl-0.5">
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${SECTION_GRADIENTS[sectionKey]} flex items-center justify-center text-xs shadow-lg`}>
                        {SECTION_ICONS[sectionKey]}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {SECTION_LABELS[sectionKey]}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRegenerate(sectionKey)}
                    disabled={isRegenerating}
                    className="h-7 text-xs text-primary hover:text-primary"
                >
                    {isRegenerating ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <>
                            <Sparkles size={14} className="mr-1" />
                            Regenerate
                        </>
                    )}
                </Button>
            </div>

            {/* Editor Card */}
            <Card className="border-border bg-card shadow-sm">
                <CardContent className="p-0">
                    <EditorContent 
                        editor={editor} 
                        className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[120px] focus:outline-none"
                    />
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default function NoteEditor() {
    const { noteId } = useParams()
    const navigate = useNavigate()
    const { toast } = useToast()
    const [note, setNote] = useState(null)
    const [saving, setSaving] = useState(false)
    const [regenerating, setRegenerating] = useState(null)
    const [commandInput, setCommandInput] = useState('')
    const [showCommand, setShowCommand] = useState(false)

    useEffect(() => {
        loadNote()
    }, [noteId])

    const loadNote = async () => {
        try {
            const data = await api.getNote(noteId)
            setNote(data)
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to load note",
                variant: 'destructive'
            })
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await api.updateNote(noteId, { content: note.content })
            toast({
                title: "Note saved",
                description: "Your changes have been saved",
                duration: 2000
            })
        } catch (err) {
            toast({
                title: "Save failed",
                description: "Please try again",
                variant: 'destructive'
            })
        } finally {
            setSaving(false)
        }
    }

    const handleRegenerate = async (section) => {
        setRegenerating(section)
        try {
            const result = await api.regenerateSection(noteId, section, '')
            setNote(prev => ({
                ...prev,
                content: { ...prev.content, [section]: result.content[section] }
            }))
            toast({
                title: "Section regenerated",
                description: "AI has updated this section",
                duration: 2000
            })
        } catch (err) {
            toast({
                title: "Regenerate failed",
                description: "Please try again",
                variant: 'destructive'
            })
        } finally {
            setRegenerating(null)
        }
    }

    const handleCommand = async () => {
        if (!commandInput.trim()) return
        setSaving(true)
        try {
            const result = await api.hannaCommand(noteId, commandInput, note.content)
            setNote(prev => ({ ...prev, content: result.content }))
            setCommandInput('')
            setShowCommand(false)
            toast({
                title: "Command executed",
                description: "AI has applied your changes",
                duration: 2000
            })
        } catch (err) {
            toast({
                title: "Command failed",
                description: "Please try again",
                variant: 'destructive'
            })
        } finally {
            setSaving(false)
        }
    }

    const updateSection = (section, content) => {
        setNote(prev => ({
            ...prev,
            content: { ...prev.content, [section]: content }
        }))
    }

    if (!note) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-dvh bg-background pb-28">
            {/* Top Bar */}
            <div className="safe-top flex items-center justify-between px-4 pt-4 pb-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/note/${noteId}`)}
                    className="w-10 h-10 rounded-lg border-border bg-card hover:bg-accent text-foreground"
                >
                    <ArrowLeft size={18} />
                </Button>
                
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCommand(!showCommand)}
                        className="h-9 text-xs"
                    >
                        <Wand2 size={14} className="mr-1.5" />
                        Command
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-9 px-4 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-primary-glow"
                        size="sm"
                    >
                        {saving ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <>
                                <Save size={14} className="mr-1.5" />
                                Save
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Command Bar */}
            {showCommand && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 mb-4"
                >
                    <Card className="border-border bg-card shadow-md">
                        <CardContent className="p-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={commandInput}
                                    onChange={(e) => setCommandInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCommand()}
                                    placeholder={t('editor.tellHanna') || 'Tell Hanna to edit...'}
                                    className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <Button
                                    onClick={handleCommand}
                                    disabled={!commandInput.trim() || saving}
                                    size="sm"
                                    className="h-10 px-4"
                                >
                                    <Sparkles size={14} className="mr-1.5" />
                                    Apply
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Header */}
            <div className="px-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground font-medium">
                        {t('editor.editing')} · {note.template_type?.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Section Editors */}
            <div className="px-4">
                {SECTION_ORDER.map((section) => (
                    <SectionEditor
                        key={section}
                        sectionKey={section}
                        content={note.content?.[section] || ''}
                        onChange={(html) => updateSection(section, html)}
                        onRegenerate={handleRegenerate}
                        isRegenerating={regenerating === section}
                    />
                ))}
            </div>
        </div>
    )
}
