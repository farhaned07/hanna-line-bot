import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Mic, Check } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { api } from '../api/client'
import { t, getLocale } from '../i18n'

const SECTION_ORDER = ['subjective', 'objective', 'assessment', 'plan']
const SECTION_LABELS = {
    subjective: 'Subjective',
    objective: 'Objective',
    assessment: 'Assessment',
    plan: 'Plan'
}

const SECTION_COLORS = {
    subjective: '#4A90D9',
    objective: '#34C759',
    assessment: '#FF9500',
    plan: '#AF52DE'
}


function SectionEditor({ sectionKey, content, onChange, onRegenerate, isRegenerating }) {
    const color = SECTION_COLORS[sectionKey] || 'var(--color-ink2)'

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

    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 8
            }}>
                <h3 style={{
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '1px', color
                }}>
                    {SECTION_LABELS[sectionKey] || sectionKey}
                </h3>
                <button
                    onClick={() => onRegenerate(sectionKey)}
                    disabled={isRegenerating}
                    style={{
                        padding: '4px 10px', borderRadius: 8,
                        background: 'var(--color-accent-soft)', border: 'none',
                        color: 'var(--color-accent)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 11, fontWeight: 600,
                        opacity: isRegenerating ? 0.6 : 1
                    }}
                >
                    <Sparkles size={12} className={isRegenerating ? 'spin' : ''} />
                    {isRegenerating ? 'Thinking...' : 'AI'}
                </button>
                {isRegenerating && <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>}
            </div>
            <div
                className="tiptap-editor"
                style={{
                    borderRadius: 12, background: '#fff',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderLeft: `3px solid ${color}`,
                    overflow: 'hidden',
                    opacity: isRegenerating ? 0.7 : 1, transition: 'opacity 0.2s'
                }}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default function NoteEditor() {
    const { noteId } = useParams()
    const navigate = useNavigate()
    const [note, setNote] = useState(null)
    const [sections, setSections] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [regeneratingSection, setRegeneratingSection] = useState(null)
    const [hannaCommand, setHannaCommand] = useState('')
    const [processingCommand, setProcessingCommand] = useState(false)
    const [noteLang, setNoteLang] = useState(localStorage.getItem('scribe_note_lang') || 'en')

    useEffect(() => {
        loadNote()
    }, [noteId])

    const loadNote = async () => {
        try {
            const data = await api.getNote(noteId)
            setNote(data)
            setSections(data.content || {})
        } catch (err) {
            console.error('Failed to load note:', err)
            setNote(null)
        } finally {
            setLoading(false)
        }
    }

    const handleSectionChange = useCallback((key, html) => {
        setSections(prev => ({ ...prev, [key]: html }))
    }, [])

    const handleRegenerate = async (sectionKey) => {
        setRegeneratingSection(sectionKey)
        try {
            const res = await api.regenerateSection(noteId, sectionKey)
            setSections(prev => ({ ...prev, [sectionKey]: res.content }))
        } catch (err) {
            console.error('Regenerate failed:', err)
            alert('Failed to regenerate section. Please try again.')
        } finally {
            setRegeneratingSection(null)
        }
    }

    const handleHannaSubmit = async () => {
        if (!hannaCommand.trim()) return

        setProcessingCommand(true)
        try {
            const res = await api.hannaCommand(noteId, hannaCommand, sections)
            setSections(res.content)
            setHannaCommand('')
        } catch (err) {
            console.error('Hanna command failed:', err)
            alert('Command failed. Please try again.')
        } finally {
            setProcessingCommand(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const content = {}
            const contentText = []
            Object.entries(sections).forEach(([key, val]) => {
                content[key] = val
                // Strip HTML tags for plain text
                const text = val.replace(/<[^>]+>/g, '').trim()
                if (text) contentText.push(`${(SECTION_LABELS[key] || key).toUpperCase()}\n${text}`)
            })
            await api.updateNote(noteId, {
                content
            })
        } catch (err) {
            console.error('Save failed:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleFinalize = async () => {
        await handleSave()
        try {
            await api.finalizeNote(noteId)
            navigate(`/note/${noteId}`)
        } catch (err) {
            console.error('Finalize failed:', err)
            // Dev mode: navigate anyway
            navigate(`/note/${noteId}`)
        }
    }

    const toggleNoteLang = () => {
        const next = noteLang === 'en' ? 'th' : 'en'
        setNoteLang(next)
        localStorage.setItem('scribe_note_lang', next)
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: 28, height: 28, border: '3px solid var(--color-accent)',
                    borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100dvh', background: '#F5F5F5', paddingBottom: 140 }}>
            {/* Top Bar */}
            <div className="safe-top" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px 12px'
            }}>
                <button
                    onClick={() => navigate(`/note/${noteId}`)}
                    style={{
                        width: 36, height: 36, borderRadius: 12,
                        background: 'var(--color-card)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--color-ink2)'
                    }}
                >
                    <ArrowLeft size={18} />
                </button>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-ink)' }}>
                    {t('editor.editing')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                        onClick={toggleNoteLang}
                        style={{
                            padding: '5px 10px', borderRadius: 8,
                            background: 'var(--color-card)', border: 'none',
                            fontSize: 12, fontWeight: 600, color: 'var(--color-ink2)', cursor: 'pointer'
                        }}
                    >
                        {noteLang.toUpperCase()}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            padding: '5px 14px', borderRadius: 8,
                            background: 'var(--color-accent)', border: 'none',
                            color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                            opacity: saving ? 0.4 : 1
                        }}
                    >
                        {t('editor.save')}
                    </button>
                </div>
            </div>

            {/* Patient Info */}
            <div style={{ padding: '0 20px', marginBottom: 16 }}>
                <p style={{ fontSize: 14, color: 'var(--color-ink2)' }}>
                    {note?.session?.patient_name || 'Demo Patient'}
                    {note?.session?.patient_hn ? ` · HN ${note.session.patient_hn}` : ''}
                </p>
                <div style={{ height: 1, background: 'var(--color-border)', marginTop: 12 }} />
            </div>

            {/* Section Editors */}
            <div style={{ padding: '0 20px' }}>
                {SECTION_ORDER.map(key => (
                    <SectionEditor
                        key={key}
                        sectionKey={key}
                        content={sections[key] || ''}
                        onChange={(html) => handleSectionChange(key, html)}
                        onRegenerate={handleRegenerate}
                        isRegenerating={regeneratingSection === key}
                    />
                ))}
            </div>

            {/* Bottom Actions */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '12px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
                borderTop: '0.5px solid rgba(0,0,0,0.08)',
                display: 'flex', flexDirection: 'column', gap: 10
            }}>
                {/* Hanna Command */}
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={hannaCommand}
                        onChange={(e) => setHannaCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleHannaSubmit()}
                        placeholder={processingCommand ? 'Applying changes...' : t('editor.tellHanna')}
                        disabled={processingCommand}
                        className="scribe-input"
                        style={{ paddingRight: 40, fontSize: 14, opacity: processingCommand ? 0.7 : 1 }}
                    />
                    <button
                        onClick={handleHannaSubmit}
                        disabled={processingCommand}
                        style={{
                            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)'
                        }}
                    >
                        <Mic size={16} className={processingCommand ? 'pulse' : ''} />
                    </button>
                    {processingCommand && <style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } } .pulse { animation: pulse 1.5s infinite; }`}</style>}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => navigate(`/note/${noteId}`)}
                        className="btn-secondary"
                    >
                        {t('editor.cancel')}
                    </button>
                    <button
                        onClick={handleFinalize}
                        disabled={saving}
                        style={{
                            flex: 1, padding: 13, borderRadius: 12,
                            background: 'var(--color-accent)', color: 'white',
                            fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            opacity: saving ? 0.4 : 1
                        }}
                    >
                        <Check size={14} />
                        {saving ? '...' : t('note.finalize')}
                    </button>
                </div>
            </div>
        </div>
    )
}
