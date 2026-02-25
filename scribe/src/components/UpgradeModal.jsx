import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useState } from 'react'
import { t } from '../i18n'
import { api } from '../api/client'

export default function UpgradeModal({ onClose }) {
    const [loading, setLoading] = useState(false)

    const handleUpgrade = async (planType) => {
        try {
            setLoading(planType) // 'pro' or 'clinic'
            const res = await api.createCheckoutSession({
                success_url: window.location.href, // Redirect right back here on success
                cancel_url: window.location.href,
                planType: planType
            })
            window.location.href = res.url // Redirect to Stripe
        } catch (err) {
            console.error('Failed to create checkout session:', err)
            // Fallback
            window.open('https://line.me/R/ti/p/@hannacare', '_blank')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 20
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                style={{
                    background: 'var(--color-bg)',
                    borderRadius: 24, padding: 32,
                    width: '100%', maxWidth: 400,
                    position: 'relative',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.1)'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: 20, right: 20,
                        background: 'var(--color-card)', border: 'none',
                        width: 32, height: 32, borderRadius: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-ink3)', cursor: 'pointer'
                    }}
                >
                    <X size={16} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 10 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.5px' }}>
                        Upgrade for Unlimited
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--color-ink3)', marginTop: 8, lineHeight: 1.5 }}>
                        You've reached your free limit. Choose a plan below to unlock unlimited AI transcription.
                    </p>
                </div>

                <div style={{
                    maxHeight: '60vh', overflowY: 'auto', paddingRight: 4, paddingBottom: 10,
                    display: 'flex', flexDirection: 'column', gap: 16
                }}>
                    {/* Pro Plan Card */}
                    <div style={{
                        background: 'var(--color-card)', borderRadius: 16, padding: 18,
                        border: '1px solid var(--color-border)', position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Pro Plan</h3>
                            <div style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--color-green)', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>Individual</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-1px' }}>฿1,990</span>
                            <span style={{ fontSize: 12, color: 'var(--color-ink3)' }}>/mo</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                            {['Unlimited SOAP Notes', 'Export to PDF', 'No transcription limits'].map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-ink2)' }}>
                                    <div style={{ background: 'var(--color-green)', borderRadius: '50%', padding: 2, color: '#fff' }}>
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        <motion.button
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            onClick={() => handleUpgrade('pro')}
                            disabled={!!loading}
                            style={{
                                width: '100%', padding: 12, borderRadius: 12,
                                background: 'var(--color-ink)', color: '#fff',
                                fontWeight: 700, fontSize: 14, border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading === 'pro' ? 'Opening Checkout...' : 'Select Pro'}
                        </motion.button>
                    </div>

                    {/* Clinic Plan Card */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(10,132,255,0.05) 0%, rgba(10,132,255,0.1) 100%)', borderRadius: 16, padding: 18,
                        border: '1px solid rgba(10,132,255,0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-accent)' }}>Clinic Plan</h3>
                            <div style={{ background: 'rgba(10,132,255,0.1)', color: 'var(--color-accent)', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>Up to 5 Users</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-1px' }}>฿4,990</span>
                            <span style={{ fontSize: 12, color: 'var(--color-ink3)' }}>/mo</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                            {['Everything in Pro', 'Invite up to 5 team members', 'Shared template access'].map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-ink2)' }}>
                                    <div style={{ background: 'var(--color-accent)', borderRadius: '50%', padding: 2, color: '#fff' }}>
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        <motion.button
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            onClick={() => handleUpgrade('clinic')}
                            disabled={!!loading}
                            style={{
                                width: '100%', padding: 12, borderRadius: 12,
                                background: 'var(--color-accent)', color: '#fff',
                                fontWeight: 700, fontSize: 14, border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading === 'clinic' ? 'Opening Checkout...' : 'Select Clinic'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
