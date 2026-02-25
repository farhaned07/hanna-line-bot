import { useState, useRef, useCallback, useEffect } from 'react'

export function useRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [duration, setDuration] = useState(0)
    const [audioBlob, setAudioBlob] = useState(null)
    const audioBlobRef = useRef(null)

    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])
    const timerRef = useRef(null)
    const streamRef = useRef(null)

    const startTimer = useCallback(() => {
        timerRef.current = setInterval(() => {
            setDuration(d => d + 1)
        }, 1000)
    }, [])

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    const start = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            })
            streamRef.current = stream

            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/mp4')
                    ? 'audio/mp4'
                    : 'audio/webm'

            const recorder = new MediaRecorder(stream, { mimeType })
            mediaRecorderRef.current = recorder
            chunksRef.current = []

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType })
                audioBlobRef.current = blob
                setAudioBlob(blob)
            }

            // Record in 1-second chunks for offline safety
            recorder.start(1000)
            setIsRecording(true)
            setIsPaused(false)
            setDuration(0)
            setAudioBlob(null)
            audioBlobRef.current = null
            startTimer()
        } catch (err) {
            console.error('Microphone access denied:', err)
            throw new Error('Microphone access is required for recording')
        }
    }, [startTimer])

    const pause = useCallback(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.pause()
            setIsPaused(true)
            stopTimer()
        }
    }, [stopTimer])

    const resume = useCallback(() => {
        if (mediaRecorderRef.current?.state === 'paused') {
            mediaRecorderRef.current.resume()
            setIsPaused(false)
            startTimer()
        }
    }, [startTimer])

    const stop = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        setIsRecording(false)
        setIsPaused(false)
        stopTimer()
    }, [stopTimer])

    const reset = useCallback(() => {
        stop()
        setDuration(0)
        setAudioBlob(null)
        audioBlobRef.current = null
        chunksRef.current = []
    }, [stop])

    // Cleanup on unmount
    useEffect(() => () => {
        stopTimer()
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
        }
    }, [stopTimer])

    const formatDuration = useCallback((secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }, [])

    return {
        isRecording,
        isPaused,
        duration,
        formattedDuration: formatDuration(duration),
        audioBlob,
        audioBlobRef,
        start,
        pause,
        resume,
        stop,
        reset
    }
}
