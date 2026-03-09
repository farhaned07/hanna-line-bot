import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, Clock, Settings, Plus } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/handover', icon: Clock, label: 'Handover' },
  { path: '/new', icon: Plus, label: 'Record', isAction: true },
  { path: '/notes', icon: FileText, label: 'Notes' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  const location = useLocation()

  // Don't show nav on certain pages
  const hiddenPaths = ['/login', '/recording', '/processing']
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) {
    return null
  }

  return (
    <nav className="tab-bar">
      {navItems.map((item) => {
        const isActive = item.path === '/' 
          ? location.pathname === '/'
          : location.pathname.startsWith(item.path)
        const Icon = item.icon

        if (item.isAction) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center justify-center -mt-6"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-hover))] flex items-center justify-center shadow-lg shadow-[hsl(var(--primary)/0.4)] hover:shadow-xl hover:scale-105 transition-all">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </Link>
          )
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn('tab-item', isActive && 'active')}
          >
            <Icon
              className={cn(
                'w-5 h-5 transition-colors',
                isActive
                  ? 'text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))]'
              )}
            />
            <span
              className={cn(
                'tab-label transition-colors',
                isActive
                  ? 'text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))]'
              )}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
