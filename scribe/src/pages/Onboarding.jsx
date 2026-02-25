import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, FileText, Download } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const slides = [
    {
        icon: Mic,
        title: 'Tap & Record',
        titleTh: 'กดแล้วพูด',
        desc: 'Talk to your patient as usual. Hanna listens and captures everything.',
        descTh: 'พูดกับคนไข้ตามปกติ Hanna จะฟังและบันทึกทุกอย่างให้',
        color: '#6366F1',
        bg: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.15) 100%)',
    },
    {
        icon: FileText,
        title: 'AI Writes Your Note',
        titleTh: 'AI เขียนโน้ตให้',
        desc: 'SOAP note generated in seconds. Review, edit, and finalize.',
        descTh: 'SOAP note สร้างเสร็จภายในไม่กี่วินาที ตรวจสอบ แก้ไข และยืนยัน',
        color: '#10B981',
        bg: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.15) 100%)',
    },
    {
        icon: Download,
        title: 'Save & Export',
        titleTh: 'บันทึกและส่งออก',
        desc: 'Export as PDF or copy to your system. All notes saved securely.',
        descTh: 'ส่งออกเป็น PDF หรือคัดลอก บันทึกทั้งหมดจัดเก็บอย่างปลอดภัย',
        color: '#F59E0B',
        bg: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.15) 100%)',
    },
]

export default function Onboarding() {
    const [step, setStep] = useState(0)
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleNext = () => {
        if (step < slides.length - 1) {
            setStep(step + 1)
        } else {
            localStorage.setItem('scribe_onboarded', 'true')
            navigate('/', { replace: true })
        }
    }

    const handleSkip = () => {
        localStorage.setItem('scribe_onboarded', 'true')
        navigate('/', { replace: true })
    }

    const slide = slides[step]
    const Icon = slide.icon
    const isLast = step === slides.length - 1

    return (
        <div style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            background: '#FAFAFA',
            padding: '0 24px',
        }}>
            {/* Skip button */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
                paddingBottom: 8,
            }}>
                {!isLast && (
                    <button
                        onClick={handleSkip}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-ink3)',
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer',
                            padding: '8px 0',
                        }}
                    >
                        Skip
                    </button>
                )}
            </div>

            {/* Welcome text */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <motion.p
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        fontSize: 14,
                        color: 'var(--color-ink3)',
                        fontWeight: 500,
                    }}
                >
                    Welcome, {user?.display_name || 'Doctor'} 👋
                </motion.p>
            </div>

            {/* Slide content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        style={{ textAlign: 'center', width: '100%', maxWidth: 340 }}
                    >
                        {/* Icon circle */}
                        <div style={{
                            width: 120,
                            height: 120,
                            borderRadius: 40,
                            background: slide.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 40px',
                        }}>
                            <Icon size={48} color={slide.color} strokeWidth={1.8} />
                        </div>

                        {/* Title */}
                        <h2 style={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: 'var(--color-ink)',
                            letterSpacing: '-0.5px',
                            marginBottom: 8,
                        }}>
                            {slide.title}
                        </h2>
                        <p style={{
                            fontSize: 15,
                            color: slide.color,
                            fontWeight: 600,
                            marginBottom: 16,
                        }}>
                            {slide.titleTh}
                        </p>

                        {/* Description */}
                        <p style={{
                            fontSize: 15,
                            color: 'var(--color-ink2)',
                            lineHeight: 1.6,
                            marginBottom: 8,
                        }}>
                            {slide.desc}
                        </p>
                        <p style={{
                            fontSize: 14,
                            color: 'var(--color-ink3)',
                            lineHeight: 1.6,
                        }}>
                            {slide.descTh}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom section */}
            <div style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 32px)' }}>
                {/* Dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 24,
                }}>
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: i === step ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                background: i === step ? 'var(--color-accent)' : 'var(--color-surface)',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </div>

                {/* Button */}
                <button
                    onClick={handleNext}
                    style={{
                        width: '100%',
                        padding: '16px 0',
                        borderRadius: 14,
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isLast ? 'Start Recording →' : 'Next'}
                </button>
            </div>
        </div>
    )
}
