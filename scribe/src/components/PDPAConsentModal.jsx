import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, FileText, Check, Eye } from 'lucide-react'

export default function PDPAConsentModal({ isOpen, onAccept, onDecline }) {
    const [accepted, setAccepted] = useState({
        essential: true,
        analytics: false,
        improvement: false
    })

    const handleAccept = () => {
        localStorage.setItem('scribe_pdpa_consent', JSON.stringify({
            accepted: true,
            timestamp: new Date().toISOString(),
            preferences: accepted
        }))
        onAccept()
    }

    const handleDecline = () => {
        localStorage.setItem('scribe_pdpa_consent', JSON.stringify({
            accepted: false,
            timestamp: new Date().toISOString()
        }))
        onDecline()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1000,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20
                }}
                onClick={handleDecline}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    style={{
                        background: '#FFFFFF',
                        borderRadius: 24,
                        padding: 32,
                        maxWidth: 480,
                        width: '100%',
                        maxHeight: '90dvh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="pdpa-title"
                >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)'
                        }}>
                            <Shield size={28} color="#6366F1" />
                        </div>
                        <h2 id="pdpa-title" style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: '#111827',
                            marginBottom: 8,
                            letterSpacing: '-0.5px'
                        }}>
                            Your Privacy Matters
                        </h2>
                        <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>
                            We comply with Thailand's PDPA (Personal Data Protection Act)
                        </p>
                    </div>

                    {/* What we collect */}
                    <div style={{
                        background: '#F9FAFB',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 20
                    }}>
                        <h3 style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                            marginBottom: 12
                        }}>
                            What data we collect
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                { icon: '📝', text: 'Clinical notes you create' },
                                { icon: '🎤', text: 'Voice recordings (deleted after transcription)' },
                                { icon: '👤', text: 'Your name and email for authentication' },
                                { icon: '🏥', text: 'Patient identifiers (HN, name)' }
                            ].map((item, i) => (
                                <li key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginBottom: 10,
                                    fontSize: 14,
                                    color: '#374151'
                                }}>
                                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* How we use it */}
                    <div style={{
                        background: '#F9FAFB',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 20
                    }}>
                        <h3 style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                            marginBottom: 12
                        }}>
                            How we use your data
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                { icon: '✨', text: 'Generate clinical notes using AI' },
                                { icon: '🔒', text: 'Store securely with encryption' },
                                { icon: '📤', text: 'Export as PDF for your records' },
                                { icon: '🚫', text: 'Never sell or share with third parties' }
                            ].map((item, i) => (
                                <li key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginBottom: 10,
                                    fontSize: 14,
                                    color: '#374151'
                                }}>
                                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Consent toggles */}
                    <div style={{ marginBottom: 24 }}>
                        <h3 style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                            marginBottom: 12
                        }}>
                            Your preferences
                        </h3>

                        {/* Essential - always on */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 14,
                            borderRadius: 12,
                            background: '#F3F4F6',
                            marginBottom: 10,
                            opacity: 0.6
                        }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                                    Essential data processing
                                </p>
                                <p style={{ fontSize: 12, color: '#6B7280' }}>
                                    Required for core functionality
                                </p>
                            </div>
                            <div style={{
                                width: 44,
                                height: 24,
                                borderRadius: 12,
                                background: '#10B981',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    right: 2,
                                    top: 2,
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    background: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }} />
                            </div>
                        </div>

                        {/* Analytics */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 14,
                            borderRadius: 12,
                            background: '#FFFFFF',
                            border: '1px solid #F0F0F0',
                            marginBottom: 10
                        }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                                    Usage analytics
                                </p>
                                <p style={{ fontSize: 12, color: '#6B7280' }}>
                                    Help us improve with anonymous usage data
                                </p>
                            </div>
                            <button
                                onClick={() => setAccepted(prev => ({ ...prev, analytics: !prev.analytics }))}
                                style={{
                                    width: 44,
                                    height: 24,
                                    borderRadius: 12,
                                    background: accepted.analytics ? '#6366F1' : '#E5E7EB',
                                    position: 'relative',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                                aria-label="Toggle analytics consent"
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 2,
                                    left: accepted.analytics ? 22 : 2,
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    background: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }} />
                            </button>
                        </div>

                        {/* AI Improvement */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 14,
                            borderRadius: 12,
                            background: '#FFFFFF',
                            border: '1px solid #F0F0F0'
                        }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                                    AI model improvement
                                </p>
                                <p style={{ fontSize: 12, color: '#6B7280' }}>
                                    Anonymized notes to improve AI accuracy
                                </p>
                            </div>
                            <button
                                onClick={() => setAccepted(prev => ({ ...prev, improvement: !prev.improvement }))}
                                style={{
                                    width: 44,
                                    height: 24,
                                    borderRadius: 12,
                                    background: accepted.improvement ? '#6366F1' : '#E5E7EB',
                                    position: 'relative',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                                aria-label="Toggle AI improvement consent"
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 2,
                                    left: accepted.improvement ? 22 : 2,
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    background: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }} />
                            </button>
                        </div>
                    </div>

                    {/* Links */}
                    <div style={{
                        display: 'flex',
                        gap: 12,
                        justifyContent: 'center',
                        marginBottom: 20
                    }}>
                        <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                fontSize: 13,
                                color: '#6366F1',
                                textDecoration: 'none',
                                fontWeight: 500
                            }}
                        >
                            <FileText size={14} />
                            Privacy Policy
                        </a>
                        <span style={{ color: '#E5E7EB' }}>•</span>
                        <a
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                fontSize: 13,
                                color: '#6366F1',
                                textDecoration: 'none',
                                fontWeight: 500
                            }}
                        >
                            <Eye size={14} />
                            Terms of Service
                        </a>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={handleDecline}
                            style={{
                                flex: 1,
                                padding: 14,
                                borderRadius: 12,
                                background: '#F3F4F6',
                                color: '#374151',
                                fontWeight: 600,
                                fontSize: 15,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            Decline
                        </button>
                        <button
                            onClick={handleAccept}
                            style={{
                                flex: 1,
                                padding: 14,
                                borderRadius: 12,
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 15,
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                                transition: 'transform 0.15s, box-shadow 0.2s'
                            }}
                        >
                            Accept & Continue
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
