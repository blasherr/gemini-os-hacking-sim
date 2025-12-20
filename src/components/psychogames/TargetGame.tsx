'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface TargetGameProps {
  onComplete: (score: number) => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  createdAt: number;
}

// Notes qui montent avec le score
const getTargetNote = (score: number): number => {
  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
  return notes[score % notes.length];
};

export default function TargetGame({ onComplete }: TargetGameProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [targetId, setTargetId] = useState(0);
  const audioRef = useRef(getGameAudio());

  const spawnTarget = useCallback(() => {
    const newTarget: Target = {
      id: targetId,
      x: Math.random() * 80 + 10, // 10-90%
      y: Math.random() * 70 + 15, // 15-85%
      size: Math.max(50, 90 - score * 1.5), // PLUS GROS : Commence à 90px, min 50px (avant 60->30)
      createdAt: Date.now(),
    };
    setTargetId(prev => prev + 1);
    setTargets(prev => [...prev, newTarget]);

    // Supprimer la cible si non cliquée après un délai
    const timeout = Math.max(3000 - score * 50, 1500); // ENCORE PLUS LENT : 3s -> 1.5s min
    setTimeout(() => {
      setTargets(prev => {
        if (prev.find(t => t.id === newTarget.id)) {
          setMissed(m => m + 1);
          audioRef.current.playNote(150, 0.1, 'triangle');
          return prev.filter(t => t.id !== newTarget.id);
        }
        return prev;
      });
    }, timeout);
  }, [targetId, score]);

  useEffect(() => {
    if (gameOver) return;
    
    // Spawn initial
    spawnTarget();
    
    // Spawn régulier
    const spawnInterval = setInterval(() => {
      if (!gameOver) spawnTarget();
    }, Math.max(1500 - score * 30, 800)); // Spawn encore plus calme

    return () => clearInterval(spawnInterval);
  }, [gameOver, spawnTarget, score]);

  useEffect(() => {
    if (gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          audioRef.current.playGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  const handleTargetClick = (targetId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargets(prev => prev.filter(t => t.id !== targetId));
    // Jouer une note qui monte avec le score
    audioRef.current.playNote(getTargetNote(score), 0.15);
    setScore(prev => prev + 1);
  };

  const handleMiss = () => {
    setMissed(prev => prev + 1);
  };

  if (gameOver) {
    const total = score + missed;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    
    // Nouveau calcul : 3 points par cible + bonus précision (max 25)
    // Rend le score beaucoup moins punitif sur les ratés
    const hitPoints = score * 3;
    const accuracyBonus = Math.round(accuracy * 0.25);
    const finalScore = Math.min(hitPoints + accuracyBonus, 100);
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-black/40 border border-cyan-500/30 rounded-2xl p-8"
        >
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-white mb-2">Test terminé!</h3>
          <div className="space-y-2 mb-4">
            <p className="text-gray-400">Cibles touchées: {score}</p>
            <p className="text-gray-400">Cibles manquées: {missed}</p>
            <p className="text-gray-400">Précision: {accuracy}%</p>
          </div>
          <p className="text-4xl font-bold text-cyan-400 mb-6">{finalScore}%</p>
          <button
            onClick={() => onComplete(finalScore)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-bold"
          >
            Continuer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[400px] p-4">
      {/* Stats */}
      <div className="flex gap-6 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">Score</p>
          <p className="text-2xl font-bold text-green-400">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Manqué</p>
          <p className="text-2xl font-bold text-red-400">{missed}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Temps</p>
          <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            {timeLeft}s
          </p>
        </div>
      </div>

      {/* Zone de jeu */}
      <div 
        onClick={handleMiss}
        className="relative w-full h-[350px] bg-black/40 border border-gray-700 rounded-2xl overflow-hidden cursor-crosshair"
      >
        <AnimatePresence>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={(e) => handleTargetClick(target.id, e)}
              className="absolute bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg shadow-red-500/50 hover:from-red-400 hover:to-orange-400 transition-colors"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: target.size,
                height: target.size,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="absolute inset-2 bg-white/30 rounded-full" />
              <div className="absolute inset-4 bg-red-600 rounded-full" />
            </motion.button>
          ))}
        </AnimatePresence>

        {targets.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 animate-pulse">En attente de cibles...</p>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm mt-4">
        Cliquez sur les cibles le plus vite possible !
      </p>
    </div>
  );
}
