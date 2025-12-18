'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import Image from 'next/image';
import { getAudioPlayer } from '@/lib/audioPlayer';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [isOwnerLogin, setIsOwnerLogin] = useState(false);
  const [ownerUsername, setOwnerUsername] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { initializeSession, setOwnerMode } = useGameStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioPlayer = getAudioPlayer();
      setAudioEnabled(!audioPlayer.isMuted());
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('🔐 Login attempt:', { username: username.trim(), isOwnerLogin });
    
    try {
      if (isOwnerLogin) {
        const success = setOwnerMode(ownerUsername, ownerPassword);
        if (!success) {
          setError('Identifiants incorrects');
          const audioPlayer = getAudioPlayer();
          audioPlayer.play('error', 0.3);
          setIsLoading(false);
          return;
        }
        const audioPlayer = getAudioPlayer();
        audioPlayer.play('login-success', 0.5);
        window.location.href = '/owner';
      } else {
        if (username.trim()) {
          console.log('⏳ Calling initializeSession...');
          // ⚡ Tentative de connexion (avec retry automatique)
          await initializeSession(username.trim());
          console.log('✅ initializeSession completed!');
          const audioPlayer = getAudioPlayer();
          audioPlayer.play('login-success', 0.5);
          // ✅ La session est chargée, le composant parent (page.tsx) va re-render automatiquement
          setIsLoading(false);
          console.log('🎯 Login complete, isLoading set to false');
        }
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      if (err?.message === 'SESSION_NOT_FOUND') {
        setError('⚠️ Identifiant non reconnu. La session est peut-être en cours de création, réessayez dans quelques secondes.');
      } else {
        setError('Une erreur est survenue. Vérifiez votre connexion.');
      }
      const audioPlayer = getAudioPlayer();
      audioPlayer.play('error', 0.3);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-hacker-primary via-transparent to-transparent animate-slide-down"></div>
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-hacker-secondary via-transparent to-transparent animate-slide-down delay-500"></div>
        <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-hacker-primary via-transparent to-transparent animate-slide-down delay-1000"></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hacker-primary rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 backdrop-blur-xl bg-black/40 border border-hacker-primary/30 rounded-3xl p-10 max-w-lg w-full mx-4 shadow-2xl shadow-hacker-primary/20">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-hacker-primary via-purple-500 to-hacker-secondary p-3 flex items-center justify-center shadow-lg shadow-hacker-primary/50 animate-glow relative overflow-hidden">
            {/* Nouveau logo SVG */}
            <Image 
              src="/assets/logo/gemini-logo.svg" 
              alt="Gemini Logo" 
              width={88} 
              height={88}
              priority
              className="drop-shadow-2xl"
            />
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-hacker-primary via-purple-400 to-hacker-secondary bg-clip-text text-transparent animate-gradient">
            GEMINI OS
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-hacker-primary"></div>
            <p className="text-hacker-primary/80 text-sm font-medium tracking-wider">
              {isOwnerLogin ? 'ADMIN ACCESS' : 'SECURE LOGIN'}
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-hacker-primary"></div>
          </div>
          <p className="text-gray-400 text-xs">
            {isOwnerLogin ? 'Panel de contr\u00f4le administrateur' : 'Mission de s\u00e9curit\u00e9 class\u00e9e'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {!isOwnerLogin ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-hacker-primary/90 mb-2 tracking-wide">
                CODE D'AGENT
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-hacker-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-hacker-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-hacker-primary focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="Entrez votre identifiant..."
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-hacker-primary/90 tracking-wide">
                  ADMIN USERNAME
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-hacker-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={ownerUsername}
                    onChange={(e) => setOwnerUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-hacker-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-hacker-primary focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="Username..."
                    required
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-hacker-primary/90 tracking-wide">
                  ADMIN PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-hacker-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-hacker-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-hacker-primary focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="Password..."
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-hacker-primary via-purple-500 to-hacker-secondary hover:from-hacker-secondary hover:via-purple-500 hover:to-hacker-primary text-black font-bold rounded-xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-hacker-primary/30 hover:shadow-hacker-primary/50 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CONNEXION...
                </>
              ) : (
                <>
                  {isOwnerLogin ? 'ACCÉDER AU PANEL' : 'DÉMARRER LA MISSION'}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsOwnerLogin(!isOwnerLogin);
              setUsername('');
              setOwnerUsername('');
              setOwnerPassword('');
              setError('');
            }}
            disabled={isLoading}
            className="text-sm text-hacker-primary hover:text-hacker-secondary transition-colors flex items-center gap-2 mx-auto group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {isOwnerLogin ? 'Retour au mode agent' : 'Acc\u00e8s administrateur'}
          </button>
        </div>

        {!isOwnerLogin && (
          <div className="mt-6 p-4 bg-gradient-to-br from-hacker-primary/5 to-purple-500/5 rounded-xl border border-hacker-primary/20 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-hacker-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-gray-400 space-y-1">
                <p className="text-hacker-primary/90 font-semibold">BRIEFING DE MISSION</p>
                <p>• Classification: TOP SECRET</p>
                <p>• Durée estimée: 20 minutes</p>
                <p>• Niveau: Intermédiaire</p>
                <p>• Objectifs: 20 étapes</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Toggle Button */}
      <button
        onClick={() => {
          const audioPlayer = getAudioPlayer();
          const muted = audioPlayer.toggleMute();
          setAudioEnabled(!muted);
        }}
        className="fixed top-6 right-6 z-20 p-3 backdrop-blur-xl bg-black/40 border border-hacker-primary/30 rounded-full hover:border-hacker-primary/60 transition-all group"
        title={audioEnabled ? 'Désactiver le son' : 'Activer le son'}
      >
        {audioEnabled ? (
          <svg className="w-6 h-6 text-hacker-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.586l-2.122 2.122a1 1 0 01-1.414 0L.636 16.294a1 1 0 010-1.414L2.758 12.758m0 0a3 3 0 014.243 0L9.12 14.88m-4.243-2.122a3 3 0 010-4.243m0 0L2.758 6.394a1 1 0 010-1.414L4.172 3.566a1 1 0 011.414 0l2.122 2.122m0 0a3 3 0 014.243 0m0 0a3 3 0 010 4.243" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-400 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15.586l-2.122 2.122a1 1 0 01-1.414 0L.636 16.294a1 1 0 010-1.414L2.758 12.758m0 0a3 3 0 014.243 0L9.12 14.88m-4.243-2.122a3 3 0 010-4.243m0 0L2.758 6.394a1 1 0 010-1.414L4.172 3.566a1 1 0 011.414 0l2.122 2.122m0 0a3 3 0 014.243 0m0 0a3 3 0 010 4.243M16 12v.01" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
          </svg>
        )}
      </button>

      {/* Footer with version */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
          <div className="w-2 h-2 rounded-full bg-hacker-primary animate-pulse"></div>
          <p>GEMINI OS v2025.1 | Powered by Advanced Security Systems</p>
          <div className="w-2 h-2 rounded-full bg-hacker-primary animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
