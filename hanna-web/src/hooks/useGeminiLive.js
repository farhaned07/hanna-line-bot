import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for Gemini Live WebSocket connection
 * Handles real-time bidirectional audio streaming
 */
export function useGeminiLive(backendUrl, userId) {
    const [status, setStatus] = useState('idle'); // idle, connecting, ready, listening, thinking, speaking, error
    const [error, setError] = useState(null);

    const wsRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const audioQueueRef = useRef([]);
    const isPlayingRef = useRef(false);

    // Initialize WebSocket connection
    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return; // Already connected
        }

        setStatus('connecting');
        setError(null);

        try {
            const wsUrl = `${backendUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/api/voice/live?userId=${userId}`;
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log('Connected to Gemini Live');
            };

            wsRef.current.onmessage = async (event) => {
                try {
                    const message = JSON.parse(event.data);

                    if (message.type === 'ready') {
                        setStatus('ready');
                        // Auto-start greeting
                        setTimeout(() => setStatus('speaking'), 500);
                    }

                    if (message.type === 'audio') {
                        // Queue audio for playback
                        audioQueueRef.current.push(message.data);
                        if (!isPlayingRef.current) {
                            playAudioQueue();
                        }
                    }

                    if (message.type === 'text') {
                        console.log('Hanna:', message.text);
                    }

                    if (message.type === 'turnComplete') {
                        setStatus('ready');
                    }

                    if (message.type === 'error') {
                        setError(message.message);
                        setStatus('error');
                    }
                } catch (err) {
                    console.error('Error processing message:', err);
                }
            };

            wsRef.current.onerror = (err) => {
                console.error('WebSocket error:', err);
                setError('Connection error');
                setStatus('error');
            };

            wsRef.current.onclose = () => {
                console.log('WebSocket closed');
                setStatus('idle');
            };
        } catch (err) {
            console.error('Failed to connect:', err);
            setError('Failed to connect');
            setStatus('error');
        }
    }, [backendUrl, userId]);

    // Play audio queue
    const playAudioQueue = async () => {
        if (audioQueueRef.current.length === 0) {
            isPlayingRef.current = false;
            return;
        }

        isPlayingRef.current = true;
        setStatus('speaking');

        // Initialize AudioContext if needed
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;

        while (audioQueueRef.current.length > 0) {
            const base64Audio = audioQueueRef.current.shift();
            try {
                // Decode base64 to ArrayBuffer
                const binaryString = atob(base64Audio);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                // Decode audio
                const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);

                // Play audio
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();

                // Wait for playback to finish
                await new Promise(resolve => {
                    source.onended = resolve;
                });
            } catch (err) {
                console.error('Error playing audio:', err);
            }
        }

        isPlayingRef.current = false;
        setStatus('ready');
    };

    // Start listening (audio recording)
    const startListening = useCallback(async () => {
        if (status !== 'ready') return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1
                }
            });

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            const audioChunks = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64Audio = reader.result.split(',')[1];

                    // Send to Gemini via WebSocket
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        wsRef.current.send(JSON.stringify({
                            type: 'audio',
                            data: base64Audio
                        }));
                        setStatus('thinking');
                    }
                };

                reader.readAsDataURL(audioBlob);
            };

            mediaRecorderRef.current.start();
            setStatus('listening');
        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Microphone access denied');
            setStatus('error');
        }
    }, [status]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (mediaRecorderRef.current && status === 'listening') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    }, [status]);

    // Disconnect
    const disconnect = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }

        if (wsRef.current) {
            wsRef.current.close();
        }

        audioQueueRef.current = [];
        isPlayingRef.current = false;
        setStatus('idle');
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return {
        status,
        error,
        connect,
        startListening,
        stopListening,
        disconnect
    };
}
