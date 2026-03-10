import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ClipboardList, Plus, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Bottom Tab Bar Component
 * Mobile-first navigation for PWA
 * 
 * @example
 * <BottomTabBar />
 */

const tabs = [
  { name: 'Home', icon: Home, to: '/' },
  { name: 'Handover', icon: FileText, to: '/handover' },
  { name: 'Record', icon: Plus, to: '/', action: 'modal', highlight: true },
  { name: 'Care Plan', icon: ClipboardList, to: '/careplan' },
  { name: 'Settings', icon: Settings, to: '/settings' },
];

export function BottomTabBar({ onNewSession }) {
  const location = useLocation();

  const isActive = (to) => {
    if (to === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(to);
  };

  const handleNewSession = (e) => {
    e.preventDefault();
    if (onNewSession) {
      onNewSession();
    }
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
    >
      {/* Background with blur */}
      <div className="absolute inset-0 bg-background-secondary/95 backdrop-blur-xl border-t border-border-default" />
      
      {/* Tab bar content */}
      <div className="relative flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.to);
          const Icon = tab.icon;

          // Center FAB button
          if (tab.highlight) {
            return (
              <button
                key={tab.name}
                onClick={handleNewSession}
                className="relative -top-5"
                aria-label={tab.name}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary-glow/50 border-4 border-background"
                >
                  <Plus size={24} className="text-white" />
                </motion.div>
              </button>
            );
          }

          // Regular tab
          return (
            <Link
              key={tab.name}
              to={tab.to}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={tab.name}
              aria-current={active ? 'page' : undefined}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon
                  size={22}
                  className={cn(
                    'mb-0.5',
                    active ? 'fill-primary/20' : ''
                  )}
                />
              </motion.div>
              <span className="text-[10px] font-medium leading-none">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area for iOS home indicator */}
      <div className="h-5 bg-background-secondary/95 backdrop-blur-xl" />
    </motion.nav>
  );
}

export default BottomTabBar;
