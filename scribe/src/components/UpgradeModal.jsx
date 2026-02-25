import { motion } from 'framer-motion'
import { X, Check, Zap, Users, Crown } from 'lucide-react'
import { useState } from 'react'
import { api } from '../api/client'

export default function UpgradeModal({ onClose }) {
    const [loading, setLoading] = useState(false)

    const handleUpgrade = async (planType) => {
        try {
            setLoading(planType)
            const res = await api.createCheckoutSession({
                success_url: window.location.href,
                cancel_url: window.location.href,
                planType: planType
            })
            window.location.href = res.url
        } catch (err) {
            console.error('Failed to create checkout session:', err)
            window.open('https://line.me/R/ti/p/@hannacare', '_blank')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 20
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 16 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                    background: '#fff',
                    borderRadius: 24, padding: '28px 24px',
                    width: '100%', maxWidth: 380,
                    position: 'relative',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)'
                }}
            >
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: 16, right: 16,
                        background: '#F3F4F6', border: 'none',
                        width: 32, height: 32, borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#9CA3AF', cursor: 'pointer'
                    }}
                >
                    <X size={16} />
                </motion.button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 8 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 14, margin: '0 auto 14px',
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(99,102,241,0.3)'
                    }}>
                        <Zap size={22} color="#fff" />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                        Upgrade for Unlimited
                    </h2>
                    <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 6, lineHeight: 1.5 }}>
                        Unlock unlimited AI transcription and premium features.
                    </p>
                </div>

                {/* Plan Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Pro Plan */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '18px',
                        border: '1px solid #F0F0F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Crown size={16} color="#6366F1" />
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Pro</h3>
                            </div>
                            <span style={{
                                fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                                background: 'rgba(99,102,241,0.08)', color: '#6366F1',
                                letterSpacing: '0.3px'
                            }}>INDIVIDUAL</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 14 }}>
                            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', color: '#111827' }}>฿1,990</span>
                            <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>/month</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                            {['Unlimited SOAP Notes', 'Export to PDF', 'No transcription limits'].map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                                    <div style={{
                                        width: 18, height: 18, borderRadius: 5,
                                        background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(52,211,153,0.2) 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Check size={11} strokeWidth={3} color="#059669" />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        <motion.button
                            whileTap={!loading ? { scale: 0.97 } : {}}
                            onClick={() => handleUpgrade('pro')}
                            disabled={!!loading}
                            style={{
                                width: '100%', padding: 13, borderRadius: 12,
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                color: '#fff', fontWeight: 700, fontSize: 14, border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {loading === 'pro' ? 'Opening Checkout...' : 'Select Pro'}
                        </motion.button>
                    </div>

                    {/* Clinic Plan */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(99,102,241,0.03) 0%, rgba(139,92,246,0.06) 100%)',
                        borderRadius: 16, padding: '18px',
                        border: '1px solid rgba(99,102,241,0.12)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Users size={16} color="#6366F1" />
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#6366F1' }}>Clinic</h3>
                            </div>
                            <span style={{
                                fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                color: '#fff', letterSpacing: '0.3px'
                            }}>POPULAR</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 14 }}>
                            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', color: '#111827' }}>฿4,990</span>
                            <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>/month</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                            {['Everything in Pro', 'Up to 5 team members', 'Shared template access'].map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                                    <div style={{
                                        width: 18, height: 18, borderRadius: 5,
                                        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.15) 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Check size={11} strokeWidth={3} color="#6366F1" />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        <motion.button
                            whileTap={!loading ? { scale: 0.97 } : {}}
                            onClick={() => handleUpgrade('clinic')}
                            disabled={!!loading}
                            style={{
                                width: '100%', padding: 13, borderRadius: 12,
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                color: '#fff', fontWeight: 700, fontSize: 14, border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                                transition: 'opacity 0.2s'
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
