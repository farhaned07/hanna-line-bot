import { useState } from 'react'
import { Stethoscope, Mail, Lock, User, Building, Briefcase } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { cn } from '../lib/utils'

type Tab = 'login' | 'register'

export function Login() {
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')
  const [hospital, setHospital] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (tab === 'login') {
        const result = await login(email, pin)
        if (!result.success) {
          setError(result.error || 'Login failed')
        }
      } else {
        if (!name.trim()) {
          setError('Name is required')
          setIsLoading(false)
          return
        }
        const result = await register({
          email,
          name,
          pin,
          hospital: hospital || undefined,
          specialty: specialty || undefined,
        })
        if (!result.success) {
          setError(result.error || 'Registration failed')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-hover))] flex items-center justify-center shadow-lg shadow-[hsl(var(--primary)/0.3)]">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              Hanna Scribe
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Voice-first clinical notes
            </p>
          </div>
        </div>

        <Card className="w-full max-w-sm">
          {/* Tabs */}
          <div className="flex border-b border-[hsl(var(--border))]">
            <button
              type="button"
              onClick={() => {
                setTab('login')
                setError('')
              }}
              className={cn(
                'flex-1 py-4 text-sm font-medium transition-colors',
                tab === 'login'
                  ? 'text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register')
                setError('')
              }}
              className={cn(
                'flex-1 py-4 text-sm font-medium transition-colors',
                tab === 'register'
                  ? 'text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              Register
            </button>
          </div>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Name (register only) */}
              {tab === 'register' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12"
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              {/* PIN */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                <Input
                  type="password"
                  placeholder="6-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pl-12"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
              </div>

              {/* Hospital & Specialty (register only) */}
              {tab === 'register' && (
                <>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      type="text"
                      placeholder="Hospital (optional)"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      type="text"
                      placeholder="Specialty (optional)"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                </>
              )}

              {/* Error */}
              {error && (
                <p className="text-sm text-[hsl(var(--destructive))] text-center">
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-xs text-[hsl(var(--muted-foreground))] text-center max-w-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy for healthcare data handling.
        </p>
      </div>
    </div>
  )
}
