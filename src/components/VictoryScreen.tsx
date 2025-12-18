'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

interface VictoryScreenProps {
  successCode: string;
  username: string;
  onClose: () => void;
}

export default function VictoryScreen({ successCode, username, onClose }: VictoryScreenProps) {
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    // Animation séquencée
    const timer = setTimeout(() => setShowCode(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, #0a1a0a 0%, #000 70%)'
      }}
    >
      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-hacker-primary rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 10,
              opacity: 0.5
            }}
            animate={{ 
              y: -10,
              opacity: [0.5, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative border-2 border-hacker-primary p-12 md:p-16 text-center max-w-2xl mx-4"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 20, 0, 0.98) 0%, rgba(0, 10, 0, 0.98) 100%)',
          boxShadow: '0 0 80px rgba(0, 255, 0, 0.3), inset 0 0 60px rgba(0, 255, 0, 0.1)',
          borderRadius: '8px'
        }}
      >
        {/* Titre */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6"
          style={{
            color: '#00ff00',
            fontFamily: 'Orbitron, monospace',
            letterSpacing: '8px',
            textShadow: '0 0 30px rgba(0, 255, 0, 0.8)'
          }}
        >
          🎉 FÉLICITATIONS 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-400 text-lg tracking-widest mb-8"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          MISSION ACCOMPLIE, AGENT {username.toUpperCase()}
        </motion.p>

        {/* Code de succès */}
        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="my-8 p-6 border border-dashed border-hacker-primary rounded-lg"
              style={{
                background: 'linear-gradient(180deg, #001500 0%, #000a00 100%)'
              }}
            >
              <p className="text-sm text-gray-500 mb-2 tracking-wider">VOTRE CODE DE RÉUSSITE</p>
              <p 
                className="text-3xl md:text-4xl font-bold tracking-widest"
                style={{
                  color: '#00ff00',
                  fontFamily: 'Orbitron, monospace',
                  textShadow: '0 0 20px rgba(0, 255, 0, 0.8)'
                }}
              >
                {successCode}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="grid grid-cols-3 gap-4 my-8 text-center"
        >
          <div className="p-3 bg-black/50 rounded-lg border border-hacker-primary/30">
            <p className="text-2xl font-bold text-hacker-primary">20/20</p>
            <p className="text-xs text-gray-500">OBJECTIFS</p>
          </div>
          <div className="p-3 bg-black/50 rounded-lg border border-hacker-primary/30">
            <p className="text-2xl font-bold text-hacker-primary">100%</p>
            <p className="text-xs text-gray-500">PROGRESSION</p>
          </div>
          <div className="p-3 bg-black/50 rounded-lg border border-hacker-primary/30">
            <p className="text-2xl font-bold text-hacker-primary">ELITE</p>
            <p className="text-xs text-gray-500">RANG</p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="text-gray-600 text-xs tracking-wider mb-6"
          style={{ fontFamily: 'Share Tech Mono, monospace' }}
        >
          PRÉSENTEZ CE CODE À VOTRE INSTRUCTEUR POUR VALIDER VOTRE RÉUSSITE
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          onClick={onClose}
          className="px-8 py-3 border border-hacker-primary text-hacker-primary rounded-lg hover:bg-hacker-primary hover:text-black transition-all duration-300"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          TERMINER LA SESSION
        </motion.button>

        {/* Effet de scan */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 50%)',
            backgroundSize: '100% 4px'
          }}
        />
      </motion.div>
    </motion.div>
  );
}
