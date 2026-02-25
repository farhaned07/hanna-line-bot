import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Mic, FileText, ListOrdered, AlignLeft, Loader2 } from 'lucide-react'
import { api } from '../api/client'
import { t } from '../i18n'

const TEMPLATES = [
    { key: 'soap', icon: FileText, desc: 'Subjective, Objective, Assessment, Plan' },
    { key: 'progress', icon: ListOrdered, desc: 'Daily progress note format' },
    { key: 'free', icon: AlignLeft, desc: 'Free-form clinical note' }
]

export default function NewSessionSheet({ onClose, onCreated }) {
    const [patientName, setPatientName] = useState('')
    const [patientHN, setPatientHN] = useState('')
    const [template, setTemplate] = useState('soap')
    const [loading, setLoading] = useState(false)

    const handleStart = async () => {
        setLoading(true)
        try {
            const session = await api.createSession({
                patient_name: patientName || 'Unknown Patient',
                patient_hn: patientHN || null,
                template_type: template
            })
            onCreated(session)
        } catch (err) {
            console.error('Failed to create session:', err)
            // For dev: navigate anyway with a mock ID
            onCreated({ id: 'demo-' + Date.now() })
        }
    }

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    zIndex: 50
                }}
            />

            {/* Sheet */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 380 }}
                style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
                    background: 'var(--color-bg)',
                    borderRadius: '24px 24px 0 0',
                    boxShadow: '0 -8px 40px rgba(0,0,0,0.12)'
                }}
            >
                {/* Handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 6px' }}>
                    <div style={{ width: 36, height: 5, borderRadius: 3, background: 'var(--color-border)' }} />
                </div>

                <div style={{ padding: '8px 24px 36px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.4px' }}>
                            {t('newSession.title')}
                        </h2>
                        <button
                            onClick={onClose}
                            style={{
                                width: 32, height: 32, borderRadius: 16,
                                background: 'var(--color-card)', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'var(--color-ink3)',
                                transition: 'background 0.2s'
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Patient Name */}
                    <div style={{ marginBottom: 14 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-ink2)', marginBottom: 8 }}>
                            {t('newSession.patientName')}
                        </label>
                        <input
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder={t('newSession.patientPlaceholder')}
                            className="scribe-input"
                            autoFocus
                        />
                    </div>

                    {/* HN */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-ink2)', marginBottom: 8 }}>
                            {t('newSession.hn')}
                        </label>
                        <input
                            type="text"
                            value={patientHN}
                            onChange={(e) => setPatientHN(e.target.value)}
                            placeholder={t('newSession.hnPlaceholder')}
                            className="scribe-input"
                        />
                    </div>

                    {/* Template */}
                    <div style={{ marginBottom: 28 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-ink2)', marginBottom: 10 }}>
                            {t('newSession.template')}
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {TEMPLATES.map(({ key, icon: Icon, desc }) => {
                                const isSelected = template === key
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setTemplate(key)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '14px 16px', borderRadius: 14,
                                            border: isSelected ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
                                            background: isSelected ? 'var(--color-accent-soft)' : 'var(--color-card)',
                                            cursor: 'pointer', textAlign: 'left',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Icon size={18} style={{
                                            color: isSelected ? 'var(--color-accent)' : 'var(--color-ink3)',
                                            flexShrink: 0
                                        }} />
                                        <div>
                                            <span style={{
                                                display: 'block', fontWeight: 600, fontSize: 14,
                                                color: isSelected ? 'var(--color-accent)' : 'var(--color-ink)',
                                                letterSpacing: '-0.1px'
                                            }}>
                                                {t(`template.${key}`)}
                                            </span>
                                            <span style={{
                                                display: 'block', fontSize: 12,
                                                color: 'var(--color-ink3)', marginTop: 1
                                            }}>
                                                {desc}
                                            </span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Start Button */}
                    <button onClick={handleStart} disabled={loading} className="btn-primary" style={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                    }}>
                        {loading ? (
                            <Loader2 size={18} className="ai-sparkle-rotate" />
                        ) : (
                            <Mic size={18} />
                        )}
                        {loading ? 'Starting...' : t('newSession.start')}
                    </button>
                </div>
            </motion.div>
        </>
    )
}
