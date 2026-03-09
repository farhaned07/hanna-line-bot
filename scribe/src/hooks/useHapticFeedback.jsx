/**
 * Haptic Feedback Hook
 * Provides tactile feedback for mobile devices
 */
export function useHapticFeedback() {
    const hasVibration = typeof navigator !== 'undefined' && navigator.vibrate;

    /**
     * Light tap - for button presses
     */
    const tap = () => {
        if (hasVibration) {
            navigator.vibrate(10);
        }
    };

    /**
     * Medium impact - for selections
     */
    const select = () => {
        if (hasVibration) {
            navigator.vibrate(20);
        }
    };

    /**
     * Heavy impact - for important actions
     */
    const success = () => {
        if (hasVibration) {
            navigator.vibrate([30, 50, 30]);
        }
    };

    /**
     * Error vibration
     */
    const error = () => {
        if (hasVibration) {
            navigator.vibrate([50, 50, 50, 50, 50]);
        }
    };

    /**
     * Recording start
     */
    const recordingStart = () => {
        if (hasVibration) {
            navigator.vibrate([50, 100, 50]);
        }
    };

    /**
     * Recording stop
     */
    const recordingStop = () => {
        if (hasVibration) {
            navigator.vibrate([100, 50, 100]);
        }
    };

    /**
     * Warning - long vibration
     */
    const warning = () => {
        if (hasVibration) {
            navigator.vibrate(200);
        }
    };

    return {
        tap,
        select,
        success,
        error,
        warning,
        recordingStart,
        recordingStop,
    };
}

export default useHapticFeedback;
