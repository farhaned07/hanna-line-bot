import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Wand2, Check, Save } from 'lucide-react'
import { motion } from 'framer-motion'
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

const SECTION_ICONS = {
    subjective: '💬',
    objective: '🔬',
    assessment: '📋',
    plan: '📌'
}

const SECTION_GRADIENTS = {
    subjective: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    objective: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    assessment: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)',
    plan: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
}

const SECTION_SHADOWS = {
    subjective: '0 2px 8px rgba(102,126,234,0.25)',
    objective: '0 2px 8px rgba(17,153,142,0.25)',
    assessment: '0 2px 8px rgba(242,153,74,0.25)',
    plan: '0 2px 8px rgba(168,85,247,0.25)'
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 16 }}
        >
            {/* Section Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 8, paddingLeft: 2
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: 7,
                        background: SECTION_GRADIENTS[sectionKey],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12,
                        boxShadow: SECTION_SHADOWS[sectionKey]
                    }}>
                        {SECTION_ICONS[sectionKey]}
                    </div>
                    <h3 style={{
                        fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '1px', color: '#374151'
                    }}>
                        {SECTION_LABELS[sectionKey] || sectionKey}
                    </h3>
                </div>
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onRegenerate(sectionKey)}
                    disabled={isRegenerating}
                    style={{
                        padding: '5px 12px', borderRadius: 10,
                        background: isRegenerating
                            ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                            : '#F3F4F6',
                        border: 'none',
                        color: isRegenerating ? '#fff' : '#6366F1',
                        cursor: isRegenerating ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 11, fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                >
                    <Sparkles size={12} className={isRegenerating ? 'spin' : ''} />
                    {isRegenerating ? 'Thinking...' : 'Regenerate'}
                </motion.button>
                {isRegenerating && <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>}
            </div>

            {/* Editor Card */}
            <div
                className="tiptap-editor"
                style={{
                    borderRadius: 14, background: '#fff',
                    border: '1px solid #F3F4F6',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                    opacity: isRegenerating ? 0.6 : 1,
                    transition: 'opacity 0.25s, box-shadow 0.2s',
                }}
            >
                <EditorContent editor={editor} />
            </div>
        </motion.div>
    )
}

export default function NoteEditor() {
    const { noteId } = useParams()
    const navigate = useNavigate()
    const [note, setNote] = useState(null)
    const [sections, setSections] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
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
        setSaved(false)
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
            Object.entries(sections).forEach(([key, val]) => {
                content[key] = val
            })
            await api.updateNote(noteId, { content })
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
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
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: 32, height: 32, borderRadius: '50%',
                        border: '3px solid #E5E7EB', borderTopColor: '#6366F1'
                    }}
                />
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100dvh', background: '#FAFAFA', paddingBottom: 160 }}>
            {/* Top Bar */}
            <div className="safe-top" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px 12px'
            }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(`/note/${noteId}`)}
                    style={{
                        width: 40, height: 40, borderRadius: 14,
                        background: '#fff', border: '1px solid #F0F0F0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#374151',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                >
                    <ArrowLeft size={18} />
                </motion.button>

                <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', letterSpacing: '-0.3px' }}>
                    Edit Note
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={toggleNoteLang}
                        style={{
                            padding: '6px 12px', borderRadius: 10,
                            background: '#F3F4F6', border: 'none',
                            fontSize: 12, fontWeight: 700, color: '#6B7280', cursor: 'pointer',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {noteLang.toUpperCase()}
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            padding: '6px 14px', borderRadius: 10,
                            background: saved
                                ? 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
                                : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            border: 'none',
                            color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                            opacity: saving ? 0.5 : 1,
                            display: 'flex', alignItems: 'center', gap: 5,
                            boxShadow: saved
                                ? '0 2px 8px rgba(16,185,129,0.3)'
                                : '0 2px 8px rgba(99,102,241,0.3)',
                            transition: 'all 0.3s'
                        }}
                    >
                        {saved ? <Check size={13} /> : <Save size={13} />}
                        {saving ? '...' : saved ? 'Saved' : 'Save'}
                    </motion.button>
                </div>
            </div>

            {/* Patient Info */}
            <div style={{ padding: '0 20px', marginBottom: 20 }}>
                <p style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>
                    {note?.session?.patient_name || 'Patient'}
                    {note?.session?.patient_hn ? ` · HN ${note.session.patient_hn}` : ''}
                </p>
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #E5E7EB 20%, #E5E7EB 80%, transparent)', marginTop: 14 }} />
            </div>

            {/* Section Editors */}
            <div style={{ padding: '0 20px' }}>
                {SECTION_ORDER.map((key, i) => (
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
                padding: '14px 20px',
                paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 14px)',
                background: 'rgba(250,250,250,0.88)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
            }}>
                {/* Hanna AI Command */}
                <div style={{ position: 'relative', marginBottom: 10 }}>
                    <div style={{
                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                        width: 22, height: 22, borderRadius: 6,
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Wand2 size={12} color="#fff" />
                    </div>
                    <input
                        type="text"
                        value={hannaCommand}
                        onChange={(e) => setHannaCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleHannaSubmit()}
                        placeholder={processingCommand ? 'Applying changes...' : 'Ask Hanna AI to edit...'}
                        disabled={processingCommand}
                        style={{
                            width: '100%', padding: '12px 16px 12px 44px',
                            borderRadius: 12, background: '#fff',
                            border: '1px solid #E5E7EB', fontSize: 14,
                            color: '#374151', outline: 'none',
                            opacity: processingCommand ? 0.6 : 1,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#6366F1'
                            e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#E5E7EB'
                            e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/note/${noteId}`)}
                        style={{
                            flex: 1, padding: 13, borderRadius: 14,
                            background: '#fff', border: '1px solid #E5E7EB',
                            color: '#6B7280', fontWeight: 600, fontSize: 14,
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFinalize}
                        disabled={saving}
                        style={{
                            flex: 1.5, padding: 13, borderRadius: 14,
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            color: '#fff', border: 'none',
                            fontWeight: 700, fontSize: 14, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            opacity: saving ? 0.5 : 1,
                            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                        }}
                    >
                        <Check size={15} />
                        {saving ? 'Saving...' : 'Review & Finalize'}
                    </motion.button>
                </div>
            </div>
        </div>
    )
}
