import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Wand2, Check, Save, Loader2, Copy, Download, Mic } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { notesApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import DashboardLayout from '@/components/layout/DashboardLayout';

const SECTION_ORDER = ['subjective', 'objective', 'assessment', 'plan'];
const SECTION_LABELS = {
    subjective: 'Subjective',
    objective: 'Objective',
    assessment: 'Assessment',
    plan: 'Plan'
};

const SECTION_GRADIENTS = {
    subjective: 'from-indigo-500 to-purple-600',
    objective: 'from-emerald-500 to-teal-600',
    assessment: 'from-amber-500 to-yellow-600',
    plan: 'from-violet-500 to-indigo-600'
};

function SectionEditor({ sectionKey, content, onChange, onRegenerate, isRegenerating }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
                blockquote: false,
                horizontalRule: false,
            }),
            Placeholder.configure({
                placeholder: `Enter ${SECTION_LABELS[sectionKey]} notes...`,
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[120px] px-4 py-3 text-white',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content]);

    if (!editor) return null;

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
                        <span>●</span>
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
                        className="prose prose-invert prose-sm max-w-none focus:outline-none"
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function NoteEditor() {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [regenerating, setRegenerating] = useState(null);
    const [content, setContent] = useState({});

    useEffect(() => {
        loadNote();
    }, [noteId]);

    const loadNote = async () => {
        try {
            const data = await notesApi.get(noteId);
            setNote(data);
            setContent(typeof data.content === 'string' ? JSON.parse(data.content) : data.content);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load note',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSectionChange = useCallback((section, value) => {
        setContent(prev => ({ ...prev, [section]: value }));
    }, []);

    const handleRegenerate = async (section) => {
        setRegenerating(section);
        try {
            const result = await notesApi.regenerateSection(noteId, section);
            setContent(prev => ({ ...prev, [section]: result.content }));
            toast({
                title: 'Section regenerated',
                description: `${SECTION_LABELS[section]} has been updated`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setRegenerating(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await notesApi.update(noteId, content);
            toast({
                title: 'Saved',
                description: 'Note has been updated',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save note',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleFinalize = async () => {
        if (!confirm('Finalize this note? It will be marked as complete.')) return;
        
        try {
            await notesApi.finalize(noteId);
            toast({
                title: 'Note finalized',
                description: 'This note has been marked as complete',
            });
            navigate('/scribe/app');
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleCopy = () => {
        const text = Object.entries(content)
            .map(([key, val]) => `${SECTION_LABELS[key]}\n${val.replace(/<[^>]*>/g, '')}`)
            .join('\n\n');
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied',
            description: 'Note copied to clipboard',
        });
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-dvh bg-background flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading note...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-dvh bg-background pb-24 relative">
                {/* Ambient Background Glow */}
                <div className="ambient-glow" />

                {/* Header */}
                <div className="safe-top sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(-1)}
                                    className="w-9 h-9 rounded-lg"
                                >
                                    <ArrowLeft size={18} />
                                </Button>
                                <div>
                                    <h1 className="text-lg font-bold text-white">
                                        {note?.patient_name || 'Patient'}
                                    </h1>
                                    <p className="text-xs text-muted-foreground">
                                        {note?.patient_hn || 'No HN'} • {note?.template_type?.toUpperCase() || 'SOAP'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-9"
                                >
                                    <Copy size={16} className="mr-1" />
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="h-9"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin mr-1" /> : <Save size={16} className="mr-1" />}
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 relative z-10">
                    {/* AI Attribution Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20"
                    >
                        <div className="flex items-start gap-3">
                            <Sparkles size={18} className="text-primary mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                    AI-Generated Note
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Review and edit all sections before finalizing. This note requires your clinical verification.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {SECTION_ORDER.map((section) => (
                            <SectionEditor
                                key={section}
                                sectionKey={section}
                                content={content[section]}
                                onChange={(value) => handleSectionChange(section, value)}
                                onRegenerate={handleRegenerate}
                                isRegenerating={regenerating === section}
                            />
                        ))}
                    </div>
                </div>

                {/* Finalize Button */}
                <div className="fixed bottom-0 left-0 right-0 lg:pl-72 p-6 bg-gradient-to-t from-background to-transparent">
                    <div className="max-w-3xl mx-auto">
                        <Button
                            onClick={handleFinalize}
                            className="w-full h-14 bg-gradient-to-r from-success to-success-dark text-white font-semibold shadow-lg shadow-success/30 hover:shadow-success/40 hover:-translate-y-0.5 transition-all"
                        >
                            <Check size={20} className="mr-2" />
                            Finalize Note
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
