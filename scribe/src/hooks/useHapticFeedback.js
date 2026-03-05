/**
 * 📳 Haptic Feedback Hook
 * Provides tactile feedback for mobile interactions
 * 
 * Uses navigator.vibrate() API (Android) and WebHaptics (iOS 17+)
 * Falls back gracefully on unsupported devices
 * 
 * Usage:
 * const { triggerHaptic } = useHapticFeedback()
 * triggerHaptic('success') // or 'error', 'warning', 'light', 'medium', 'heavy'
 */

export function useHapticFeedback() {
    const supportsVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator
    
    // Haptic patterns for different feedback types
    const patterns = {
        // Success (short, pleasant vibration)
        success: [50],
        
        // Error (double burst)
        error: [100, 50, 100],
        
        // Warning (medium burst)
        warning: [150],
        
        // Light (minimal feedback)
        light: [30],
        
        // Medium (standard feedback)
        medium: [60],
        
        // Heavy (strong feedback)
        heavy: [100],
        
        // Recording start (ascending pattern)
        recordingStart: [50, 30, 50],
        
        // Recording stop (descending pattern)
        recordingStop: [100, 50, 50],
        
        // Button tap (subtle)
        tap: [20],
        
        // Swipe action (medium)
        swipe: [40],
        
        // Long press (delayed feedback)
        longPress: [80]
    }

    const triggerHaptic = (type = 'medium', duration = null) => {
        if (!supportsVibration) return
        
        try {
            if (duration !== null && typeof duration === 'number') {
                // Custom duration
                navigator.vibrate(duration)
            } else if (patterns[type]) {
                // Predefined pattern
                navigator.vibrate(patterns[type])
            } else {
                // Default to medium
                navigator.vibrate(patterns.medium)
            }
        } catch (err) {
            // Silently fail - haptics are non-essential
            console.warn('Haptic feedback failed:', err)
        }
    }

    // Convenience methods
    const haptic = {
        success: () => triggerHaptic('success'),
        error: () => triggerHaptic('error'),
        warning: () => triggerHaptic('warning'),
        light: () => triggerHaptic('light'),
        medium: () => triggerHaptic('medium'),
        heavy: () => triggerHaptic('heavy'),
        tap: () => triggerHaptic('tap'),
        swipe: () => triggerHaptic('swipe'),
        recordingStart: () => triggerHaptic('recordingStart'),
        recordingStop: () => triggerHaptic('recordingStop'),
        longPress: () => triggerHaptic('longPress'),
        custom: (pattern) => navigator.vibrate(pattern)
    }

    return {
        triggerHaptic,
        supportsVibration,
        ...haptic
    }
}
