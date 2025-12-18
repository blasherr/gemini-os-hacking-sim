'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
  username: string;
}

const bootMessages = [
  { text: 'Initialisation du système...', delay: 0 },
  { text: 'Chargement du kernel GEMINI v2.5.0...', delay: 400 },
  { text: 'Vérification des modules de sécurité...', delay: 800 },
  { text: 'Connexion au réseau sécurisé...', delay: 1200 },
  { text: 'Authentification biométrique... OK', delay: 1600 },
  { text: 'Chargement de l\'environnement utilisateur...', delay: 2000 },
  { text: 'Initialisation des outils de hacking...', delay: 2400 },
  { text: 'Connexion au serveur C2...', delay: 2800 },
  { text: 'Système prêt.', delay: 3200 },
];

export default function BootSequence({ onComplete, username }: BootSequenceProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Afficher les messages de boot progressivement
    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setCurrentLine(index + 1);
      }, msg.delay);
    });

    // Afficher le message de bienvenue
    setTimeout(() => {
      setShowWelcome(true);
    }, 3800);

    // Lancer le fadeout et terminer
    setTimeout(() => {
      setFadeOut(true);
    }, 5500);

    setTimeout(() => {
      onComplete();
    }, 6500);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!fadeOut ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Scanlines effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)'
            }}
          />

          {/* Logo animé */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-24 h-24 border-4 border-hacker-primary rounded-2xl flex items-center justify-center relative">
              <motion.div
                animate={{ 
                  boxShadow: ['0 0 20px rgba(0, 255, 0, 0.3)', '0 0 40px rgba(0, 255, 0, 0.6)', '0 0 20px rgba(0, 255, 0, 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl"
              />
              <span className="text-4xl font-bold text-hacker-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
                G
              </span>
            </div>
          </motion.div>

          {/* Terminal de boot */}
          <div className="w-full max-w-2xl px-8">
            <div className="bg-black/80 border border-hacker-primary/30 rounded-lg p-6 font-mono text-sm">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-hacker-primary/20">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-gray-500 text-xs">GEMINI BOOT LOADER v2.5</span>
              </div>

              {/* Boot messages */}
              <div className="space-y-1 min-h-[200px]">
                {bootMessages.slice(0, currentLine).map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-hacker-primary">[{String(index).padStart(2, '0')}]</span>
                    <span className={index === bootMessages.length - 1 ? 'text-hacker-primary font-bold' : 'text-gray-400'}>
                      {msg.text}
                    </span>
                    {index === currentLine - 1 && index !== bootMessages.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-hacker-primary"
                      >
                        █
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6 pt-4 border-t border-hacker-primary/20">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progression</span>
                  <span>{Math.round((currentLine / bootMessages.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-hacker-primary to-hacker-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentLine / bootMessages.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Message de bienvenue */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-center"
              >
                <motion.h1
                  className="text-3xl font-bold mb-2"
                  style={{ 
                    fontFamily: 'Orbitron, monospace',
                    color: '#00ff00',
                    textShadow: '0 0 20px rgba(0, 255, 0, 0.5)'
                  }}
                >
                  BIENVENUE, {username.toUpperCase()}
                </motion.h1>
                <p className="text-gray-400 text-sm tracking-widest">
                  ACCÈS AUTORISÉ • NIVEAU DE SÉCURITÉ: OMEGA
                </p>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="mt-4"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-hacker-primary/10 border border-hacker-primary/30 rounded-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-hacker-primary border-t-transparent rounded-full"
                    />
                    <span className="text-hacker-primary text-sm">Chargement du bureau...</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Particules flottantes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-hacker-primary rounded-full"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                  y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 10,
                  opacity: 0.3
                }}
                animate={{ 
                  y: -10,
                  opacity: [0.3, 0.8, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[9999] bg-black"
        />
      )}
    </AnimatePresence>
  );
}
