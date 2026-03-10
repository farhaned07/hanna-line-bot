import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import BottomTabBar from './BottomTabBar';
import NewSessionModal from '@/components/scribe/NewSessionModal';
import { useNavigate } from 'react-router-dom';

/**
 * Mobile Layout Component
 * Mobile-first layout with bottom tab bar
 * 
 * @example
 * <MobileLayout>
 *   <YourPageContent />
 * </MobileLayout>
 */
export default function MobileLayout({ children, showTabBar = true }) {
  const navigate = useNavigate();
  const [showNewSession, setShowNewSession] = useState(false);

  const handleNewSession = () => {
    setShowNewSession(true);
  };

  const handleSessionCreated = (data) => {
    setShowNewSession(false);
    navigate(`/record/${data.sessionId}`);
  };

  return (
    <>
      <div className="min-h-dvh bg-background pb-20 relative">
        {/* Ambient Background Glow */}
        <div className="ambient-glow" />

        {/* Page Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Bottom Tab Bar */}
        {showTabBar && (
          <BottomTabBar onNewSession={handleNewSession} />
        )}
      </div>

      {/* New Session Modal */}
      <NewSessionModal
        isOpen={showNewSession}
        onClose={() => setShowNewSession(false)}
        onSubmit={handleSessionCreated}
      />
    </>
  );
}
