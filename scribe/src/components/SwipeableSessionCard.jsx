import { motion } from 'framer-motion'
import { Clock, CheckCircle2, ChevronRight, Trash2, Share2 } from 'lucide-react'
import { useSwipeGesture } from '../hooks/useSwipeGesture'

/**
 * 📱 Swipeable Session Card
 * iOS-style swipe-to-action pattern
 * 
 * Swipe left → Delete (red)
 * Swipe right → Export/Share (green)
 */
export default function SwipeableSessionCard({ session, onTap, onDelete, onExport }) {
    const isFinalized = session.notes?.[0]?.is_final

    const handleSwipeLeft = () => {
        // Show delete confirmation
        if (window.confirm('Delete this session? This cannot be undone.')) {
            onDelete(session.id)
        }
    }

    const handleSwipeRight = () => {
        // Export session
        onExport(session.id)
    }

    const swipe = useSwipeGesture({
        onSwipeLeft: handleSwipeLeft,
        onSwipeRight: handleSwipeRight,
        threshold: 100 // 100px swipe to trigger
    })

    const handleTap = () => {
        if (!swipe.isSwiping) {
            onTap(session)
        }
    }

    // Calculate opacity for action buttons based on swipe distance
    const leftActionOpacity = Math.min(swipe.swipeDistance / 100, 1)
    const rightActionOpacity = Math.min(swipe.swipeDistance / 100, 1)

    return (
        <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 16,
            marginBottom: 8
        }}>
            {/* Background Actions */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                pointerEvents: 'none',
                zIndex: 0
            }}>
                {/* Left Action (Delete) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 100,
                        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 20,
                        opacity: leftActionOpacity,
                        pointerEvents: 'none'
                    }}
                >
                    <Trash2 size={20} color="white" strokeWidth={2} />
                    <span style={{
                        marginLeft: 8,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 600
                    }}>
                        Delete
                    </span>
                </motion.div>

                {/* Right Action (Export) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 100,
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: 20,
                        opacity: rightActionOpacity,
                        pointerEvents: 'none'
                    }}
                >
                    <Share2 size={20} color="white" strokeWidth={2} />
                    <span style={{
                        marginRight: 8,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 600
                    }}>
                        Export
                    </span>
                </motion.div>
            </div>

            {/* Foreground Card */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                    opacity: 1, 
                    y: 0,
                    x: swipe.swipeDistance * (swipe.swipeDirection === 'left' ? -1 : swipe.swipeDirection === 'right' ? 1 : 0)
                }}
                transition={{ 
                    delay: 0,
                    ease: [0.16, 1, 0.3, 1]
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTap}
                onTouchStart={swipe.onTouchStart}
                onTouchMove={swipe.onTouchMove}
                onTouchEnd={swipe.onTouchEnd}
                onMouseDown={swipe.onMouseDown}
                onMouseMove={swipe.onMouseMove}
                onMouseUp={swipe.onMouseUp}
                onMouseLeave={swipe.onMouseLeave}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 16px',
                    background: '#fff',
                    borderRadius: 16,
                    cursor: 'pointer',
                    textAlign: 'left',
                    border: '1px solid #F0F0F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    transition: swipe.isSwiping ? 'none' : 'box-shadow 0.2s, border-color 0.2s',
                    touchAction: 'pan-y', // Allow vertical scroll
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    {/* Status Icon */}
                    <div style={{
                        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                        background: isFinalized
                            ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(52,211,153,0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(251,191,36,0.2) 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {isFinalized
                            ? <CheckCircle2 size={18} color="#059669" strokeWidth={2.5} />
                            : <Clock size={18} color="#D97706" strokeWidth={2.5} />
                        }
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{
                            fontWeight: 600, fontSize: 15, color: '#111827',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', letterSpacing: '-0.2px'
                        }}>
                            {session.patient_name || 'Unknown Patient'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <span style={{
                                fontSize: 11, fontWeight: 600,
                                color: isFinalized ? '#059669' : '#D97706',
                                background: isFinalized
                                    ? 'rgba(16,185,129,0.1)'
                                    : 'rgba(245,158,11,0.1)',
                                padding: '3px 10px', borderRadius: 6
                            }}>
                                {isFinalized ? 'Finalized' : 'In Progress'}
                            </span>
                            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                                {session.template_type?.toUpperCase() || 'SOAP'}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                    <span style={{ fontSize: 12, color: '#9CA3AF', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                        {new Date(session.created_at).toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit'
                        })}
                    </span>
                    <ChevronRight size={16} style={{ color: '#D1D5DB' }} />
                </div>
            </motion.button>
        </div>
    )
}
