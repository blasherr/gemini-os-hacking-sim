'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface MathGameProps {
  onComplete: (score: number) => void;
}

interface Question {
  expression: string;
  answer: number;
  options: number[];
}

export default function MathGame({ onComplete }: MathGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const audioRef = useRef(getGameAudio());

  const generateQuestion = useCallback((): Question => {
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    let a: number, b: number, answer: number;
    
    switch (op) {
      case '+':
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 50) + 10;
        answer = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * 50) + 30;
        b = Math.floor(Math.random() * 30) + 1;
        answer = a - b;
        break;
      case '×':
        a = Math.floor(Math.random() * 12) + 2;
        b = Math.floor(Math.random() * 12) + 2;
        answer = a * b;
        break;
      default:
        a = 0; b = 0; answer = 0;
    }

    // Générer des options proches
    const options = new Set([answer]);
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 20) - 10;
      if (offset !== 0) {
        options.add(Math.abs(answer + offset));
      }
    }

    return {
      expression: `${a} ${op} ${b}`,
      answer,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    };
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

  const handleAnswer = (answer: number) => {
    if (showResult || gameOver || !question) return;
    
    audioRef.current.playClick();
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === question.answer;
    if (isCorrect) {
      audioRef.current.playSuccess();
      setScore(prev => prev + 1);
    } else {
      audioRef.current.playError();
    }
    setQuestionsAnswered(prev => prev + 1);

    setTimeout(() => {
      setQuestion(generateQuestion());
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentQuestion(prev => prev + 1);
    }, 500);
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
          <div className="text-5xl mb-4">➕</div>
          <h3 className="text-2xl font-bold text-white mb-2">Temps écoulé!</h3>
          <div className="space-y-2 mb-4">
            <p className="text-gray-400">Réponses correctes: {score}/{questionsAnswered}</p>
            <p className="text-gray-400">Questions répondues: {questionsAnswered}</p>
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
          <p className="text-sm text-gray-400">Questions</p>
          <p className="text-2xl font-bold text-white">{questionsAnswered}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Temps</p>
          <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            {timeLeft}s
          </p>
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 border border-gray-700 rounded-xl p-8 mb-6"
      >
        <p className="text-4xl font-mono font-bold text-white text-center">
          {question.expression} = ?
        </p>
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.answer;
          
          return (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              whileHover={!showResult ? { scale: 1.05 } : {}}
              whileTap={!showResult ? { scale: 0.95 } : {}}
              className={`px-8 py-4 rounded-xl text-2xl font-bold transition-all ${
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

      <p className="text-gray-400 text-sm mt-6">
        Répondez à un maximum de questions en 60 secondes !
      </p>
    </div>
  );
}
