import { useState, useEffect } from 'react'
import { Mic, PhoneOff, FileText, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import liff from '@line/liff'
import { useGeminiLive } from './hooks/useGeminiLive'

function App() {
  const [liffReady, setLiffReady] = useState(false)
  const [liffError, setLiffError] = useState(null)
  const [userId, setUserId] = useState(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://hanna-line-bot-production.up.railway.app'

  const {
    status,
    error: geminiError,
    startListening,
    stopListening,
    disconnect
  } = useGeminiLive(backendUrl, userId || 'guest')

  // Initialize LIFF
  useEffect(() => {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID || '2008593893-Bj5k3djg' })
      .then(() => {
        console.log('LIFF Initialized')
        setLiffReady(true)

        if (liff.isLoggedIn()) {
          liff.getProfile().then(profile => {
            setUserId(profile.userId)
          })
        } else {
          setUserId(`guest_${Date.now()}`)
        }
      })
      .catch((err) => {
        console.error('LIFF Error:', err)
        setLiffError(err.message)
      })
  }, [])

  // Get status message in Thai
  const getStatusMessage = () => {
    switch (status) {
      case 'connecting': return 'กำลังเชื่อมต่อ...'
      case 'ready': return 'พร้อมรับฟัง'
      case 'listening': return 'กำลังฟัง...'
      case 'thinking': return 'กำลังคิด...'
      case 'speaking': return 'กำลังพูด...'
      case 'error': return 'เกิดข้อผิดพลาด'
      default: return 'พร้อมคุยกับฮันนา'
    }
  }

  // Breathing animation for avatar
  const avatarAnimation = () => {
    if (status === 'listening') {
      return {
        scale: [1, 1.08, 1],
        boxShadow: [
          '0 0 0 0px rgba(16, 185, 129, 0.4)',
          '0 0 0 20px rgba(16, 185, 129, 0)',
          '0 0 0 0px rgba(16, 185, 129, 0)'
        ],
        transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
      }
    }
    if (status === 'speaking') {
      return {
        scale: [1, 1.03, 1],
        transition: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' }
      }
    }
    if (status === 'thinking') {
      return {
        opacity: [1, 0.85, 1],
        transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
      }
    }
    return { scale: 1, opacity: 1 }
  }

  // Status color
  const getStatusColor = () => {
    switch (status) {
      case 'listening': return 'text-emerald-600'
      case 'speaking': return 'text-blue-600'
      case 'thinking': return 'text-purple-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Header - Glassmorphism */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass mx-4 mt-6 rounded-3xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Prompt' }}>
                Hanna <span className="text-emerald-600">Live</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {liffReady ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    เชื่อมต่อแล้ว
                  </span>
                ) : (
                  'กำลังเริ่มต้น...'
                )}
              </p>
            </div>
            <Activity className="text-emerald-500" size={28} />
          </div>
        </motion.div>

        {/* Avatar Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-6">

          {/* Avatar Container */}
          <motion.div
            animate={avatarAnimation()}
            className="relative z-20"
          >
            {/* Main Avatar Circle - Glassmorphism */}
            <div className="glass w-56 h-56 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/50 relative overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20" />

              {/* Avatar Icon */}
              <div className="relative z-10 text-7xl">
                🩺
              </div>
            </div>

            {/* Pulse Ring when Listening */}
            <AnimatePresence>
              {status === 'listening' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 border-4 border-emerald-500 rounded-full"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Status Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <p className={`text-xl font-semibold ${getStatusColor()} transition-colors duration-300`}>
              {getStatusMessage()}
            </p>

            {/* Voice Waveform when Speaking */}
            <AnimatePresence>
              {(status === 'speaking' || status === 'listening') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center justify-center gap-1 mt-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [12, 24, 12],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: 'easeInOut'
                      }}
                      className={`w-1 rounded-full ${status === 'listening' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {(geminiError || liffError) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass mt-6 px-4 py-3 rounded-2xl border-red-200 max-w-sm"
              >
                <p className="text-red-600 text-sm">
                  {geminiError || liffError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls - Bottom */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass mx-4 mb-6 rounded-3xl shadow-xl p-6"
        >
          <div className="flex flex-col items-center gap-4">

            {/* Mic Button - Primary Action */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              disabled={status === 'connecting' || status === 'error'}
              className={`
                relative w-20 h-20 rounded-full shadow-2xl transition-all duration-300
                ${status === 'listening'
                  ? 'bg-gradient-to-br from-red-500 to-red-600'
                  : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:shadow-2xl
              `}
            >
              <Mic size={36} className="mx-auto text-white" strokeWidth={2.5} />

              {/* Glow effect */}
              <div className={`
                absolute inset-0 rounded-full blur-xl opacity-50
                ${status === 'listening' ? 'bg-red-500' : 'bg-emerald-500'}
              `} />
            </motion.button>

            {/* Instruction Text */}
            <p className="text-xs text-gray-500 text-center font-medium">
              กดค้างเพื่อพูด · ปล่อยเพื่อส่ง
            </p>

            {/* Secondary Actions */}
            <div className="flex gap-3 w-full max-w-xs mt-2">
              {/* Report Button */}
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/api/report/${userId}`}
                target="_blank"
                className="flex-1 px-4 py-3 bg-blue-50 text-blue-600 rounded-2xl text-sm font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText size={18} />
                <span>รายงาน</span>
              </a>

              {/* End Call Button */}
              <button
                onClick={() => {
                  disconnect()
                  liff.closeWindow()
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneOff size={18} />
                <span>วางสาย</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default App

