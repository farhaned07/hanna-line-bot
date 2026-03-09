import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, User, Loader2, Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { t, getLocale, setLocale } from '../i18n'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PDPAConsentModal from '../components/PDPAConsentModal'

export default function Login() {
    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [error, setError] = useState(null)
    const [lang, setLang] = useState(getLocale())
    const [showPDPA, setShowPDPA] = useState(false)
    const navigate = useNavigate()
    const { login, register, loading } = useAuth()

    useEffect(() => {
        const consent = localStorage.getItem('scribe_pdpa_consent')
        if (!consent) {
            setShowPDPA(true)
        }
    }, [])

    const toggleLang = () => {
        const next = lang === 'en' ? 'th' : 'en'
        setLocale(next)
        setLang(next)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        const consent = localStorage.getItem('scribe_pdpa_consent')
        if (!consent) {
            setShowPDPA(true)
            return
        }

        try {
            if (isRegister) {
                await register({ email, displayName })
                localStorage.setItem('scribe_onboarded', 'true')
                navigate('/', { replace: true })
            } else {
                await login(email)
                localStorage.setItem('scribe_onboarded', 'true')
                navigate('/', { replace: true })
            }
        } catch (err) {
            setError(err.message || t('login.error'))
        }
    }

    const canSubmit = email.includes('@') && (!isRegister || displayName.trim())

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
            {/* Top Controls */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleLang}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-muted-foreground text-xs font-medium hover:bg-accent transition-all"
                >
                    {lang === 'en' ? 'EN' : 'TH'}
                </motion.button>
            </div>

            {/* Content */}
            <div className="w-full max-w-md">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Shield className="w-8 h-8 text-blue-400" />
                        <h1 className="text-2xl font-semibold text-foreground">
                            hanna
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {isRegister ? 'Join thousands of doctors' : 'Clinical Documentation System'}
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-border bg-card shadow-lg">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-lg font-semibold text-foreground">
                                {isRegister ? 'Create your account' : 'Sign in'}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground text-sm">
                                {isRegister 
                                    ? 'Enter your details to get started' 
                                    : 'Enter your email to continue'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Name Field (Register) */}
                            {isRegister && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Dr. Somchai"
                                            className="pl-10 h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-blue-400"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {t('login.email')}
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@hospital.go.th"
                                        className="pl-10 h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-blue-400"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading || !canSubmit}
                                className="w-full h-11 bg-blue-400 hover:bg-blue-400/90 text-white font-semibold shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {isRegister ? 'Creating...' : 'Signing in...'}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {isRegister ? 'Create Account' : t('login.signIn')}
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>

                            {/* Toggle */}
                            <div className="text-center pt-2">
                                <p className="text-sm text-muted-foreground">
                                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setIsRegister(!isRegister); setError(null) }}
                                        className="font-medium text-blue-400 hover:underline underline-offset-4"
                                    >
                                        {isRegister ? 'Sign in' : 'Sign up'}
                                    </button>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Security Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mt-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-muted-foreground font-medium">
                            Secured with end-to-end encryption
                        </span>
                    </div>
                </motion.div>
            </div>

            <PDPAConsentModal
                isOpen={showPDPA}
                onAccept={() => setShowPDPA(false)}
                onDecline={() => setError('You must accept the privacy policy to continue')}
            />
        </div>
    )
}
