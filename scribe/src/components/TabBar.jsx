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
        <nav className="tab-bar" role="navigation" aria-label="Main navigation">
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
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <Icon
                            size={24}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={isActive ? 'text-blue-400' : 'text-muted-foreground'}
                            aria-hidden="true"
                        />
                        <span className="tab-label">{label}</span>
                    </NavLink>
                )
            })}
        </nav>
    )
}
