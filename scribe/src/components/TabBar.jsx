import { NavLink, useLocation } from 'react-router-dom'
import { Home, ClipboardList, Settings } from 'lucide-react'

const tabs = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/handover', icon: ClipboardList, label: 'Handover' },
    { path: '/settings', icon: Settings, label: 'Settings' }
]

export default function TabBar() {
    const location = useLocation()

    // Hide on recording, processing, note screens
    const hiddenPaths = ['/record', '/processing', '/note']
    if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null

    return (
        <nav className="tab-bar">
            {tabs.map(({ path, icon: Icon, label }) => {
                const isActive = path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(path)
                return (
                    <NavLink
                        key={path}
                        to={path}
                        className={`tab-item ${isActive ? 'active' : ''}`}
                        aria-label={label}
                    >
                        <Icon
                            size={22}
                            strokeWidth={isActive ? 2 : 1.5}
                            style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-ink3)' }}
                        />
                        <span className="tab-label">{label}</span>
                    </NavLink>
                )
            })}
        </nav>
    )
}
