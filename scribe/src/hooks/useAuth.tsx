import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { api } from '../lib/api'
import type { User } from '../lib/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, pin: string) => Promise<{ success: boolean; error?: string }>
  register: (data: {
    email: string
    name: string
    pin: string
    hospital?: string
    specialty?: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verify token on mount
  useEffect(() => {
    const token = api.getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    api.verifyToken().then((response) => {
      if (response.success && response.data?.user) {
        setUser(response.data.user)
      } else {
        api.logout()
      }
      setIsLoading(false)
    })
  }, [])

  const login = useCallback(async (email: string, pin: string) => {
    const response = await api.login(email, pin)
    if (response.success && response.data?.user) {
      setUser(response.data.user)
      return { success: true }
    }
    return { success: false, error: response.error || 'Login failed' }
  }, [])

  const register = useCallback(
    async (data: {
      email: string
      name: string
      pin: string
      hospital?: string
      specialty?: string
    }) => {
      const response = await api.register(data)
      if (response.success && response.data?.user) {
        setUser(response.data.user)
        return { success: true }
      }
      return { success: false, error: response.error || 'Registration failed' }
    },
    []
  )

  const logout = useCallback(() => {
    api.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
