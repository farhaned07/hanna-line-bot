import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/api'

/**
 * Auth Context - Multi-Tenant Authentication
 * Provides tenant and staff context throughout the application
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        isLoading: true,
        isSystemAdmin: false,
        tenant: null,
        staff: null,
        careTeam: null,
        program: null,
        token: null
    })

    // Verify token and load user context
    const verifyToken = useCallback(async (token) => {
        try {
            const response = await api.post('/api/auth/verify', { token })

            if (response.data.valid) {
                setAuth({
                    isAuthenticated: true,
                    isLoading: false,
                    isSystemAdmin: response.data.isSystemAdmin,
                    tenant: response.data.tenant,
                    staff: response.data.staff,
                    careTeam: response.data.careTeam,
                    program: response.data.program,
                    token
                })
                return true
            } else {
                throw new Error('Invalid token')
            }
        } catch (error) {
            console.error('Token verification failed:', error)
            logout()
            return false
        }
    }, [])

    // Login function
    const login = useCallback(async (token) => {
        setAuth(prev => ({ ...prev, isLoading: true }))

        const success = await verifyToken(token)
        if (success) {
            localStorage.setItem('nurse_token', token)
        }
        return success
    }, [verifyToken])

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem('nurse_token')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_role')

        setAuth({
            isAuthenticated: false,
            isLoading: false,
            isSystemAdmin: false,
            tenant: null,
            staff: null,
            careTeam: null,
            program: null,
            token: null
        })
    }, [])

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('nurse_token')

        if (token) {
            verifyToken(token)
        } else {
            setAuth(prev => ({ ...prev, isLoading: false }))
        }
    }, [verifyToken])

    // Helper functions
    const isAdmin = auth.staff?.role === 'admin' || auth.isSystemAdmin
    const isNurse = auth.staff?.role === 'nurse'
    const hasPermission = (permission) => {
        if (auth.isSystemAdmin) return true
        if (auth.staff?.role === 'admin') return true
        return auth.staff?.permissions?.[permission] === true
    }

    const value = {
        ...auth,
        login,
        logout,
        isAdmin,
        isNurse,
        hasPermission,
        tenantName: auth.tenant?.name || 'Hanna',
        tenantCode: auth.tenant?.code || ''
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
