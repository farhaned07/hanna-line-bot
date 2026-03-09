import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Audio Recorder Hook
 * Handles Web Audio API for recording patient consultations
 */
export function useRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState(null);
    
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioBlobRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const pausedTimeRef = useRef(0);

    /**
     * Start recording
     */
    const start = useCallback(async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            });

            streamRef.current = stream;
            
            // Create media recorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') 
                    ? 'audio/webm' 
                    : 'audio/ogg',
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            audioBlobRef.current = null;
            setError(null);

            // Collect audio data
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // Handle recording stop
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: mediaRecorder.mimeType || 'audio/webm',
                });
                audioBlobRef.current = audioBlob;
                
                // Clean up stream
                stream.getTracks().forEach(track => track.stop());
            };

            // Start recording
            mediaRecorder.start(100); // Collect data every 100ms
            setIsRecording(true);
            setIsPaused(false);
            
            // Start timer
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);

        } catch (err) {
            console.error('Failed to start recording:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    /**
     * Pause recording
     */
    const pause = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            
            // Pause timer
            pausedTimeRef.current = Date.now() - startTimeRef.current;
            clearInterval(timerRef.current);
        }
    }, [isRecording, isPaused]);

    /**
     * Resume recording
     */
    const resume = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            
            // Resume timer
            startTimeRef.current = Date.now() - pausedTimeRef.current;
            timerRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);
        }
    }, [isRecording, isPaused]);

    /**
     * Stop recording
     */
    const stop = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            
            // Stop timer
            clearInterval(timerRef.current);
        }
    }, [isRecording]);

    /**
     * Reset recorder
     */
    const reset = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        clearInterval(timerRef.current);
        setIsRecording(false);
        setIsPaused(false);
        setDuration(0);
        audioChunksRef.current = [];
        audioBlobRef.current = null;
        setError(null);
    }, [isRecording]);

    /**
     * Get formatted duration (MM:SS)
     */
    const formattedDuration = `${String(Math.floor(duration / 60)).padStart(2, '0')}:${String(duration % 60).padStart(2, '0')}`;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return {
        isRecording,
        isPaused,
        duration,
        formattedDuration,
        audioBlobRef,
        error,
        start,
        pause,
        resume,
        stop,
        reset,
    };
}

export default useRecorder;
