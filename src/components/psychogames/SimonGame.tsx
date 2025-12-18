'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface SimonGameProps {
  onComplete: (score: number) => void;
}

// Notes musicales pour chaque couleur (Do Ré Mi Fa)
const COLORS = [
  { id: 0, name: 'red', bg: 'bg-red-500', active: 'bg-red-400 shadow-lg shadow-red-500/50', note: 329.63 },    // Mi
  { id: 1, name: 'blue', bg: 'bg-blue-500', active: 'bg-blue-400 shadow-lg shadow-blue-500/50', note: 261.63 }, // Do
  { id: 2, name: 'green', bg: 'bg-green-500', active: 'bg-green-400 shadow-lg shadow-green-500/50', note: 392.00 }, // Sol
  { id: 3, name: 'yellow', bg: 'bg-amber-500', active: 'bg-amber-400 shadow-lg shadow-amber-500/50', note: 440.00 }, // La
];

const MAX_LEVEL = 15; // Niveau max

export default function SimonGame({ onComplete }: SimonGameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<'watch' | 'play' | 'result'>('watch');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Regardez la séquence...');
  const [speed, setSpeed] = useState(500); // Vitesse qui augmente avec les niveaux
  const audioRef = useRef(getGameAudio());

  // Jouer le son d'une couleur
  const playColorSound = useCallback((colorId: number) => {
    const color = COLORS[colorId];
    if (color) {
      audioRef.current.playNote(color.note, 0.3, 'square');
    }
  }, []);

  const playSequence = useCallback(async (seq: number[]) => {
    setIsPlaying(true);
    setGamePhase('watch');
    setMessage('🎵 Écoutez et regardez...');

    // Vitesse augmente avec les niveaux
    const currentSpeed = Math.max(250, 500 - (seq.length * 20));
    setSpeed(currentSpeed);

    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, currentSpeed));
      setActiveColor(seq[i]);
      playColorSound(seq[i]);
      await new Promise(resolve => setTimeout(resolve, currentSpeed - 100));
      setActiveColor(null);
    }

    setIsPlaying(false);
    setGamePhase('play');
    setMessage('🎹 À votre tour !');
  }, [playColorSound]);

  const addToSequence = useCallback(() => {
    const newColor = Math.floor(Math.random() * 4);
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    playSequence(newSequence);
  }, [sequence, playSequence]);

  useEffect(() => {
    // Démarrer le jeu
    const timer = setTimeout(() => {
      addToSequence();
    }, 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleColorClick = (colorId: number) => {
    if (isPlaying || gamePhase !== 'play') return;

    // Jouer le son de la couleur cliquée
    playColorSound(colorId);

    // Flash feedback
    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 200);

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    // Vérifier si correct
    const currentIndex = newPlayerSequence.length - 1;
    if (sequence[currentIndex] !== colorId) {
      // Erreur!
      audioRef.current.playError();
      setGamePhase('result');
      setMessage('❌ Erreur ! Fin du jeu.');
      return;
    }

    // Séquence complète ?
    if (newPlayerSequence.length === sequence.length) {
      setScore(sequence.length);
      audioRef.current.playLevelUp();
      setMessage('✨ Bravo ! Niveau suivant...');
      
      if (sequence.length >= MAX_LEVEL) {
        // Victoire après niveau max
        audioRef.current.playSuccess();
        setGamePhase('result');
        return;
      }

      setTimeout(() => {
        addToSequence();
      }, 1000);
    }
  };

  if (gamePhase === 'result') {
    const finalScore = Math.min(Math.round((score / MAX_LEVEL) * 100), 100);
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="text-5xl mb-4">🎹</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {score >= MAX_LEVEL ? '🏆 Parfait!' : 'Test terminé!'}
          </h3>
          <p className="text-gray-400 mb-2">Niveau atteint: {score}/{MAX_LEVEL}</p>
          <div className="flex gap-1 justify-center mb-4">
            {Array.from({ length: MAX_LEVEL }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < score ? 'bg-cyan-500' : 'bg-gray-600'}`} />
            ))}
          </div>
          <p className="text-4xl font-bold text-cyan-400 mb-6">{finalScore}%</p>
          <button
            onClick={() => onComplete(finalScore)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Continuer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      {/* Stats */}
      <div className="flex gap-8 mb-6">
        <div className="text-center bg-white/5 rounded-xl px-4 py-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Niveau</p>
          <p className="text-3xl font-bold text-white">{sequence.length}</p>
        </div>
        <div className="text-center bg-white/5 rounded-xl px-4 py-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Position</p>
          <p className="text-3xl font-bold text-purple-400">
            {playerSequence.length}<span className="text-lg text-gray-500">/{sequence.length}</span>
          </p>
        </div>
        <div className="text-center bg-white/5 rounded-xl px-4 py-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Vitesse</p>
          <p className="text-lg font-bold text-amber-400">{speed}ms</p>
        </div>
      </div>

      {/* Message */}
      <p className={`text-lg mb-6 font-medium ${gamePhase === 'watch' ? 'text-amber-400' : 'text-cyan-400'}`}>
        {message}
      </p>

      {/* Simon board */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {COLORS.map((color) => (
          <motion.button
            key={color.id}
            onClick={() => handleColorClick(color.id)}
            disabled={isPlaying || gamePhase !== 'play'}
            whileHover={!isPlaying ? { scale: 1.05 } : {}}
            whileTap={!isPlaying ? { scale: 0.95 } : {}}
            className={`w-28 h-28 rounded-2xl transition-all duration-150 ${
              activeColor === color.id ? color.active : color.bg
            } ${isPlaying ? 'opacity-70' : 'hover:brightness-110 cursor-pointer'}`}
            style={{
              transform: activeColor === color.id ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Note musicale affichée */}
      <div className="text-center mb-4">
        <p className="text-xs text-gray-500">Notes: Do (🔵) Mi (🔴) Sol (🟢) La (🟡)</p>
      </div>

      {/* Indicateur de progression */}
      <div className="flex gap-1.5">
        {sequence.map((colorId, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index < playerSequence.length
                ? 'bg-green-500 scale-100'
                : index === playerSequence.length
                ? 'bg-cyan-500 animate-pulse scale-125'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
