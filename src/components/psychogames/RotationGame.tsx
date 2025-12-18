'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface RotationGameProps {
  onComplete: (score: number) => void;
}

// Formes avec rotation
const SHAPES = [
  { id: 'L', points: [[0, 0], [0, 1], [0, 2], [1, 2]] },
  { id: 'T', points: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { id: 'Z', points: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { id: 'S', points: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  { id: 'J', points: [[1, 0], [1, 1], [1, 2], [0, 2]] },
];

// Notes pour chaque rotation (90°, 180°, 270°)
const ROTATION_NOTES = [329.63, 392.00, 440.00, 523.25];

function rotateShape(points: number[][], times: number): number[][] {
  let rotated = [...points.map(p => [...p])];
  for (let i = 0; i < times; i++) {
    rotated = rotated.map(([x, y]) => [y, -x + 2]);
  }
  // Normaliser pour que les coordonnées soient positives
  const minX = Math.min(...rotated.map(p => p[0]));
  const minY = Math.min(...rotated.map(p => p[1]));
  return rotated.map(([x, y]) => [x - minX, y - minY]);
}

function shapesMatch(a: number[][], b: number[][]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = a.map(p => `${p[0]},${p[1]}`).sort();
  const sortedB = b.map(p => `${p[0]},${p[1]}`).sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

interface Question {
  originalShape: number[][];
  rotatedShape: number[][];
  rotationAmount: number;
  options: { rotation: number; shape: number[][] }[];
}

export default function RotationGame({ onComplete }: RotationGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const totalQuestions = 8;
  const audioRef = useRef(getGameAudio());

  const generateQuestion = useCallback((): Question => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const rotationAmount = Math.floor(Math.random() * 3) + 1; // 1, 2, ou 3 rotations (90°, 180°, 270°)
    
    const originalShape = shape.points;
    const rotatedShape = rotateShape(originalShape, rotationAmount);

    // Générer des options (une correcte + 3 fausses)
    const options: { rotation: number; shape: number[][] }[] = [];
    
    // Option correcte
    options.push({ rotation: rotationAmount, shape: rotatedShape });
    
    // Options fausses
    const wrongRotations = [1, 2, 3].filter(r => r !== rotationAmount);
    for (const r of wrongRotations) {
      options.push({ rotation: r, shape: rotateShape(originalShape, r) });
    }
    
    // Mélanger
    options.sort(() => Math.random() - 0.5);

    return { originalShape, rotatedShape, rotationAmount, options };
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

  const handleAnswer = (optionIndex: number) => {
    if (showResult || gameOver || !question) return;
    
    // Son de la rotation sélectionnée
    const selectedOption = question.options[optionIndex];
    audioRef.current.playNote(ROTATION_NOTES[selectedOption.rotation], 0.2);
    
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    
    const isCorrect = shapesMatch(selectedOption.shape, question.rotatedShape);
    
    if (isCorrect) {
      setTimeout(() => audioRef.current.playSuccess(), 150);
      setScore(prev => prev + 1);
    } else {
      setTimeout(() => audioRef.current.playError(), 150);
    }

    setTimeout(() => {
      if (currentQuestion + 1 >= totalQuestions) {
        audioRef.current.playLevelUp();
        setGameOver(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setQuestion(generateQuestion());
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 1000);
  };

  const renderShape = (points: number[][], size: number, color: string) => {
    const cellSize = size / 4;
    return (
      <div 
        className="relative"
        style={{ width: size, height: size }}
      >
        {points.map((point, i) => (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: point[0] * cellSize,
              top: point[1] * cellSize,
              width: cellSize - 2,
              height: cellSize - 2,
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    );
  };

  if (gameOver || !question) {
    const finalScore = Math.round((score / totalQuestions) * 100);
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-black/40 border border-cyan-500/30 rounded-2xl p-8"
        >
          <div className="text-5xl mb-4">🔄</div>
          <h3 className="text-2xl font-bold text-white mb-2">Test terminé!</h3>
          <div className="space-y-2 mb-4">
            <p className="text-gray-400">Réponses correctes: {score}/{totalQuestions}</p>
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
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      {/* Stats */}
      <div className="flex gap-6 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">Question</p>
          <p className="text-2xl font-bold text-white">{currentQuestion + 1}/{totalQuestions}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Score</p>
          <p className="text-2xl font-bold text-green-400">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Temps</p>
          <p className={`text-2xl font-bold ${timeLeft <= 20 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            {timeLeft}s
          </p>
        </div>
      </div>

      {/* Question */}
      <div className="bg-black/40 border border-gray-700 rounded-xl p-6 mb-6 text-center">
        <p className="text-gray-400 text-sm mb-4">
          Quelle forme obtient-on après rotation de cette figure ?
        </p>
        <div className="flex justify-center">
          {renderShape(question.originalShape, 80, '#06b6d4')}
        </div>
        <p className="text-cyan-400 text-sm mt-4">
          ↻ Rotation de {question.rotationAmount * 90}°
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = shapesMatch(option.shape, question.rotatedShape);
          
          return (
            <motion.button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              whileHover={!showResult ? { scale: 1.05 } : {}}
              whileTap={!showResult ? { scale: 0.95 } : {}}
              className={`p-4 rounded-xl transition-all flex items-center justify-center ${
                showResult
                  ? isCorrect
                    ? 'bg-green-500/30 border-2 border-green-500'
                    : isSelected
                    ? 'bg-red-500/30 border-2 border-red-500'
                    : 'bg-gray-800/50 border-2 border-gray-700'
                  : 'bg-gray-800/50 hover:bg-gray-700/50 border-2 border-gray-700 cursor-pointer'
              }`}
            >
              {renderShape(
                option.shape,
                60,
                showResult
                  ? isCorrect
                    ? '#22c55e'
                    : isSelected
                    ? '#ef4444'
                    : '#6b7280'
                  : '#a855f7'
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mt-6">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
