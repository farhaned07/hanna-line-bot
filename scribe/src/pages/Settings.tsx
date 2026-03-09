import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Building,
  Mail,
  CreditCard,
  LogOut,
  ChevronRight,
  Zap,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import type { Subscription, UsageStats } from '../lib/types'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { BottomNav } from '../components/BottomNav'

export function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [subRes, usageRes] = await Promise.all([
        api.getSubscription(),
        api.getUsageStats(),
      ])

      if (subRes.success && subRes.data) {
        setSubscription(subRes.data)
      }
      if (usageRes.success && usageRes.data) {
        setUsage(usageRes.data)
      }
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    const response = await api.createCheckoutSession('pro')
    if (response.success && response.data?.url) {
      window.location.href = response.data.url
    }
    setIsUpgrading(false)
  }

  const handleManageBilling = async () => {
    const response = await api.createPortalSession()
    if (response.success && response.data?.url) {
      window.location.href = response.data.url
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout()
      navigate('/login')
    }
  }

  const getPlanBadge = () => {
    if (!subscription) return null
    const variants: Record<string, 'default' | 'primary' | 'success'> = {
      free: 'default',
      pro: 'primary',
      enterprise: 'success',
    }
    return (
      <Badge variant={variants[subscription.plan] || 'default'}>
        {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] safe-top pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[hsl(var(--background)/0.95)] backdrop-blur-sm border-b border-[hsl(var(--border))]">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[hsl(var(--foreground))]" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-[hsl(var(--foreground))]">
            Settings
          </h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {/* Profile Card */}
        <Card className="mb-4">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-hover))] flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                  {user?.name || 'User'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email}</span>
                </div>
                {user?.hospital && (
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <Building className="w-3.5 h-3.5" />
                    <span>{user.hospital}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage & Subscription */}
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Subscription</CardTitle>
              {getPlanBadge()}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="py-4 flex justify-center">
                <Spinner size="sm" />
              </div>
            ) : (
              <>
                {/* Usage Stats */}
                {usage && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[hsl(var(--muted-foreground))]">Notes this month</span>
                      <span className="font-medium text-[hsl(var(--foreground))]">
                        {usage.notes_this_month} / {usage.notes_limit === -1 ? 'Unlimited' : usage.notes_limit}
                      </span>
                    </div>
                    {usage.notes_limit !== -1 && (
                      <div className="h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[hsl(var(--primary))] rounded-full transition-all"
                          style={{
                            width: `${Math.min((usage.notes_this_month / usage.notes_limit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Upgrade or Manage */}
                {subscription?.plan === 'free' ? (
                  <Button
                    onClick={handleUpgrade}
                    isLoading={isUpgrading}
                    className="w-full"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                ) : (
                  <Button
                    onClick={handleManageBilling}
                    variant="outline"
                    className="w-full"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Billing
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="mb-4">
          <CardContent className="p-0">
            <button
              onClick={() => navigate('/notes')}
              className="flex items-center justify-between w-full p-4 hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                <span className="text-[hsl(var(--foreground))]">All Notes</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
            </button>
            <div className="h-px bg-[hsl(var(--border))] mx-4" />
            <a
              href="https://hanna.ai/support"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                <span className="text-[hsl(var(--foreground))]">Help & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
            </a>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* Version */}
        <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mt-6">
          Hanna Scribe v1.0.0
        </p>
      </main>

      <BottomNav />
    </div>
  )
}
