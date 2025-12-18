'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function NotificationSystem() {
  const { notifications, removeNotification } = useGameStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`glass-effect rounded-xl p-4 shadow-2xl border-l-4 ${
              notif.type === 'success' ? 'border-l-hacker-primary' :
              notif.type === 'error' ? 'border-l-macos-red' :
              notif.type === 'warning' ? 'border-l-macos-yellow' :
              notif.type === 'owner' ? 'border-l-macos-accent' :
              'border-l-macos-text-secondary'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {notif.type === 'success' && (
                    <span className="text-hacker-primary text-xl">✓</span>
                  )}
                  {notif.type === 'error' && (
                    <span className="text-macos-red text-xl">✕</span>
                  )}
                  {notif.type === 'warning' && (
                    <span className="text-macos-yellow text-xl">⚠</span>
                  )}
                  {notif.type === 'owner' && (
                    <span className="text-macos-accent text-xl">👤</span>
                  )}
                  <h4 className="font-semibold text-macos-text">
                    {notif.title}
                  </h4>
                </div>
                <p className="text-sm text-macos-text-secondary">
                  {notif.message}
                </p>
              </div>
              {notif.duration !== 0 && (
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="text-macos-text-secondary hover:text-macos-text transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
