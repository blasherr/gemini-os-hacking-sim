'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import LoginScreen from '@/components/LoginScreen';
import Desktop from '@/components/Desktop';
import PsychoTestDesktop from '@/components/PsychoTestDesktop';
import NotificationSystem from '@/components/NotificationSystem';
import LoadingScreen from '@/components/LoadingScreen';
import BootSequence from '@/components/BootSequence';
import ScenarioBootSequence from '@/components/ScenarioBootSequence';

export default function Home() {
  const session = useGameStore((state) => state.session);
  const loadSession = useGameStore((state) => state.loadSession);
  const isLoading = useGameStore((state) => state.isLoading);
  const [mounted, setMounted] = useState(false);
  const [showBoot, setShowBoot] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for existing session
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('os_hack_userId');
      if (savedUserId) {
        loadSession(savedUserId);
      }
    }
  }, [loadSession]);

  // Détecter nouvelle session pour lancer le boot
  useEffect(() => {
    if (session && !bootComplete) {
      // Vérifier si c'est une nouvelle connexion (pas un refresh)
      const lastBootTime = sessionStorage.getItem('lastBootTime');
      const now = Date.now();
      
      if (!lastBootTime || now - parseInt(lastBootTime) > 60000) {
        // Nouvelle session ou plus d'1 minute depuis le dernier boot
        setShowBoot(true);
        sessionStorage.setItem('lastBootTime', now.toString());
      } else {
        setBootComplete(true);
      }
    }
  }, [session, bootComplete]);

  const handleBootComplete = () => {
    setShowBoot(false);
    setBootComplete(true);
  };

  if (!mounted || isLoading) {
    return <LoadingScreen />;
  }

  // Déterminer le type de session
  const isPsychotest = session?.sessionType === 'psychotest';

  return (
    <main className="h-screen w-screen overflow-hidden">
      {!session ? (
        <LoginScreen />
      ) : showBoot ? (
        // Boot bleu pour scénario, boot vert pour psychotest
        isPsychotest ? (
          <BootSequence onComplete={handleBootComplete} username={session.username} />
        ) : (
          <ScenarioBootSequence onComplete={handleBootComplete} username={session.username} />
        )
      ) : isPsychotest ? (
        <>
          <PsychoTestDesktop />
          <NotificationSystem />
        </>
      ) : (
        <>
          <Desktop />
          <NotificationSystem />
        </>
      )}
    </main>
  );
}
