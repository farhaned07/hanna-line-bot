import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'

export function useAuth() {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('scribe_user')
        return stored ? JSON.parse(stored) : null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = useCallback(async (email, pin) => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.login({ email, pin })
            localStorage.setItem('scribe_token', res.token)
            localStorage.setItem('scribe_user', JSON.stringify(res.user))
            setUser(res.user)
            return res
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const register = useCallback(async (data) => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.register(data)
            localStorage.setItem('scribe_token', res.token)
            localStorage.setItem('scribe_user', JSON.stringify(res.user))
            setUser(res.user)
            return res
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('scribe_token')
        localStorage.removeItem('scribe_user')
        setUser(null)
    }, [])

    const isAuthenticated = !!localStorage.getItem('scribe_token')

    return { user, login, register, logout, loading, error, isAuthenticated }
}
