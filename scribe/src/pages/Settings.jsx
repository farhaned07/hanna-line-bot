import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, ChevronRight, HelpCircle, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { t, setLanguage, getLanguage, setNoteLanguage, getNoteLanguage } from '../i18n'
import TabBar from '../components/TabBar'
import { api } from '../api/client'
import { useEffect } from 'react'
import UpgradeModal from '../components/UpgradeModal'

export default function Settings() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [appLang, setAppLang] = useState(getLanguage())
    const [noteLang, setNoteLang] = useState(getNoteLanguage())
    const [defaultTemplate, setDefaultTemplate] = useState('soap')
    const [autoFinalize, setAutoFinalize] = useState(false)
    const [billingStats, setBillingStats] = useState(null)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    useEffect(() => {
        loadBilling()
    }, [])

    const loadBilling = async () => {
        try {
            const data = await api.getBillingStatus()
            setBillingStats(data)
        } catch (err) {
            console.error('Failed to load billing status', err)
        }
    }

    const handleAppLang = (lang) => {
        setAppLang(lang)
        setLanguage(lang)
    }

    const handleNoteLang = (lang) => {
        setNoteLang(lang)
        setNoteLanguage(lang)
    }

    return (
        <div style={{ minHeight: '100dvh', background: '#F5F5F5', paddingBottom: 90 }}>
            <div className="safe-top" style={{ padding: '0 20px 20px' }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.8px' }}>
                    {t('settings.title')}
                </h1>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '16px 18px', borderRadius: 18,
                        background: '#fff',
                        border: '1px solid rgba(0,0,0,0.06)',
                        marginBottom: 32, cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                    }}
                >
                    <div style={{
                        width: 48, height: 48, borderRadius: 16,
                        background: 'linear-gradient(135deg, #E8F2FC 0%, #D4E8FC 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <User size={22} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-ink)', letterSpacing: '-0.2px' }}>
                            {user?.display_name || 'Doctor'}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--color-ink3)', marginTop: 1 }}>
                            {user?.email || 'demo@hanna.care'}
                        </p>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--color-ink3)', opacity: 0.5, flexShrink: 0 }} />
                </motion.div>

                {/* Billing Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.02 }}
                >
                    <p className="section-label">Subscription</p>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 28, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-ink)' }}>
                                    Hanna {billingStats?.plan ? billingStats.plan.charAt(0).toUpperCase() + billingStats.plan.slice(1) : 'Free'}
                                </p>
                                <p style={{ fontSize: 13, color: 'var(--color-ink3)', marginTop: 2 }}>
                                    {billingStats?.plan === 'free' ? 'Basic limits apply' : 'Unlimited Notes'}
                                </p>
                            </div>
                            <div className={`badge ${billingStats?.plan === 'free' ? 'badge-orange' : 'badge-green'}`}>
                                {billingStats?.plan === 'free' ? 'Free' : 'Pro'}
                            </div>
                        </div>

                        {billingStats?.plan === 'free' && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                                    <span style={{ color: 'var(--color-ink2)' }}>{billingStats?.notes_count_this_month || 0} / 10 Notes generated</span>
                                    <span style={{ color: 'var(--color-ink)' }}>{10 - (billingStats?.notes_count_this_month || 0)} left</span>
                                </div>
                                <div style={{ width: '100%', height: 6, background: 'rgba(0,0,0,0.05)', borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${Math.min(((billingStats?.notes_count_this_month || 0) / 10) * 100, 100)}%`,
                                        height: '100%',
                                        background: 'var(--color-accent)',
                                        borderRadius: 3
                                    }} />
                                </div>
                                <button
                                    onClick={() => setShowUpgradeModal(true)}
                                    style={{
                                        width: '100%', padding: '10px 0', borderRadius: 10,
                                        background: 'var(--color-ink)', color: '#fff',
                                        border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer'
                                    }}
                                >
                                    Upgrade to Pro
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Language Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <p className="section-label">{t('settings.language')}</p>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '4px 16px', marginBottom: 28, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <div className="settings-row">
                            <label>{t('settings.appLanguage')}</label>
                            <div className="toggle-pill">
                                <button className={appLang === 'th' ? 'active' : ''} onClick={() => handleAppLang('th')}>TH</button>
                                <button className={appLang === 'en' ? 'active' : ''} onClick={() => handleAppLang('en')}>EN</button>
                            </div>
                        </div>
                        <div className="settings-row" style={{ borderBottom: 'none' }}>
                            <label>{t('settings.noteOutput')}</label>
                            <div className="toggle-pill">
                                <button className={noteLang === 'en' ? 'active' : ''} onClick={() => handleNoteLang('en')}>EN</button>
                                <button className={noteLang === 'th' ? 'active' : ''} onClick={() => handleNoteLang('th')}>TH</button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Defaults Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <p className="section-label">{t('settings.defaults')}</p>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '4px 16px', marginBottom: 28, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <div className="settings-row">
                            <label>{t('settings.defaultTemplate')}</label>
                            <span className="badge badge-blue">{defaultTemplate.toUpperCase()}</span>
                        </div>
                        <div className="settings-row" style={{ borderBottom: 'none' }}>
                            <label>{t('settings.autoFinalize')}</label>
                            <button
                                className={`ios-toggle ${autoFinalize ? 'on' : ''}`}
                                onClick={() => setAutoFinalize(!autoFinalize)}
                                aria-label="Auto-finalize toggle"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* About Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <p className="section-label">{t('settings.about')}</p>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '4px 16px', marginBottom: 28, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <div className="settings-row">
                            <label>{t('settings.version')}</label>
                            <span style={{ fontSize: 14, color: 'var(--color-ink3)', fontVariantNumeric: 'tabular-nums' }}>1.0.0</span>
                        </div>
                        <div className="settings-row" style={{ borderBottom: 'none', cursor: 'pointer' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <HelpCircle size={16} style={{ color: 'var(--color-ink3)' }} />
                                {t('settings.help')}
                            </label>
                            <ChevronRight size={16} style={{ color: 'var(--color-ink3)', opacity: 0.5 }} />
                        </div>
                    </div>
                </motion.div>

                {/* Sign Out */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { logout(); navigate('/login', { replace: true }) }}
                    style={{
                        width: '100%', padding: 16, borderRadius: 14,
                        background: 'rgba(255, 69, 58, 0.08)',
                        color: 'var(--color-red)', fontWeight: 600, fontSize: 15,
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'background 0.2s'
                    }}
                >
                    <LogOut size={16} />
                    {t('settings.signOut')}
                </motion.button>
            </div>

            {showUpgradeModal && (
                <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
            )}

            <TabBar />
        </div>
    )
}
