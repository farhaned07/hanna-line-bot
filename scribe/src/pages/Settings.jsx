import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api/client'
import { t, getLocale, setLocale } from '../i18n'
import TabBar from '../components/TabBar'
import UpgradeModal from '../components/UpgradeModal'
import MedicalDisclaimer from '../components/MedicalDisclaimer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { User, ChevronRight, Globe, FileText, Zap, Info, HelpCircle, LogOut, CreditCard, Bell, Shield } from 'lucide-react'

export default function Settings() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()
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
        toast({
            title: "Language updated",
            description: `App language changed to ${newLang === 'en' ? 'English' : 'ไทย'}`,
            duration: 2000
        })
    }

    const toggleNoteLang = (newLang) => {
        setNoteLang(newLang)
        localStorage.setItem('scribe_note_lang', newLang)
        toast({
            title: "Note language updated",
            description: `Notes will be generated in ${newLang === 'en' ? 'English' : 'ไทย'}`,
            duration: 2000
        })
    }

    const toggleAutoFinalize = () => {
        const next = !autoFinalize
        setAutoFinalize(next)
        localStorage.setItem('scribe_auto_finalize', next.toString())
        toast({
            title: autoFinalize ? 'Auto-finalize disabled' : 'Auto-finalize enabled',
            description: next ? 'Notes will require manual finalization' : 'Notes will be auto-finalized',
            duration: 2000
        })
    }

    const isPro = billingStats?.plan && billingStats.plan !== 'free'

    const anim = (delay) => ({
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: delay * 0.05, duration: 0.2 }
    })

    return (
        <div className="min-h-dvh bg-background pb-24">
            {/* Header */}
            <div className="safe-top px-6 pt-12 pb-6 border-b border-border">
                <motion.h1 
                    {...anim(0)}
                    className="text-2xl font-bold text-foreground mb-2"
                >
                    {t('settings.title')}
                </motion.h1>
                <motion.p 
                    {...anim(0.1)}
                    className="text-sm text-muted-foreground"
                >
                    Manage your account and preferences
                </motion.p>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
                {/* Profile Section */}
                <motion.div {...anim(0.2)}>
                    <Card className="border-border bg-card shadow-md">
                        <CardContent className="p-0">
                            <div className="flex items-center gap-4 p-4 border-b border-border">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                                    {user?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground">
                                        {user?.display_name || user?.email?.split('@')[0] || 'User'}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {user?.email || 'user@example.com'}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground">
                                    <User size={20} />
                                </Button>
                            </div>
                            
                            {/* Plan Badge */}
                            <div className="p-4 bg-accent/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium mb-1">Current Plan</p>
                                        <Badge variant={isPro ? 'success' : 'secondary'} className="font-semibold">
                                            {billingStats?.plan?.toUpperCase() || 'FREE'}
                                        </Badge>
                                    </div>
                                    {!isPro && (
                                        <Button
                                            size="sm"
                                            onClick={() => setShowUpgradeModal(true)}
                                            className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-primary-glow"
                                        >
                                            Upgrade
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Usage Stats */}
                {billingStats && (
                    <motion.div {...anim(0.3)}>
                        <Card className="border-border bg-card shadow-md">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground font-medium">Notes This Month</p>
                                        <p className="text-xl font-semibold text-foreground">
                                            {billingStats.notes_count || 0}
                                            {billingStats.plan === 'free' && (
                                                <span className="text-xs font-normal text-muted-foreground ml-1">
                                                    / 10
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Language Settings */}
                <motion.div {...anim(0.4)}>
                    <div className="mb-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            {t('settings.language')}
                        </p>
                    </div>
                    
                    <Card className="border-border bg-card shadow-md">
                        <CardContent className="p-0">
                            {/* App Language */}
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{t('settings.appLanguage')}</p>
                                        <p className="text-xs text-muted-foreground">Interface language</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={lang === 'en' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => toggleLang('en')}
                                        className="h-8 text-xs"
                                    >
                                        EN
                                    </Button>
                                    <Button
                                        variant={lang === 'th' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => toggleLang('th')}
                                        className="h-8 text-xs"
                                    >
                                        TH
                                    </Button>
                                </div>
                            </div>

                            {/* Note Language */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{t('settings.noteOutput')}</p>
                                        <p className="text-xs text-muted-foreground">AI note generation language</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={noteLang === 'en' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => toggleNoteLang('en')}
                                        className="h-8 text-xs"
                                    >
                                        EN
                                    </Button>
                                    <Button
                                        variant={noteLang === 'th' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => toggleNoteLang('th')}
                                        className="h-8 text-xs"
                                    >
                                        TH
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Preferences */}
                <motion.div {...anim(0.5)}>
                    <div className="mb-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            {t('settings.defaults')}
                        </p>
                    </div>
                    
                    <Card className="border-border bg-card shadow-md">
                        <CardContent className="p-0">
                            {/* Auto-finalize */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCheck size={18} className="text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{t('settings.autoFinalize')}</p>
                                        <p className="text-xs text-muted-foreground">Automatically finalize notes</p>
                                    </div>
                                </div>
                                <Button
                                    variant={autoFinalize ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={toggleAutoFinalize}
                                    className="h-6 w-11 px-0.5"
                                >
                                    <div className={`w-5 h-5 rounded-full bg-primary-foreground shadow-md transition-transform ${autoFinalize ? 'translate-x-5' : ''}`} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Help & Support */}
                <motion.div {...anim(0.6)}>
                    <div className="mb-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            {t('settings.about')}
                        </p>
                    </div>
                    
                    <Card className="border-border bg-card shadow-md">
                        <CardContent className="p-0">
                            <button
                                onClick={() => window.open('https://hanna.care/help', '_blank')}
                                className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <HelpCircle size={18} className="text-primary" />
                                    <span className="text-sm font-semibold text-foreground">{t('settings.help')}</span>
                                </div>
                                <ChevronRight size={16} className="text-muted-foreground" />
                            </button>

                            <div className="border-t border-border" />

                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Info size={18} className="text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Version</p>
                                        <p className="text-xs text-muted-foreground">Current build</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="font-mono text-xs">
                                    1.0.0
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* PDPA & Data */}
                <motion.div {...anim(0.7)}>
                    <div className="mb-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            Data & Privacy (PDPA)
                        </p>
                    </div>
                    
                    <Card className="border-border bg-card shadow-md">
                        <CardContent className="p-0">
                            <button
                                onClick={() => toast({ title: 'Data export', description: 'Contact support@hanna.care for data export' })}
                                className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-primary" />
                                    <span className="text-sm font-semibold text-foreground">Export My Data</span>
                                </div>
                                <ChevronRight size={16} className="text-muted-foreground" />
                            </button>

                            <div className="border-t border-border" />

                            <button
                                onClick={() => {
                                    if (window.confirm('⚠️ Are you sure? This will permanently delete all your data.')) {
                                        toast({ 
                                            title: 'Account deletion', 
                                            description: 'Contact support@hanna.care for account deletion',
                                            variant: 'destructive'
                                        })
                                    }
                                }}
                                className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Zap size={18} className="text-destructive" />
                                    <span className="text-sm font-semibold text-destructive">Delete Account</span>
                                </div>
                                <ChevronRight size={16} className="text-destructive" />
                            </button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Medical Disclaimer */}
                <motion.div {...anim(0.8)}>
                    <MedicalDisclaimer />
                </motion.div>

                {/* Sign Out */}
                <motion.div {...anim(0.9)}>
                    <Button
                        variant="destructive"
                        onClick={() => { logout(); navigate('/login', { replace: true }) }}
                        className="w-full h-11 font-semibold"
                    >
                        <LogOut size={18} className="mr-2" />
                        {t('settings.signOut')}
                    </Button>
                </motion.div>
            </div>

            {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
            <TabBar />
        </div>
    )
}
