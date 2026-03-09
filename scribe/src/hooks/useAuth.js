import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { encrypt, decrypt, migrateToEncryptedStorage } from '../lib/encryption'

export function useAuth() {
    const [user, setUser] = useState(() => {
        // Try encrypted storage first
        const storedEnc = localStorage.getItem('scribe_user_enc')
        if (storedEnc) {
            return JSON.parse(storedEnc) // Already decrypted by migration
        }
        return null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Migrate to encrypted storage on mount
    useEffect(() => {
        migrateToEncryptedStorage()
    }, [])

    const login = useCallback(async (email) => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.login({ email })
            // Encrypt sensitive data before storing
            localStorage.setItem('scribe_token_enc', await encrypt(res.token))
            localStorage.setItem('scribe_user_enc', JSON.stringify(res.user))
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
            // Encrypt sensitive data before storing
            localStorage.setItem('scribe_token_enc', await encrypt(res.token))
            localStorage.setItem('scribe_user_enc', JSON.stringify(res.user))
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
        localStorage.removeItem('scribe_token_enc')
        localStorage.removeItem('scribe_user_enc')
        // Also remove any legacy unencrypted data
        localStorage.removeItem('scribe_token')
        localStorage.removeItem('scribe_user')
        setUser(null)
    }, [])

    const isAuthenticated = !!localStorage.getItem('scribe_token_enc')

    return { user, login, register, logout, loading, error, isAuthenticated }
}
