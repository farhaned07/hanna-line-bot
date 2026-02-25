import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { t, getLocale, setLocale } from '../i18n'

export default function Login() {
    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState('')
    const [pin, setPin] = useState(['', '', '', '', '', ''])
    const [displayName, setDisplayName] = useState('')
    const [error, setError] = useState(null)
    const [shake, setShake] = useState(false)
    const [lang, setLang] = useState(getLocale())
    const pinRefs = useRef([])
    const navigate = useNavigate()
    const { login, register, loading } = useAuth()

    const toggleLang = () => {
        const next = lang === 'en' ? 'th' : 'en'
        setLocale(next)
        setLang(next)
    }

    const handlePinChange = (index, value) => {
        if (!/^\d*$/.test(value)) return
        const newPin = [...pin]
        newPin[index] = value.slice(-1)
        setPin(newPin)
        if (value && index < 5) {
            pinRefs.current[index + 1]?.focus()
        }
    }

    const handlePinKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            pinRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        const pinStr = pin.join('')
        if (pinStr.length < 6) return

        try {
            if (isRegister) {
                await register({ email, pin: pinStr, displayName })
            } else {
                await login(email, pinStr)
            }
            navigate('/', { replace: true })
        } catch (err) {
            setError(err.message || t('login.error'))
            setShake(true)
            setPin(['', '', '', '', '', ''])
            pinRefs.current[0]?.focus()
            setTimeout(() => setShake(false), 600)
        }
    }

    const pinFilled = pin.filter(d => d !== '').length
    const canSubmit = pin.join('').length >= 6

    return (
        <div style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F5F5F5',
            padding: '24px 20px',
            position: 'relative',
        }}>
            {/* Language toggle */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleLang}
                style={{
                    position: 'absolute',
                    top: 'max(env(safe-area-inset-top, 16px), 16px)',
                    right: 20,
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 20,
                    padding: '6px 14px',
                    color: '#999',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
            >
                {lang === 'en' ? 'EN' : 'TH'}
            </motion.button>

            {/* Orb */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #5A9BFF, #3478F6 60%, #2563EB)',
                    boxShadow: '0 4px 24px rgba(52,120,246,0.25)',
                    marginBottom: 24,
                    animation: 'login-breathe 4s ease-in-out infinite',
                }}
            />

            {/* Brand */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                style={{ textAlign: 'center', marginBottom: 32 }}
            >
                <h1 style={{
                    fontSize: 34, fontWeight: 800, letterSpacing: '-1.5px',
                    color: '#1A1A1A',
                }}>
                    hanna<span style={{ color: '#3478F6' }}>·</span>
                </h1>
                <p style={{
                    fontSize: 14, color: '#999',
                    fontWeight: 400, marginTop: 4, letterSpacing: '0.3px',
                }}>
                    {t('login.subtitle')}
                </p>
            </motion.div>

            {/* Form card */}
            <motion.form
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                onSubmit={handleSubmit}
                style={{
                    width: '100%', maxWidth: 380,
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 20, padding: '28px 24px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
            >
                {/* Register name field */}
                <AnimatePresence>
                    {isRegister && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', marginBottom: 14 }}
                        >
                            <label style={labelStyle}>Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Dr. Somchai"
                                style={inputStyle}
                                required
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Email */}
                <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>{t('login.email')}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@hospital.go.th"
                        style={inputStyle}
                        autoComplete="email"
                        required
                    />
                </div>

                {/* PIN */}
                <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>{t('login.pin')}</label>
                    <motion.div
                        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: 'flex', gap: 8, justifyContent: 'center',
                            marginTop: 4,
                        }}
                    >
                        {pin.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => pinRefs.current[i] = el}
                                type="password"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handlePinChange(i, e.target.value)}
                                onKeyDown={(e) => handlePinKeyDown(i, e)}
                                style={{
                                    width: 44, height: 52,
                                    textAlign: 'center',
                                    fontSize: 20, fontWeight: 700,
                                    borderRadius: 12,
                                    border: `1.5px solid ${error ? 'rgba(255,69,58,0.4)' : digit ? 'rgba(52,120,246,0.4)' : 'rgba(0,0,0,0.08)'}`,
                                    background: digit ? 'rgba(52,120,246,0.04)' : '#F5F5F5',
                                    color: '#1A1A1A',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    boxShadow: digit ? '0 0 0 3px rgba(52,120,246,0.08)' : 'none',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(52,120,246,0.5)'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(52,120,246,0.1)'
                                    e.target.style.background = '#fff'
                                }}
                                onBlur={(e) => {
                                    if (!digit) {
                                        e.target.style.borderColor = error ? 'rgba(255,69,58,0.4)' : 'rgba(0,0,0,0.08)'
                                        e.target.style.boxShadow = 'none'
                                        e.target.style.background = '#F5F5F5'
                                    }
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* PIN progress dots */}
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: 5,
                        marginTop: 10,
                    }}>
                        {[0, 1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{
                                width: 5, height: 5, borderRadius: 3,
                                background: i < pinFilled ? '#3478F6' : 'rgba(0,0,0,0.08)',
                                transition: 'all 0.2s ease',
                                transform: i < pinFilled ? 'scale(1.3)' : 'scale(1)',
                            }} />
                        ))}
                    </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                color: '#FF453A', fontSize: 13, textAlign: 'center',
                                marginBottom: 14, fontWeight: 500,
                            }}
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                    type="submit"
                    disabled={loading || !canSubmit}
                    whileTap={!loading && canSubmit ? { scale: 0.97 } : {}}
                    style={{
                        width: '100%', padding: '14px 0',
                        borderRadius: 12, border: 'none',
                        background: canSubmit ? '#3478F6' : 'rgba(0,0,0,0.04)',
                        color: canSubmit ? '#fff' : '#ccc',
                        fontWeight: 600, fontSize: 15,
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                        transition: 'all 0.25s ease',
                        boxShadow: canSubmit ? '0 2px 10px rgba(52,120,246,0.25)' : 'none',
                        letterSpacing: '-0.2px',
                    }}
                >
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <span style={{
                                width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: '#fff', borderRadius: '50%',
                                animation: 'spin 0.6s linear infinite', display: 'inline-block',
                            }} />
                            {isRegister ? 'Creating...' : 'Signing in...'}
                        </span>
                    ) : (
                        isRegister ? 'Create Account' : t('login.signIn')
                    )}
                </motion.button>

                {/* Toggle */}
                <div style={{ marginTop: 18, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#999' }}>
                        {isRegister ? 'Already have an account?' : t('login.newUser')}{' '}
                        <button
                            type="button"
                            onClick={() => { setIsRegister(!isRegister); setError(null) }}
                            style={{
                                background: 'none', border: 'none',
                                color: '#3478F6', fontWeight: 600,
                                cursor: 'pointer', fontSize: 13,
                            }}
                        >
                            {isRegister ? t('login.signIn') : t('login.createAccount')}
                        </button>
                    </p>
                </div>
            </motion.form>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                    marginTop: 28, fontSize: 11,
                    color: '#bbb',
                    textAlign: 'center', letterSpacing: '0.2px',
                }}
            >
                Secured with end-to-end encryption
            </motion.p>

            <style>{`
                @keyframes login-breathe {
                    0%, 100% { transform: scale(1); box-shadow: 0 4px 24px rgba(52,120,246,0.25); }
                    50% { transform: scale(1.06); box-shadow: 0 6px 32px rgba(52,120,246,0.3); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    )
}

const labelStyle = {
    display: 'block',
    fontSize: 11, fontWeight: 600,
    color: '#999',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
}

const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    background: '#F5F5F5',
    border: '1px solid rgba(0,0,0,0.06)',
    color: '#1A1A1A',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
}
