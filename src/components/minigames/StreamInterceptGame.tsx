'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface StreamInterceptGameProps {
  onComplete: () => void;
}

// Jeu d'interception de stream - attraper les caractères qui correspondent
export default function StreamInterceptGame({ onComplete }: StreamInterceptGameProps) {
  const [score, setScore] = useState(0);
  const [targetChar, setTargetChar] = useState('A');
  const [stream, setStream] = useState<{ char: string; id: number; x: number; y: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requiredScore = 15;

  const generateChar = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return chars[Math.floor(Math.random() * chars.length)];
  }, []);

  const generateNewTarget = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    setTargetChar(chars[Math.floor(Math.random() * chars.length)]);
  }, []);

  // Générer les caractères du stream
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setStream(prev => {
        // Ajouter nouveau caractère
        const newChar = {
          char: Math.random() > 0.3 ? generateChar() : targetChar, // 70% random, 30% target
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10, // 10-90%
          y: -10
        };
        
        // Bouger les caractères existants vers le bas et supprimer ceux qui sortent
        const updated = prev
          .map(c => ({ ...c, y: c.y + 3 }))
          .filter(c => c.y < 110);
        
        return [...updated, newChar];
      });
    }, 200);

    return () => clearInterval(interval);
  }, [gameOver, targetChar, generateChar]);

  // Timer
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  // Vérifier victoire
  useEffect(() => {
    if (score >= requiredScore && !gameOver) {
      setGameOver(true);
      setTimeout(onComplete, 1500);
    }
  }, [score, gameOver, onComplete]);

  const handleClick = (clickedChar: { char: string; id: number }) => {
    if (gameOver) return;

    if (clickedChar.char === targetChar) {
      const points = 1 + Math.floor(combo / 3); // Bonus combo
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      
      // Supprimer le caractère cliqué
      setStream(prev => prev.filter(c => c.id !== clickedChar.id));
      
      // Nouveau target tous les 5 points
      if ((score + points) % 5 === 0) {
        generateNewTarget();
      }
    } else {
      setCombo(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black p-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-hacker-primary mb-2" style={{ fontFamily: 'Orbitron' }}>
          📡 INTERCEPTION DE FLUX
        </h2>
        <p className="text-gray-400 text-sm">
          Cliquez uniquement sur les caractères <span className="text-hacker-primary text-2xl font-bold">{targetChar}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-between w-full max-w-md mb-4 text-sm">
        <div className="text-gray-400">
          Score: <span className="text-hacker-primary font-bold">{score}/{requiredScore}</span>
        </div>
        <div className="text-gray-400">
          Combo: <span className="text-yellow-400 font-bold">x{combo}</span>
        </div>
        <div className="text-gray-400">
          Temps: <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-hacker-primary'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Zone de jeu */}
      <div 
        ref={gameAreaRef}
        className="relative w-full max-w-md h-80 border-2 border-hacker-primary/50 rounded-lg overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(0,20,0,0.9) 0%, rgba(0,10,0,0.95) 100%)' }}
      >
        {/* Lignes de scan */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)'
        }} />

        {/* Caractères du stream */}
        {stream.map(item => (
          <motion.button
            key={item.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => handleClick(item)}
            className={`absolute text-2xl font-bold cursor-pointer transition-colors ${
              item.char === targetChar 
                ? 'text-hacker-primary hover:text-white hover:scale-125' 
                : 'text-gray-600 hover:text-gray-400'
            }`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              fontFamily: 'Share Tech Mono',
              textShadow: item.char === targetChar ? '0 0 10px rgba(0, 255, 0, 0.8)' : 'none'
            }}
          >
            {item.char}
          </motion.button>
        ))}

        {/* Game Over overlay */}
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80"
          >
            <div className="text-center">
              {score >= requiredScore ? (
                <>
                  <p className="text-3xl text-hacker-primary font-bold mb-2">✅ SUCCÈS</p>
                  <p className="text-gray-400">Flux intercepté avec succès!</p>
                </>
              ) : (
                <>
                  <p className="text-3xl text-red-500 font-bold mb-2">❌ ÉCHEC</p>
                  <p className="text-gray-400">Score insuffisant: {score}/{requiredScore}</p>
                  <button
                    onClick={() => {
                      setScore(0);
                      setCombo(0);
                      setTimeLeft(30);
                      setStream([]);
                      setGameOver(false);
                      generateNewTarget();
                    }}
                    className="mt-4 px-4 py-2 bg-hacker-primary text-black rounded hover:bg-hacker-primary/80"
                  >
                    Réessayer
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Barre de progression */}
      <div className="w-full max-w-md mt-4">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-hacker-primary"
            animate={{ width: `${(score / requiredScore) * 100}%` }}
            transition={{ type: 'spring', damping: 15 }}
          />
        </div>
      </div>
    </div>
  );
}
