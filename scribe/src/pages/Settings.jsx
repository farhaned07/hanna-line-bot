import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api/client'
import { t, getLocale, setLocale } from '../i18n'
import TabBar from '../components/TabBar'
import UpgradeModal from '../components/UpgradeModal'
import { User, ChevronRight, Globe, FileText, Zap, Info, HelpCircle, LogOut } from 'lucide-react'

export default function Settings() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [lang, setLang] = useState(getLocale())
    const [noteLang, setNoteLang] = useState(localStorage.getItem('scribe_note_lang') || 'en')
    const [autoFinalize, setAutoFinalize] = useState(localStorage.getItem('scribe_auto_finalize') === 'true')
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [billingStats, setBillingStats] = useState(null)

    useEffect(() => {
        loadBilling()
    }, [])

    const loadBilling = async () => {
        try {
            const data = await api.getBillingStatus()
            setBillingStats(data)
        } catch (err) { }
    }

    const toggleLang = (newLang) => {
        setLang(newLang)
        setLocale(newLang)
    }

    const toggleNoteLang = (newLang) => {
        setNoteLang(newLang)
        localStorage.setItem('scribe_note_lang', newLang)
    }

    const toggleAutoFinalize = () => {
        const next = !autoFinalize
        setAutoFinalize(next)
        localStorage.setItem('scribe_auto_finalize', next.toString())
    }

    const isPro = billingStats?.plan && billingStats.plan !== 'free'

    const anim = (delay) => ({
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, ease: [0.25, 0.46, 0.45, 0.94] }
    })

    return (
        <div style={{ minHeight: '100dvh', background: '#FAFAFA', paddingBottom: 90 }}>
            <div className="safe-top" style={{ padding: '0 20px 24px' }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: '#111827', letterSpacing: '-1px' }}>
                    Settings
                </h1>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* Profile */}
                <motion.div {...anim(0)}>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '16px',
                        border: '1px solid #F0F0F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28
                    }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.12) 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <User size={22} color="#6366F1" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: 16, color: '#111827', letterSpacing: '-0.2px' }}>
                                {user?.display_name || 'Doctor'}
                            </p>
                            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 1 }}>
                                {user?.email}
                            </p>
                        </div>
                        <ChevronRight size={16} color="#D1D5DB" />
                    </div>
                </motion.div>

                {/* Subscription */}
                <motion.div {...anim(0.05)}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, paddingLeft: 2 }}>
                        Subscription
                    </p>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '16px',
                        border: '1px solid #F0F0F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        marginBottom: 28
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isPro ? 0 : 14 }}>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: 16, color: '#111827', letterSpacing: '-0.2px' }}>
                                    Hanna {billingStats?.plan ? billingStats.plan.charAt(0).toUpperCase() + billingStats.plan.slice(1) : 'Free'}
                                </p>
                                <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
                                    {isPro ? 'Unlimited Notes' : 'Basic limits apply'}
                                </p>
                            </div>
                            <span style={{
                                fontSize: 11, fontWeight: 700,
                                padding: '4px 10px', borderRadius: 8,
                                background: isPro
                                    ? 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.15) 100%)'
                                    : 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.12) 100%)',
                                color: isPro ? '#059669' : '#6366F1',
                                letterSpacing: '0.5px'
                            }}>
                                {isPro ? 'PRO' : 'FREE'}
                            </span>
                        </div>

                        {!isPro && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                                    <span style={{ color: '#6B7280' }}>{billingStats?.notes_count_this_month || 0} / 10 notes</span>
                                    <span style={{ color: '#111827', fontWeight: 600 }}>{10 - (billingStats?.notes_count_this_month || 0)} left</span>
                                </div>
                                <div style={{ width: '100%', height: 6, background: '#F3F4F6', borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${Math.min(((billingStats?.notes_count_this_month || 0) / 10) * 100, 100)}%`,
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                        borderRadius: 3, transition: 'width 0.5s ease'
                                    }} />
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowUpgradeModal(true)}
                                    style={{
                                        width: '100%', padding: '12px 0', borderRadius: 12,
                                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                        color: '#fff', border: 'none', fontWeight: 700, fontSize: 14,
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
                                    }}
                                >
                                    Upgrade to Pro
                                </motion.button>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Language */}
                <motion.div {...anim(0.1)}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, paddingLeft: 2 }}>
                        {t('settings.language')}
                    </p>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '0',
                        border: '1px solid #F0F0F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        marginBottom: 28, overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                            <span style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>{t('settings.appLang')}</span>
                            <div style={{ display: 'flex', borderRadius: 10, background: '#F3F4F6', padding: 3, gap: 2 }}>
                                {['TH', 'EN'].map(l => (
                                    <button key={l} onClick={() => toggleLang(l.toLowerCase())}
                                        style={{
                                            padding: '6px 14px', borderRadius: 8, border: 'none',
                                            fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                            letterSpacing: '0.5px',
                                            background: lang === l.toLowerCase() ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
                                            color: lang === l.toLowerCase() ? '#fff' : '#9CA3AF',
                                            boxShadow: lang === l.toLowerCase() ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    >{l}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ height: 1, background: '#F3F4F6', margin: '0 16px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                            <span style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>{t('settings.noteLang')}</span>
                            <div style={{ display: 'flex', borderRadius: 10, background: '#F3F4F6', padding: 3, gap: 2 }}>
                                {['EN', 'TH'].map(l => (
                                    <button key={l} onClick={() => toggleNoteLang(l.toLowerCase())}
                                        style={{
                                            padding: '6px 14px', borderRadius: 8, border: 'none',
                                            fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                            letterSpacing: '0.5px',
                                            background: noteLang === l.toLowerCase() ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
                                            color: noteLang === l.toLowerCase() ? '#fff' : '#9CA3AF',
                                            boxShadow: noteLang === l.toLowerCase() ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    >{l}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Defaults */}
                <motion.div {...anim(0.15)}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, paddingLeft: 2 }}>
                        {t('settings.defaults')}
                    </p>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '0',
                        border: '1px solid #F0F0F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        marginBottom: 28, overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                            <span style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>{t('settings.defaultTemplate')}</span>
                            <span style={{
                                fontSize: 12, fontWeight: 700, color: '#6366F1',
                                background: 'rgba(99,102,241,0.08)', padding: '4px 10px', borderRadius: 8,
                                letterSpacing: '0.5px'
                            }}>SOAP</span>
                        </div>
                        <div style={{ height: 1, background: '#F3F4F6', margin: '0 16px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                            <span style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>{t('settings.autoFinalize')}</span>
                            <button
                                onClick={toggleAutoFinalize}
                                className={`ios-toggle ${autoFinalize ? 'on' : ''}`}
                                style={{ background: autoFinalize ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : '#E5E7EB' }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* About */}
                <motion.div {...anim(0.2)}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, paddingLeft: 2 }}>
                        {t('settings.about')}
                    </p>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '0',
                        border: '1px solid #F0F0F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        marginBottom: 28, overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                            <span style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>{t('settings.version')}</span>
                            <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>1.2.0</span>
                        </div>
                        <div style={{ height: 1, background: '#F3F4F6', margin: '0 16px' }} />
                        <button style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer'
                        }}>
                            <span style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>{t('settings.help')}</span>
                            <ChevronRight size={16} color="#D1D5DB" />
                        </button>
                    </div>
                </motion.div>

                {/* Sign Out */}
                <motion.div {...anim(0.25)}>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { logout(); navigate('/login', { replace: true }) }}
                        style={{
                            width: '100%', padding: '14px', borderRadius: 14,
                            background: '#fff', border: '1px solid #F0F0F0',
                            color: '#EF4444', fontWeight: 600, fontSize: 15,
                            cursor: 'pointer', marginBottom: 20,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                    >
                        {t('settings.signOut')}
                    </motion.button>
                </motion.div>
            </div>

            {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
            <TabBar />
        </div>
    )
}
