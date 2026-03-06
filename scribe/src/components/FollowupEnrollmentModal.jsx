import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Calendar, Phone, CheckCircle } from 'lucide-react'
import { api } from '../api/client'
import { t } from '../i18n'

export default function FollowupEnrollmentModal({ session, onClose }) {
    const [step, setStep] = useState(1) // 1: consent, 2: details, 3: success
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        patient_name: session?.patient_name || '',
        patient_hn: session?.patient_hn || '',
        phone: '',
        line_consent: false,
        type: 'chronic',
        duration_days: 14
    })

    const handleEnroll = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await api.enrollFollowup({
                ...formData,
                scribe_session_id: session?.id
            })

            console.log('[Followup] Enrollment successful:', res)
            setStep(3) // Success

            // Auto-close after 2 seconds
            setTimeout(() => {
                onClose()
            }, 2000)

        } catch (err) {
            console.error('[Followup] Enrollment error:', err)
            setError(err.message || 'Enrollment failed')
        } finally {
            setLoading(false)
        }
    }

    const canSubmit = step === 1 
        ? formData.line_consent 
        : formData.phone && formData.patient_name

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 16 }}
                transition={{ duration: 0.3 }}
                style={{
                    background: '#fff',
                    borderRadius: 24,
                    padding: '28px 24px',
                    width: '100%',
                    maxWidth: 420,
                    position: 'relative',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.12)'
                }}
            >
                {/* Close button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: '#F3F4F6',
                        border: 'none',
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9CA3AF',
                        cursor: 'pointer'
                    }}
                >
                    <X size={16} />
                </motion.button>

                {/* Progress indicator */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 24
                }}>
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: i <= step ? '#6366F1' : '#E5E7EB',
                                transition: 'background 0.3s'
                            }}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 16,
                                    margin: '0 auto 16px',
                                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 16px rgba(99,102,241,0.3)'
                                }}>
                                    <Users size={28} color="#fff" />
                                </div>
                                <h2 style={{
                                    fontSize: 22,
                                    fontWeight: 800,
                                    color: '#111827',
                                    marginBottom: 8
                                }}>
                                    Enroll in Follow-up Program
                                </h2>
                                <p style={{
                                    fontSize: 14,
                                    color: '#6B7280',
                                    lineHeight: 1.5
                                }}>
                                    Monitor patient recovery via LINE messages for 14 days.
                                    Automated Day 1/3/7/14 check-ins.
                                </p>
                            </div>

                            {/* Consent checkbox */}
                            <label style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                                padding: 16,
                                background: '#F9FAFB',
                                borderRadius: 12,
                                marginBottom: 20,
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={formData.line_consent}
                                    onChange={(e) => setFormData({ ...formData, line_consent: e.target.checked })}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginTop: 2,
                                        accentColor: '#6366F1'
                                    }}
                                />
                                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
                                    <strong>Patient Consent Required</strong>
                                    <br />
                                    Patient has consented to receive automated LINE messages for follow-up care.
                                    Messages include daily check-ins, medication reminders, and symptom monitoring.
                                </div>
                            </label>

                            {/* Info box */}
                            <div style={{
                                padding: 16,
                                background: '#EFF6FF',
                                borderRadius: 12,
                                marginBottom: 24
                            }}>
                                <div style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
                                    <strong>📋 What's included:</strong>
                                    <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                                        <li>Welcome message</li>
                                        <li>Day 1: Mood & symptoms check-in</li>
                                        <li>Day 3: Medication adherence check</li>
                                        <li>Day 7: Symptoms assessment</li>
                                        <li>Day 14: Final recovery rating</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Continue button */}
                            <motion.button
                                whileTap={!loading && canSubmit ? { scale: 0.97 } : {}}
                                onClick={() => setStep(2)}
                                disabled={!canSubmit || loading}
                                style={{
                                    width: '100%',
                                    padding: 14,
                                    borderRadius: 12,
                                    background: canSubmit
                                        ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                                        : '#E5E7EB',
                                    color: canSubmit ? '#fff' : '#9CA3AF',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    border: 'none',
                                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                                    boxShadow: canSubmit ? '0 4px 14px rgba(99,102,241,0.3)' : 'none'
                                }}
                            >
                                Continue
                            </motion.button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 16,
                                    margin: '0 auto 16px',
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
                                }}>
                                    <Calendar size={28} color="#fff" />
                                </div>
                                <h2 style={{
                                    fontSize: 22,
                                    fontWeight: 800,
                                    color: '#111827',
                                    marginBottom: 8
                                }}>
                                    Patient Details
                                </h2>
                                <p style={{ fontSize: 14, color: '#6B7280' }}>
                                    Enter patient information for follow-up
                                </p>
                            </div>

                            {/* Patient name */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: '#6B7280',
                                    marginBottom: 6,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Patient Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.patient_name}
                                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                                    placeholder="คุณสมชาย ใจดี"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: 10,
                                        background: '#F9FAFB',
                                        border: '1px solid #E5E7EB',
                                        color: '#111827',
                                        fontSize: 15,
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            {/* HN */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: '#6B7280',
                                    marginBottom: 6,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Hospital Number (HN)
                                </label>
                                <input
                                    type="text"
                                    value={formData.patient_hn}
                                    onChange={(e) => setFormData({ ...formData, patient_hn: e.target.value })}
                                    placeholder="64-001234"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: 10,
                                        background: '#F9FAFB',
                                        border: '1px solid #E5E7EB',
                                        color: '#111827',
                                        fontSize: 15,
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            {/* Phone */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: '#6B7280',
                                    marginBottom: 6,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Phone Number *
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Phone
                                        size={18}
                                        color="#9CA3AF"
                                        style={{
                                            position: 'absolute',
                                            left: 14,
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                    />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="081-234-5678"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px 12px 44px',
                                            borderRadius: 10,
                                            background: '#F9FAFB',
                                            border: '1px solid #E5E7EB',
                                            color: '#111827',
                                            fontSize: 15,
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Follow-up type */}
                            <div style={{ marginBottom: 24 }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: '#6B7280',
                                    marginBottom: 8,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Follow-up Type
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {[
                                        { value: 'chronic', label: 'Chronic Care', days: '14 days' },
                                        { value: 'post-op', label: 'Post-Op', days: '7 days' },
                                        { value: 'medication', label: 'Medication', days: '30 days' },
                                        { value: 'general', label: 'General', days: '14 days' }
                                    ].map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => setFormData({
                                                ...formData,
                                                type: type.value,
                                                duration_days: parseInt(type.days)
                                            })}
                                            style={{
                                                padding: '10px 12px',
                                                borderRadius: 10,
                                                background: formData.type === type.value
                                                    ? 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)'
                                                    : '#F9FAFB',
                                                border: formData.type === type.value
                                                    ? '2px solid #6366F1'
                                                    : '1px solid #E5E7EB',
                                                textAlign: 'left',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: formData.type === type.value ? '#6366F1' : '#374151'
                                            }}>
                                                {type.label}
                                            </div>
                                            <div style={{
                                                fontSize: 11,
                                                color: '#9CA3AF',
                                                marginTop: 2
                                            }}>
                                                {type.days}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div style={{
                                    padding: 12,
                                    background: '#FEF2F2',
                                    borderRadius: 10,
                                    marginBottom: 16,
                                    fontSize: 13,
                                    color: '#DC2626'
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                    style={{
                                        flex: 1,
                                        padding: 14,
                                        borderRadius: 12,
                                        background: '#F3F4F6',
                                        color: '#374151',
                                        fontWeight: 600,
                                        fontSize: 15,
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Back
                                </motion.button>
                                <motion.button
                                    whileTap={!loading && canSubmit ? { scale: 0.97 } : {}}
                                    onClick={handleEnroll}
                                    disabled={!canSubmit || loading}
                                    style={{
                                        flex: 2,
                                        padding: 14,
                                        borderRadius: 12,
                                        background: canSubmit
                                            ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                                            : '#E5E7EB',
                                        color: canSubmit ? '#fff' : '#9CA3AF',
                                        fontWeight: 700,
                                        fontSize: 15,
                                        border: 'none',
                                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                                        boxShadow: canSubmit ? '0 4px 14px rgba(99,102,241,0.3)' : 'none'
                                    }}
                                >
                                    {loading ? 'Enrolling...' : 'Enroll Patient'}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{ textAlign: 'center', padding: '40px 20px' }}
                        >
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                margin: '0 auto 24px',
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
                            }}>
                                <CheckCircle size={40} color="#fff" />
                            </div>
                            <h2 style={{
                                fontSize: 24,
                                fontWeight: 800,
                                color: '#111827',
                                marginBottom: 8
                            }}>
                                Patient Enrolled!
                            </h2>
                            <p style={{ fontSize: 15, color: '#6B7280' }}>
                                Follow-up program started. Patient will receive LINE messages.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
