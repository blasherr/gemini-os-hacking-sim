'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface PatternGameProps {
  onComplete: (score: number) => void;
}

interface Question {
  sequence: number[];
  answer: number;
  options: number[];
}

export default function PatternGame({ onComplete }: PatternGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const audioRef = useRef(getGameAudio());

  const generateQuestion = useCallback((): Question => {
    const patterns = [
      // Addition simple
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 1;
        const seq = Array(5).fill(0).map((_, i) => start + i * step);
        return { sequence: seq, answer: seq[4] + step };
      },
      // Multiplication
      () => {
        const start = Math.floor(Math.random() * 3) + 2;
        const mult = Math.floor(Math.random() * 2) + 2;
        const seq = Array(4).fill(0).map((_, i) => start * Math.pow(mult, i));
        return { sequence: seq, answer: seq[3] * mult };
      },
      // Alternance
      () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const seq = [a, b, a + 2, b + 2, a + 4];
        return { sequence: seq, answer: b + 4 };
      },
      // Fibonacci-like
      () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const seq = [a, b];
        for (let i = 0; i < 3; i++) {
          seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
        }
        return { sequence: seq, answer: seq[seq.length - 1] + seq[seq.length - 2] };
      },
      // Carré
      () => {
        const start = Math.floor(Math.random() * 3) + 1;
        const seq = Array(4).fill(0).map((_, i) => (start + i) * (start + i));
        return { sequence: seq, answer: (start + 4) * (start + 4) };
      },
    ];

    const patternFn = patterns[Math.floor(Math.random() * patterns.length)];
    const { sequence, answer } = patternFn();
    
    // Générer des options (incluant la bonne réponse)
    const options = new Set([answer]);
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      if (offset !== 0) {
        options.add(answer + offset);
      }
    }
    
    return {
      sequence,
      answer,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    };
  }, []);

  useEffect(() => {
    // Générer 10 questions
    const qs = Array(10).fill(null).map(() => generateQuestion());
    setQuestions(qs);
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

  const handleAnswer = (answer: number) => {
    if (showResult || gameOver) return;
    
    // Son de clic
    audioRef.current.playClick();
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion]?.answer;
    if (isCorrect) {
      audioRef.current.playSuccess();
      setScore(prev => prev + 1);
    } else {
      audioRef.current.playError();
    }

    setTimeout(() => {
      if (currentQuestion >= 9) {
        setGameOver(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        // Son de nouvelle question
        audioRef.current.playNote(523.25, 0.1);
      }
    }, 1000);
  };

  if (gameOver || questions.length === 0) {
    const finalScore = Math.round((score / 10) * 100);
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="text-5xl mb-4">🔢</div>
          <h3 className="text-2xl font-bold text-white mb-2">Test terminé!</h3>
          <p className="text-gray-400 mb-4">Réponses correctes: {score}/10</p>
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

  const q = questions[currentQuestion];
  if (!q) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      {/* Stats */}
      <div className="flex gap-6 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-400">Question</p>
          <p className="text-2xl font-bold text-white">{currentQuestion + 1}/10</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Score</p>
          <p className="text-2xl font-bold text-green-400">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Temps</p>
          <p className={`text-2xl font-bold ${timeLeft <= 20 ? 'text-red-400' : 'text-cyan-400'}`}>
            {timeLeft}s
          </p>
        </div>
      </div>

      {/* Question */}
      <div className="bg-black/40 border border-gray-700 rounded-xl p-6 mb-6">
        <p className="text-gray-400 text-sm mb-3">Trouvez le nombre suivant :</p>
        <div className="flex items-center gap-3 text-2xl font-mono">
          {q.sequence.map((num, i) => (
            <span key={i} className="text-white">{num}</span>
          ))}
          <span className="text-cyan-400 animate-pulse">?</span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === q.answer;
          
          return (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              whileHover={!showResult ? { scale: 1.05 } : {}}
              whileTap={!showResult ? { scale: 0.95 } : {}}
              className={`px-8 py-4 rounded-xl text-xl font-bold transition-all ${
                showResult
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : isSelected
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                  : 'bg-gray-700 hover:bg-gray-600 text-white cursor-pointer'
              }`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mt-6">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
