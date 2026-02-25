import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, FileDown, Sparkles, AlertTriangle, Users, Clock, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api/client'
import { t } from '../i18n'
import TabBar from '../components/TabBar'

export default function Handover() {
    const { user } = useAuth()
    const [handover, setHandover] = useState(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [generating, setGenerating] = useState(false)

    useEffect(() => {
        generateHandover()
    }, [])

    const generateHandover = async () => {
        setGenerating(true)
        setLoading(true)
        try {
            const data = await api.generateHandover()
            setHandover(data.handover || data)
        } catch (err) {
            console.error('Failed to generate handover:', err)
            setHandover({ patients: [] })
        } finally {
            setLoading(false)
            setGenerating(false)
        }
    }

    const handleCopy = () => {
        if (!handover) return
        const text = handover.patients.map((p, i) =>
            `${i + 1}. ${p.name}${p.is_urgent ? ' ⚠️' : ''}\n   ${p.summary}`
        ).join('\n\n')
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleExportPdf = () => {
        if (!handover) return
        api.downloadHandoverPdf(handover).catch(err => {
            console.error('PDF export failed:', err)
        })
    }

    const patients = handover?.patients || []
    const urgentCount = patients.filter(p => p.is_urgent).length

    return (
        <div style={{ minHeight: '100dvh', background: '#F5F5F5', paddingBottom: 90 }}>
            <div className="safe-top" style={{ padding: '0 20px 20px' }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.8px' }}>
                    {t('handover.title')}
                </h1>
            </div>

            <div style={{ padding: '0 20px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
                        ))}
                    </div>
                ) : handover ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Shift Info */}
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span className="badge badge-blue" style={{ fontSize: 11 }}>
                                    {t('handover.generated', { count: patients.length })}
                                </span>
                            </div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.4px' }}>
                                {handover.shift_type} · {handover.date}
                            </h2>
                            <p style={{ fontSize: 13, color: 'var(--color-ink3)', marginTop: 2 }}>
                                {handover.time_range} · {handover.nurse_name}
                            </p>
                        </div>

                        {/* Stats Row */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 20, marginBottom: 28 }}>
                            <motion.div
                                className="stat-card"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="stat-value">{patients.length}</div>
                                <div className="stat-label">
                                    <Users size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }} />
                                    patients
                                </div>
                            </motion.div>
                            <motion.div
                                className={`stat-card ${urgentCount > 0 ? 'urgent' : ''}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <div className="stat-value">{urgentCount}</div>
                                <div className="stat-label">
                                    <AlertTriangle size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }} />
                                    urgent
                                </div>
                            </motion.div>
                            <motion.div
                                className="stat-card"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="stat-value">{handover.total_minutes || 0}m</div>
                                <div className="stat-label">
                                    <Clock size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }} />
                                    min
                                </div>
                            </motion.div>
                        </div>

                        {/* Patient List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {patients.map((patient, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.06 }}
                                    className={`patient-card ${patient.is_urgent ? 'urgent' : ''}`}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', minWidth: 16 }}>{i + 1}</span>
                                                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-ink)', letterSpacing: '-0.2px' }}>
                                                    {patient.name}
                                                </span>
                                                {patient.is_urgent && (
                                                    <span className="badge badge-red urgent-pulse" style={{ fontSize: 10 }}>
                                                        <AlertTriangle size={10} /> Urgent
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ fontSize: 13, color: 'var(--color-ink2)', lineHeight: 1.5, paddingLeft: 24 }}>
                                                {patient.summary}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{ display: 'flex', gap: 10, marginTop: 24 }}
                        >
                            <button onClick={handleCopy} className="btn-secondary">
                                <Copy size={15} />
                                {copied ? '✓ Copied' : t('handover.copy')}
                            </button>
                            <button onClick={handleExportPdf} className="btn-secondary">
                                <FileDown size={15} />
                                {t('handover.exportPdf')}
                            </button>
                            <button
                                onClick={generateHandover}
                                disabled={generating}
                                style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: 'var(--color-card)', border: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', flexShrink: 0,
                                    transition: 'background 0.2s'
                                }}
                            >
                                {generating ? (
                                    <Loader2 size={18} className="ai-sparkle-rotate" style={{ color: 'var(--color-accent)' }} />
                                ) : (
                                    <Sparkles size={18} style={{ color: 'var(--color-accent)' }} />
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                ) : null}
            </div>

            <TabBar />
        </div>
    )
}
