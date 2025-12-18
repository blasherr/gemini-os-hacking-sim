'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchTransitionProps {
  isActive: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export default function GlitchTransition({ 
  isActive, 
  message = "ACCÈS AUTORISÉ", 
  onComplete,
  duration = 3000 
}: GlitchTransitionProps) {
  const [phase, setPhase] = useState<'glitch' | 'message' | 'fade'>('glitch');

  useEffect(() => {
    if (!isActive) return;

    const messageTimer = setTimeout(() => setPhase('message'), duration * 0.4);
    const fadeTimer = setTimeout(() => {
      setPhase('fade');
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(fadeTimer);
    };
  }, [isActive, duration, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#000' }}
      >
        {/* Effet glitch background */}
        <div className="absolute inset-0">
          {/* Lignes de scan */}
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0% 0%', '0% 100%']
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
              backgroundSize: '100% 4px'
            }}
          />

          {/* Barres de glitch aléatoires */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 bg-hacker-primary/20"
              style={{ height: `${2 + Math.random() * 10}px` }}
              animate={{
                top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                opacity: [0.3, 0.8, 0.3],
                scaleX: [1, 1.2, 1]
              }}
              transition={{
                duration: 0.2 + Math.random() * 0.3,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
          ))}

          {/* Effet RGB shift */}
          <motion.div
            className="absolute inset-0"
            animate={{
              x: [-2, 2, -2],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity
            }}
            style={{
              background: 'linear-gradient(90deg, rgba(255,0,0,0.1) 0%, transparent 33%, rgba(0,255,0,0.1) 66%, transparent 100%)'
            }}
          />
        </div>

        {/* Message central */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ 
            scale: phase === 'message' || phase === 'fade' ? 1 : 0.8,
            rotate: 0,
            opacity: phase === 'fade' ? 0 : 1
          }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative text-center z-10"
        >
          {/* Texte avec effet glitch */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold"
            animate={{
              x: phase === 'glitch' ? [0, -3, 3, -2, 2, 0] : 0,
              textShadow: [
                '0 0 20px rgba(0, 255, 0, 0.8)',
                '3px 0 0 rgba(255, 0, 0, 0.7), -3px 0 0 rgba(0, 255, 255, 0.7)',
                '0 0 20px rgba(0, 255, 0, 0.8)'
              ]
            }}
            transition={{
              x: { duration: 0.2, repeat: phase === 'glitch' ? Infinity : 0 },
              textShadow: { duration: 0.3, repeat: Infinity }
            }}
            style={{
              color: '#00ff00',
              fontFamily: 'Orbitron, monospace',
              letterSpacing: '8px'
            }}
          >
            {message}
          </motion.h1>

          {/* Sous-texte */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'message' ? 1 : 0 }}
            className="mt-4 text-gray-400 tracking-widest text-sm"
            style={{ fontFamily: 'Share Tech Mono, monospace' }}
          >
            CHARGEMENT EN COURS...
          </motion.p>

          {/* Barre de progression */}
          <motion.div
            className="mt-6 w-64 mx-auto h-1 bg-gray-800 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-hacker-primary"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          </motion.div>
        </motion.div>

        {/* Texte défilant façon matrix */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-hacker-primary text-xs"
              style={{
                left: `${i * 10}%`,
                fontFamily: 'Share Tech Mono, monospace',
                writingMode: 'vertical-rl'
              }}
              initial={{ top: '-100%' }}
              animate={{ top: '100%' }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear'
              }}
            >
              {Array.from({ length: 50 }, () => 
                String.fromCharCode(0x30A0 + Math.random() * 96)
              ).join('')}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
