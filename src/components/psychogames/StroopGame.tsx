'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface StroopGameProps {
  onComplete: (score: number) => void;
}

const COLORS = [
  { name: 'ROUGE', color: '#ef4444' },
  { name: 'BLEU', color: '#3b82f6' },
  { name: 'VERT', color: '#22c55e' },
  { name: 'JAUNE', color: '#eab308' },
  { name: 'VIOLET', color: '#a855f7' },
  { name: 'ORANGE', color: '#f97316' },
];

// Notes musicales pour chaque couleur
const COLOR_NOTES: { [key: string]: number } = {
  'ROUGE': 329.63,  // Mi
  'BLEU': 261.63,   // Do
  'VERT': 392.00,   // Sol
  'JAUNE': 440.00,  // La
  'VIOLET': 349.23, // Fa
  'ORANGE': 293.66, // Ré
};

interface StroopQuestion {
  word: string;
  displayColor: string;
  correctColor: string;
  options: { name: string; color: string }[];
}

export default function StroopGame({ onComplete }: StroopGameProps) {
  const [question, setQuestion] = useState<StroopQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const audioRef = useRef(getGameAudio());

  const generateQuestion = useCallback((): StroopQuestion => {
    // Choisir un mot (nom de couleur)
    const wordIndex = Math.floor(Math.random() * COLORS.length);
    const word = COLORS[wordIndex].name;
    
    // Choisir une couleur d'affichage différente (effet Stroop)
    let displayColorIndex;
    do {
      displayColorIndex = Math.floor(Math.random() * COLORS.length);
    } while (displayColorIndex === wordIndex && Math.random() > 0.3); // 30% de chance d'être la même
    
    const displayColor = COLORS[displayColorIndex].color;
    
    // La bonne réponse est la couleur AFFICHÉE, pas le mot
    const correctColor = COLORS[displayColorIndex].name;
    
    // Générer les options (4 couleurs dont la bonne)
    const optionSet = new Set([displayColorIndex]);
    while (optionSet.size < 4) {
      optionSet.add(Math.floor(Math.random() * COLORS.length));
    }
    const options = Array.from(optionSet)
      .map(i => COLORS[i])
      .sort(() => Math.random() - 0.5);

    return { word, displayColor, correctColor, options };
  }, []);

  useEffect(() => {
    setQuestion(generateQuestion());
  }, [generateQuestion]);

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

  const handleAnswer = (colorName: string) => {
    if (gameOver || !question || showFeedback) return;
    
    // Jouer la note de la couleur cliquée
    const noteFreq = COLOR_NOTES[colorName];
    if (noteFreq) {
      audioRef.current.playNote(noteFreq, 0.2);
    }
    
    const isCorrect = colorName === question.correctColor;
    setShowFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      // Petit son d'erreur après la note
      setTimeout(() => audioRef.current.playNote(150, 0.1, 'sawtooth'), 100);
    }
    setQuestionsAnswered(prev => prev + 1);

    setTimeout(() => {
      setQuestion(generateQuestion());
      setShowFeedback(null);
    }, 300);
  };

  if (gameOver || !question) {
    const finalScore = questionsAnswered > 0 
      ? Math.round((score / questionsAnswered) * 100)
      : 0;
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="text-5xl mb-4">👁️</div>
          <h3 className="text-2xl font-bold text-white mb-2">Test terminé!</h3>
          <div className="space-y-2 mb-4">
            <p className="text-gray-400">Réponses correctes: {score}/{questionsAnswered}</p>
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
          <p className="text-sm text-gray-400">Temps</p>
          <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            {timeLeft}s
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-4 py-2 mb-6">
        <p className="text-yellow-400 text-sm font-medium">
          ⚠️ Cliquez sur la COULEUR du texte, pas le mot !
        </p>
      </div>

      {/* Mot Stroop */}
      <motion.div
        key={questionsAnswered}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`text-6xl font-bold mb-8 p-6 rounded-2xl transition-colors ${
          showFeedback === 'correct' ? 'bg-green-500/20' :
          showFeedback === 'wrong' ? 'bg-red-500/20' : 'bg-black/40'
        }`}
        style={{ color: question.displayColor }}
      >
        {question.word}
      </motion.div>

      {/* Options de couleur */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleAnswer(option.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-4 rounded-xl text-white font-bold transition-all"
            style={{ backgroundColor: option.color }}
          >
            {option.name}
          </motion.button>
        ))}
      </div>

      <p className="text-gray-400 text-sm mt-6">
        Ignorez le mot, concentrez-vous sur la couleur !
      </p>
    </div>
  );
}
