import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, LogOut, RefreshCw } from 'lucide-react'

const WARNING_TIME = 5 * 60 * 1000 // 5 minutes before timeout
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes total

export default function SessionTimeoutWarning({ onLogout, onExtend }) {
    const [showWarning, setShowWarning] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [lastActivity, setLastActivity] = useState(Date.now())

    const checkSession = useCallback(() => {
        const now = Date.now()
        const timeSinceActivity = now - lastActivity

        if (timeSinceActivity >= SESSION_TIMEOUT) {
            // Session expired
            onLogout()
        } else if (timeSinceActivity >= SESSION_TIMEOUT - WARNING_TIME) {
            // Show warning
            setShowWarning(true)
            setTimeRemaining(SESSION_TIMEOUT - timeSinceActivity)
        }
    }, [lastActivity, onLogout])

    useEffect(() => {
        const resetLastActivity = () => {
            setLastActivity(Date.now())
            setShowWarning(false)
        }

        // Track user activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
        events.forEach(event => {
            window.addEventListener(event, resetLastActivity)
        })

        // Check session every 30 seconds
        const interval = setInterval(checkSession, 30000)

        // Initial check
        checkSession()

        return () => {
            clearInterval(interval)
            events.forEach(event => {
                window.removeEventListener(event, resetLastActivity)
            })
        }
    }, [checkSession])

    useEffect(() => {
        if (!showWarning) return

        const countdown = setInterval(() => {
            const remaining = SESSION_TIMEOUT - (Date.now() - lastActivity)
            setTimeRemaining(remaining)

            if (remaining <= 0) {
                clearInterval(countdown)
                onLogout()
            }
        }, 1000)

        return () => clearInterval(countdown)
    }, [showWarning, lastActivity, onLogout])

    const handleExtend = () => {
        setLastActivity(Date.now())
        setShowWarning(false)
        onExtend()
    }

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const getProgressColor = () => {
        if (timeRemaining > 3 * 60 * 1000) return '#10B981' // Green
        if (timeRemaining > 1 * 60 * 1000) return '#F59E0B' // Amber
        return '#EF4444' // Red
    }

    return (
        <AnimatePresence>
            {showWarning && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    style={{
                        position: 'fixed',
                        bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
                        left: 20,
                        right: 20,
                        zIndex: 1000,
                        background: '#FFFFFF',
                        borderRadius: 16,
                        padding: 20,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #F0F0F0'
                    }}
                    role="alertdialog"
                    aria-labelledby="timeout-title"
                    aria-describedby="timeout-desc"
                >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: 'rgba(245, 158, 11, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Clock size={20} color="#F59E0B" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 id="timeout-title" style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: '#111827',
                                marginBottom: 4
                            }}>
                                Session Expiring Soon
                            </h3>
                            <p id="timeout-desc" style={{
                                fontSize: 13,
                                color: '#6B7280',
                                lineHeight: 1.4
                            }}>
                                For your security, you'll be logged out in{' '}
                                <span style={{ fontWeight: 700, color: getProgressColor() }}>
                                    {formatTime(timeRemaining)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                        width: '100%',
                        height: 4,
                        background: '#F3F4F6',
                        borderRadius: 2,
                        marginBottom: 16,
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${(timeRemaining / WARNING_TIME) * 100}%`,
                            height: '100%',
                            background: getProgressColor(),
                            borderRadius: 2,
                            transition: 'width 1s linear, background 0.3s'
                        }} />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={onLogout}
                            style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 10,
                                background: '#F3F4F6',
                                color: '#374151',
                                fontWeight: 600,
                                fontSize: 14,
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                transition: 'background 0.2s'
                            }}
                        >
                            <LogOut size={16} />
                            Log Out
                        </button>
                        <button
                            onClick={handleExtend}
                            style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 14,
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                                transition: 'transform 0.15s, box-shadow 0.2s'
                            }}
                        >
                            <RefreshCw size={16} />
                            Extend Session
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
