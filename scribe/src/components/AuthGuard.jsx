import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthGuard({ children }) {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Check if onboarding is completed
    const onboarded = localStorage.getItem('scribe_onboarded')
    if (!onboarded) {
        return <Navigate to="/onboarding" replace />
    }

    return children
}
