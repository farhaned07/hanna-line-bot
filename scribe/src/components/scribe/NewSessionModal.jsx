import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, FileText, Activity } from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function NewSessionModal({ isOpen, onClose, onSubmit }) {
    const [patientName, setPatientName] = useState('');
    const [patientHn, setPatientHn] = useState('');
    const [templateType, setTemplateType] = useState('soap');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const session = await sessionsApi.create(patientName, patientHn, templateType);
            onSubmit({ sessionId: session.id, ...session });
        } catch (err) {
            setError(err.message || 'Failed to create session');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background-secondary">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        New Session
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Start a new voice documentation session
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {error && (
                                    <div className="p-3 bg-critical/10 border border-critical/20 rounded-xl text-critical text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Patient Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                                        Patient Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                            placeholder="Enter patient name"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background-secondary text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all input-focus"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Hospital Number */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                                        Hospital Number (HN)
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={patientHn}
                                            onChange={(e) => setPatientHn(e.target.value)}
                                            placeholder="Enter HN (optional)"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background-secondary text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all input-focus"
                                        />
                                    </div>
                                </div>

                                {/* Template Type */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                                        Note Type
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: 'soap', label: 'SOAP', icon: Activity },
                                            { value: 'progress', label: 'Progress', icon: FileText },
                                            { value: 'free', label: 'Free', icon: FileText },
                                        ].map((template) => (
                                            <button
                                                key={template.value}
                                                type="button"
                                                onClick={() => setTemplateType(template.value)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                                    templateType === template.value
                                                        ? 'bg-primary/10 border-primary/20 text-primary'
                                                        : 'bg-background-secondary border-border text-muted-foreground hover:bg-white/5'
                                                }`}
                                            >
                                                <template.icon size={20} />
                                                <span className="text-sm font-medium">
                                                    {template.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={onClose}
                                        className="flex-1 h-12"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading || !patientName}
                                        className="flex-1 h-12 bg-gradient-to-r from-primary to-primary-hover"
                                    >
                                        {loading ? 'Creating...' : 'Start Recording'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
