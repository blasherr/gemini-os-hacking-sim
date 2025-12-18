'use client';

import { useGameStore } from '@/store/gameStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TopBar() {
  const { session, currentObjective, completedObjectives, logout } = useGameStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progress = currentObjective ? 
    ((completedObjectives.length / 20) * 100).toFixed(0) : 0;

  return (
    <div 
      className="h-10 flex items-center justify-between px-4 text-xs relative z-50"
      style={{
        background: 'rgba(20,22,28,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Logo + Nom */}
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo/logo_améliorer_bleu.png"
            alt="GEMINI"
            width={22}
            height={22}
            className="opacity-90"
          />
          <span className="font-bold text-blue-400 tracking-wide text-sm">
            GEMINI OS
          </span>
        </div>
        
        {session && (
          <>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-gray-400">{session.username}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[10px]">MISSION</span>
              <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-blue-400 font-mono text-[11px]">{progress}%</span>
            </div>
          </>
        )}
      </div>

      {/* Center - Current objective */}
      {currentObjective && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20"
        >
          <span className="text-blue-400 text-[10px]">▶</span>
          <span className="text-gray-300 text-[11px]">
            {currentObjective.title}
          </span>
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Network */}
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
          <span className="text-[10px] text-gray-500">SECURE</span>
        </div>

        <div className="w-px h-4 bg-white/10" />
        
        {/* Time */}
        <span className="font-mono text-[11px] text-gray-300">{format(currentTime, 'HH:mm')}</span>

        <div className="w-px h-4 bg-white/10" />

        {/* Date */}
        <span className="text-[11px] text-gray-500">
          {format(currentTime, 'dd MMM', { locale: fr })}
        </span>

        <div className="w-px h-4 bg-white/10" />

        {/* Logout */}
        <div className="relative">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Se déconnecter"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>

          {/* Confirmation popup */}
          {showLogoutConfirm && (
            <div
              className="absolute right-0 top-full mt-2 rounded-lg p-3 shadow-xl z-50 min-w-[180px] bg-gray-900/98 border border-white/10"
            >
              <p className="text-white text-sm mb-2">Se déconnecter ?</p>
              <p className="text-gray-500 text-[11px] mb-3">Progression sauvegardée.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-2 py-1.5 text-[11px] bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={logout}
                  className="flex-1 px-2 py-1.5 text-[11px] bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                >
                  Quitter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
