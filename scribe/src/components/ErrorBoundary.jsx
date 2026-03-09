import { Component } from 'react'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        // Log to Sentry in production (secure, no PHI)
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(error, {
                extra: {
                    component: this.props.componentName || 'Unknown',
                    errorInfo
                }
            })
        }
        // In development, log to console for debugging
        if (process.env.NODE_ENV !== 'production') {
            console.error('[ErrorBoundary] Unhandled error:', error, errorInfo)
        }
    }

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback
                return <FallbackComponent error={this.state.error} resetErrorBoundary={() => this.setState({ hasError: false, error: null })} />
            }
            
            // Default fallback
            return (
                <div style={{
                    minHeight: '100dvh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: '#FAFAFA', padding: 32, textAlign: 'center'
                }}>
                    <div style={{ fontSize: 48, marginBottom: 20 }}>😵</div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
                        Something went wrong
                    </h2>
                    <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, maxWidth: 280, marginBottom: 24 }}>
                        An unexpected error occurred. Please try again.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null })
                            window.location.href = '/'
                        }}
                        style={{
                            padding: '14px 32px', borderRadius: 12,
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: '#fff',
                            fontWeight: 600, fontSize: 15, border: 'none',
                            cursor: 'pointer', boxShadow: '0 2px 10px rgba(52,120,246,0.25)'
                        }}
                    >
                        Restart App
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}
