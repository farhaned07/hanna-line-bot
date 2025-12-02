import { useState, useEffect } from 'react'
import { Mic, PhoneOff } from 'lucide-react'
import { motion } from 'framer-motion'
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

  // Get status message
  const getStatusMessage = () => {
    switch (status) {
      case 'connecting': return 'กำลังเชื่อมต่อ...'
      case 'ready': return 'พร้อมรับฟัง'
      case 'listening': return 'กำลังฟัง...'
      case 'thinking': return 'กำลังคิด...'
      case 'speaking': return 'กำลังพูด...'
      case 'error': return 'เกิดข้อผิดพลาด'
      default: return 'กดไมค์เพื่อเริ่ม'
    }
  }

  // Get avatar animation based on status
  const getAvatarAnimation = () => {
    if (status === 'listening') {
      return { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1.5 } }
    }
    if (status === 'speaking') {
      return { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.5 } }
    }
    if (status === 'thinking') {
      return { opacity: [1, 0.7, 1], transition: { repeat: Infinity, duration: 1 } }
    }
    return { scale: 1, opacity: 1 }
  }

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gradient-to-b from-green-50 to-white p-6">

      {/* Header */}
      <div className="w-full pt-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Hanna Live</h1>
        <div className="text-sm text-gray-500 mt-1">
          {liffReady ? 'เชื่อมต่อแล้ว' : 'กำลังเริ่มต้น...'}
        </div>
      </div>

      {/* Avatar Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <motion.div
          animate={getAvatarAnimation()}
          className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-green-500 relative z-10 mb-8"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4228/4228704.png"
            alt="Hanna Avatar"
            className="w-32 h-32"
          />
        </motion.div>

        {/* Ripple Effect when Listening */}
        {status === 'listening' && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute w-48 h-48 bg-green-500 rounded-full"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }}
          />
        )}

        {/* Status Text */}
        <div className="text-lg font-medium text-green-600">
          {getStatusMessage()}
        </div>

        {/* Error Display */}
        {(geminiError || liffError) && (
          <div className="mt-4 text-red-500 text-sm text-center">
            {geminiError || liffError}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 mb-12 w-full max-w-xs">
        {/* Primary Action - Mic Button */}
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          disabled={status === 'connecting' || status === 'error'}
          className={`w-20 h-20 rounded-full shadow-2xl transition-all transform active:scale-95 disabled:opacity-50 ${status === 'listening'
            ? 'bg-red-500 text-white'
            : 'bg-green-500 text-white'
            }`}
        >
          <Mic size={40} className="mx-auto" />
        </button>

        {/* Instruction Text */}
        <div className="text-xs text-gray-500 text-center">
          กดค้างไมค์เพื่อพูด<br />
          ปล่อยเพื่อส่งข้อความ
        </div>

        {/* Report Button */}
        <a
          href={`${import.meta.env.VITE_BACKEND_URL}/api/report/${userId}`}
          target="_blank"
          className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
        >
          📄 สรุปผลสุขภาพ (PDF)
        </a>

        {/* End Call Button */}
        <button
          onClick={() => {
            disconnect()
            liff.closeWindow()
          }}
          className="px-6 py-3 rounded-full bg-gray-200 text-gray-700 shadow-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <PhoneOff size={20} />
          <span>วางสาย</span>
        </button>
      </div>
    </div>
  )
}

export default App
