import { useState, useEffect, useRef } from 'react'
import { Mic, Video, PhoneOff } from 'lucide-react'
import { motion } from 'framer-motion'
import liff from '@line/liff'
import axios from 'axios'

function App() {
  const [status, setStatus] = useState('idle') // idle, listening, processing, speaking
  const [isMicOn, setIsMicOn] = useState(false)
  const [liffError, setLiffError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioPlayerRef = useRef(new Audio())

  useEffect(() => {
    // Initialize LIFF
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID || 'mock-liff-id' })
      .then(() => {
        console.log('LIFF Initialized')
        if (!liff.isLoggedIn()) {
          // liff.login() // Auto-login in prod
        }
      })
      .catch((err) => {
        console.error(err)
        setLiffError(err.message)
      })
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await sendAudioToBackend(audioBlob)
      }

      mediaRecorderRef.current.start()
      setStatus('listening')
      setIsMicOn(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('Microphone access denied. Please allow microphone access to use Voice mode.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'listening') {
      mediaRecorderRef.current.stop()
      setStatus('processing')
      setIsMicOn(false)
    }
  }

  const sendAudioToBackend = async (audioBlob) => {
    try {
      // Convert Blob to Base64
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1] // Remove data URL prefix

        // Send to Backend
        // Note: In local dev, we need to point to the backend URL. 
        // In prod, this will be relative if served from same domain or configured via env.
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

        const response = await axios.post(`${backendUrl}/api/chat/voice`, {
          audio: base64Audio
        })

        const { text, audioUrl, emotion } = response.data
        console.log('Received response:', text, emotion)

        playResponse(audioUrl)
      }
    } catch (error) {
      console.error('Error sending audio:', error)
      setStatus('idle')
      alert('Failed to process voice. Please try again.')
    }
  }

  const playResponse = (audioUrl) => {
    setStatus('speaking')
    audioPlayerRef.current.src = audioUrl
    audioPlayerRef.current.play()

    audioPlayerRef.current.onended = () => {
      setStatus('idle')
    }
  }

  const toggleCall = () => {
    if (status === 'idle') {
      startRecording()
    } else {
      stopRecording() // Or end call completely
      setStatus('idle')
      audioPlayerRef.current.pause()
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gradient-to-b from-green-50 to-white p-6">

      {/* Header */}
      <div className="w-full pt-4">
        <h1 className="text-xl font-bold text-gray-700">Hanna Live</h1>
        <div className="text-sm text-gray-500">
          {status === 'idle' ? 'Tap Mic to Start' : 'Connected'}
        </div>
      </div>

      {/* Avatar Area */}
      <div className="flex-1 flex items-center justify-center w-full relative">
        <motion.div
          animate={{
            scale: status === 'listening' ? [1, 1.1, 1] : status === 'speaking' ? [1, 1.05, 1] : 1,
            opacity: status === 'processing' ? 0.7 : 1
          }}
          transition={{ repeat: Infinity, duration: status === 'speaking' ? 0.5 : 2 }}
          className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-primary relative z-10"
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
            className="absolute w-48 h-48 bg-primary rounded-full -z-0"
          />
        )}
      </div>

      {/* Status Text */}
      <div className="h-12 mb-8 text-lg font-medium text-primary">
        {status === 'listening' && "Listening..."}
        {status === 'processing' && "Thinking..."}
        {status === 'speaking' && "Speaking..."}
      </div>

      {/* Controls */}
      <div className="flex gap-6 mb-12">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`p-6 rounded-full shadow-xl transition-all transform active:scale-95 ${status === 'listening' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}
        >
          <Mic size={32} />
        </button>

        <button
          onClick={() => {
            setStatus('idle')
            audioPlayerRef.current.pause()
          }}
          className="p-4 rounded-full bg-gray-200 text-gray-700 shadow-lg"
        >
          <PhoneOff size={28} />
        </button>

        <button
          className="p-4 rounded-full bg-white text-gray-700 shadow-lg"
          onClick={() => alert('Video Call Feature Coming Soon!')}
        >
          <Video size={28} />
        </button>
      </div>

      <div className="text-xs text-gray-400 mb-4">
        Hold Mic button to speak
      </div>

      {liffError && (
        <div className="absolute top-0 left-0 w-full bg-red-100 text-red-600 text-xs p-2 text-center">
          LIFF Error: {liffError}
        </div>
      )}
    </div>
  )
}

export default App
