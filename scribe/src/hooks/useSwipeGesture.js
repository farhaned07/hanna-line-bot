import { useState, useRef, useCallback } from 'react'

/**
 * 📱 Mobile Swipe Gesture Hook
 * For swipe-to-action patterns (iOS-style)
 * 
 * Usage:
 * const { swipeProps, isSwiping, swipeDirection } = useSwipeGesture({
 *   onSwipeLeft: () => console.log('Delete'),
 *   onSwipeRight: () => console.log('Export'),
 *   threshold: 100 // px to trigger action
 * })
 */

export function useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 100, // Minimum swipe distance to trigger
    preventDefault = true
} = {}) {
    const [isSwiping, setIsSwiping] = useState(false)
    const [swipeDirection, setSwipeDirection] = useState(null)
    const [swipeDistance, setSwipeDistance] = useState(0)
    const startX = useRef(0)
    const startY = useRef(0)
    const currentX = useRef(0)
    const currentY = useRef(0)

    const handleStart = useCallback((clientX, clientY) => {
        startX.current = clientX
        startY.current = clientY
        setIsSwiping(true)
        setSwipeDirection(null)
        setSwipeDistance(0)
    }, [])

    const handleMove = useCallback((clientX, clientY) => {
        if (!isSwiping) return

        const deltaX = clientX - startX.current
        const deltaY = clientY - startY.current
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)

        // Determine if horizontal or vertical swipe
        if (absX > absY) {
            // Horizontal swipe
            currentX.current = deltaX
            setSwipeDirection(deltaX > 0 ? 'right' : 'left')
            setSwipeDistance(absX)
        } else {
            // Vertical swipe
            currentY.current = deltaY
            setSwipeDirection(deltaY > 0 ? 'down' : 'up')
            setSwipeDistance(absY)
        }

        if (preventDefault) {
            // Prevent scroll while swiping
            // This is handled by CSS touch-action
        }
    }, [isSwiping, preventDefault])

    const handleEnd = useCallback(() => {
        if (!isSwiping) return

        const distance = swipeDistance
        const direction = swipeDirection

        if (distance >= threshold) {
            // Trigger action based on direction
            if (direction === 'left' && onSwipeLeft) {
                onSwipeLeft()
            } else if (direction === 'right' && onSwipeRight) {
                onSwipeRight()
            } else if (direction === 'up' && onSwipeUp) {
                onSwipeUp()
            } else if (direction === 'down' && onSwipeDown) {
                onSwipeDown()
            }
        }

        // Reset
        setIsSwiping(false)
        setSwipeDirection(null)
        setSwipeDistance(0)
        startX.current = 0
        startY.current = 0
        currentX.current = 0
        currentY.current = 0
    }, [isSwiping, swipeDistance, swipeDirection, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

    // Touch events
    const onTouchStart = useCallback((e) => {
        handleStart(e.touches[0].clientX, e.touches[0].clientY)
    }, [handleStart])

    const onTouchMove = useCallback((e) => {
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }, [handleMove])

    const onTouchEnd = useCallback(() => {
        handleEnd()
    }, [handleEnd])

    // Mouse events (for desktop testing)
    const onMouseDown = useCallback((e) => {
        handleStart(e.clientX, e.clientY)
    }, [handleStart])

    const onMouseMove = useCallback((e) => {
        if (isSwiping) {
            handleMove(e.clientX, e.clientY)
        }
    }, [handleMove, isSwiping])

    const onMouseUp = useCallback(() => {
        handleEnd()
    }, [handleEnd])

    const onMouseLeave = useCallback(() => {
        if (isSwiping) {
            handleEnd()
        }
    }, [handleEnd, isSwiping])

    return {
        // State
        isSwiping,
        swipeDirection,
        swipeDistance,
        maxThreshold: threshold,

        // Touch handlers
        onTouchStart,
        onTouchMove,
        onTouchEnd,

        // Mouse handlers (for desktop testing)
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,

        // Helper to reset swipe state
        reset: () => {
            setIsSwiping(false)
            setSwipeDirection(null)
            setSwipeDistance(0)
        }
    }
}

/**
 * 📱 Swipe Action Component Props Helper
 * Returns props to spread on container and action buttons
 */
export function getSwipeActionProps(swipe) {
    return {
        containerProps: {
            onTouchStart: swipe.onTouchStart,
            onTouchMove: swipe.onTouchMove,
            onTouchEnd: swipe.onTouchEnd,
            onMouseDown: swipe.onMouseDown,
            onMouseMove: swipe.onMouseMove,
            onMouseUp: swipe.onMouseUp,
            onMouseLeave: swipe.onMouseLeave,
            style: {
                touchAction: 'pan-y', // Allow vertical scroll, block horizontal
                userSelect: 'none',
                WebkitUserSelect: 'none',
                transition: swipe.isSwiping ? 'none' : 'transform 0.3s ease',
                transform: `translateX(${swipe.swipeDistance * (swipe.swipeDirection === 'left' ? -1 : swipe.swipeDirection === 'right' ? 1 : 0)}px)`
            }
        },
        actionProps: {
            style: {
                display: 'flex',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%',
                pointerEvents: 'none' // Let touches pass through to container
            }
        }
    }
}
