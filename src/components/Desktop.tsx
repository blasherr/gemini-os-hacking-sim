'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import TopBar from './TopBar';
import Dock from './Dock';
import Terminal from './Terminal';
import FileManager from './FileManager';
import MissionBriefing from './MissionBriefing';
import MiniGameWindow from './MiniGameWindow';
import VictoryScreen from './VictoryScreen';
import GlitchTransition from './GlitchTransition';
import { useGameStore } from '@/store/gameStore';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Desktop() {
  const { activeWindow, setActiveWindow, session, addNotification, completedObjectives, currentObjective } = useGameStore();
  const [windows, setWindows] = useState<{[key: string]: boolean}>({
    terminal: false,
    files: false,
    mission: true, // Start with mission briefing open
    minigame: false
  });
  const [showVictory, setShowVictory] = useState(false);
  const [showGlitchTransition, setShowGlitchTransition] = useState(false);
  const [glitchMessage, setGlitchMessage] = useState('');

  // Check if all objectives are completed for victory screen
  useEffect(() => {
    // 20 total objectives
    const progress = (completedObjectives.length / 20) * 100;
    if (completedObjectives.length === 20 && progress === 100) {
      // Trigger glitch transition before victory
      setGlitchMessage('MISSION ACCOMPLIE');
      setShowGlitchTransition(true);
    }
  }, [completedObjectives]);

  const handleGlitchComplete = useCallback(() => {
    setShowGlitchTransition(false);
    setShowVictory(true);
  }, []);

  // Listen for owner notifications
  useEffect(() => {
    if (!session?.userId) return;

    const unsubscribe = onSnapshot(doc(db, 'sessions', session.userId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.ownerNotification && data.ownerNotification.message) {
          // Display owner notification
          addNotification({
            type: 'owner',
            title: '📢 Message de l\'Admin',
            message: data.ownerNotification.message,
            duration: 10000
          });
          
          // Clear the notification in Firebase
          updateDoc(doc(db, 'sessions', session.userId), {
            ownerNotification: null
          }).catch(console.error);
        }
        
        // Check for special owner actions
        if (data.ownerAction) {
          if (data.ownerAction.type === 'glitch') {
            setGlitchMessage(data.ownerAction.message || 'INTRUSION DÉTECTÉE');
            setShowGlitchTransition(true);
            setTimeout(() => setShowGlitchTransition(false), 3000);
          }
          
          // Clear the action
          updateDoc(doc(db, 'sessions', session.userId), {
            ownerAction: null
          }).catch(console.error);
        }
      }
    });

    return () => unsubscribe();
  }, [session?.userId, addNotification]);

  const openWindow = (window: string) => {
    setWindows(prev => ({ ...prev, [window]: true }));
    setActiveWindow(window);
  };

  const closeWindow = (window: string) => {
    setWindows(prev => ({ ...prev, [window]: false }));
    if (activeWindow === window) {
      setActiveWindow(null);
    }
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(145deg, #050508 0%, #0a0a10 30%, #080810 70%, #050508 100%)'
      }}
    >
      {/* Logos en fond - uniquement bleu */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Logo bleu - haut gauche (petit) */}
        <div className="absolute top-16 left-8 opacity-8">
          <Image
            src="/assets/logo/logo_améliorer_bleu.png"
            alt=""
            width={100}
            height={100}
            className="blur-[0.5px]"
            style={{ filter: 'brightness(0.6) opacity(0.15)' }}
          />
        </div>
        
        {/* Logo bleu - centre fond d'écran principal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Glow subtil bleu */}
            <div className="absolute inset-0 bg-blue-500/10 blur-[80px] scale-150" />
            <Image
              src="/assets/logo/logo_améliorer_bleu.png"
              alt="GEMINI"
              width={550}
              height={550}
              className="opacity-15"
              style={{ filter: 'brightness(1.2)' }}
              priority
            />
          </div>
        </div>
        
        {/* Logo bleu - bas droite (petit) */}
        <div className="absolute bottom-24 right-8 opacity-8">
          <Image
            src="/assets/logo/logo_améliorer_bleu.png"
            alt=""
            width={80}
            height={80}
            className="blur-[0.5px]"
            style={{ filter: 'brightness(0.6) opacity(0.15)' }}
          />
        </div>
      </div>

      {/* Grille subtile */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 150, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 150, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
        }}
      />

      {/* Top Bar */}
      <TopBar />

      {/* Desktop Area */}
      <div className="flex-1 relative p-4">
        {/* Windows */}
        {windows.mission && (
          <MissionBriefing
            onClose={() => closeWindow('mission')}
            isActive={activeWindow === 'mission'}
            onFocus={() => setActiveWindow('mission')}
          />
        )}

        {windows.terminal && (
          <Terminal
            onClose={() => closeWindow('terminal')}
            isActive={activeWindow === 'terminal'}
            onFocus={() => setActiveWindow('terminal')}
          />
        )}

        {windows.files && (
          <FileManager
            onClose={() => closeWindow('files')}
            isActive={activeWindow === 'files'}
            onFocus={() => setActiveWindow('files')}
          />
        )}

        {windows.minigame && (
          <MiniGameWindow
            onClose={() => closeWindow('minigame')}
            isActive={activeWindow === 'minigame'}
            onFocus={() => setActiveWindow('minigame')}
          />
        )}
      </div>

      {/* Dock */}
      <Dock onOpenWindow={openWindow} />

      {/* Glitch Transition Effect */}
      <GlitchTransition 
        isActive={showGlitchTransition} 
        message={glitchMessage}
        onComplete={handleGlitchComplete}
        duration={3000}
      />

      {/* Victory Screen */}
      {showVictory && (
        <VictoryScreen
          successCode={session?.successCode || 'GEMINI-ELITE-2025'}
          username={session?.username || 'AGENT'}
          onClose={() => setShowVictory(false)}
        />
      )}
    </div>
  );
}
