'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface TypingGameProps {
  onComplete: (score: number) => void;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Notes musicales pour les lettres (gamme chromatique)
const LETTER_NOTES: { [key: string]: number } = {
  'A': 261.63, 'B': 277.18, 'C': 293.66, 'D': 311.13, 'E': 329.63, 'F': 349.23, 'G': 369.99,
  'H': 392.00, 'I': 415.30, 'J': 440.00, 'K': 466.16, 'L': 493.88, 'M': 523.25,
  'N': 554.37, 'O': 587.33, 'P': 622.25, 'Q': 659.25, 'R': 698.46, 'S': 739.99,
  'T': 783.99, 'U': 830.61, 'V': 880.00, 'W': 932.33, 'X': 987.77, 'Y': 1046.50, 'Z': 1108.73
};

export default function TypingGame({ onComplete }: TypingGameProps) {
  const [currentLetter, setCurrentLetter] = useState('');
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const audioRef = useRef(getGameAudio());

  const generateLetter = useCallback(() => {
    const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    setCurrentLetter(letter);
  }, []);

  useEffect(() => {
    generateLetter();
  }, [generateLetter]);

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

  useEffect(() => {
    if (gameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (key === currentLetter) {
        // Jouer la note de la lettre
        const noteFreq = LETTER_NOTES[key];
        if (noteFreq) {
          audioRef.current.playNote(noteFreq, 0.12);
        }
        setScore(prev => prev + 1);
        setLastResult('correct');
        generateLetter();
      } else if (LETTERS.includes(key)) {
        audioRef.current.playError();
        setErrors(prev => prev + 1);
        setLastResult('wrong');
      }

      setTimeout(() => setLastResult(null), 200);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentLetter, gameOver, generateLetter]);

  if (gameOver) {
    const total = score + errors;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    const speedBonus = Math.min(score * 2, 40);
    const finalScore = Math.round((accuracy * 0.6) + speedBonus);
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="text-5xl mb-4">⌨️</div>
          <h3 className="text-2xl font-bold text-white mb-2">Test terminé!</h3>
          <div className="space-y-2 mb-4">
            <p className="text-gray-400">Lettres correctes: {score}</p>
            <p className="text-gray-400">Erreurs: {errors}</p>
            <p className="text-gray-400">Précision: {accuracy}%</p>
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
      <div className="flex gap-6 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-400">Score</p>
          <p className="text-2xl font-bold text-green-400">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Erreurs</p>
          <p className="text-2xl font-bold text-red-400">{errors}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Temps</p>
          <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            {timeLeft}s
          </p>
        </div>
      </div>

      {/* Lettre à taper */}
      <motion.div
        key={currentLetter}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-40 h-40 rounded-3xl flex items-center justify-center text-7xl font-bold transition-colors ${
          lastResult === 'correct' ? 'bg-green-500/30 text-green-400' :
          lastResult === 'wrong' ? 'bg-red-500/30 text-red-400' :
          'bg-black/40 text-white'
        } border-4 ${
          lastResult === 'correct' ? 'border-green-500' :
          lastResult === 'wrong' ? 'border-red-500' :
          'border-cyan-500/50'
        }`}
      >
        {currentLetter}
      </motion.div>

      {/* Clavier visuel */}
      <div className="mt-8 text-gray-500 text-sm">
        Appuyez sur la touche correspondante
      </div>

      {/* Indicateurs visuels */}
      <div className="mt-4 flex gap-2">
        {[...Array(Math.min(score, 20))].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
        ))}
      </div>

      <p className="text-gray-400 text-sm mt-6">
        Tapez le plus de lettres possible en 30 secondes !
      </p>
    </div>
  );
}
