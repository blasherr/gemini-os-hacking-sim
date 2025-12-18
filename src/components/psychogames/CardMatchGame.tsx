'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface CardMatchGameProps {
  onComplete: (score: number) => void;
}

const EMOJIS = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎹', '🎸'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function CardMatchGame({ onComplete }: CardMatchGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const audioRef = useRef(getGameAudio());

  useEffect(() => {
    // Créer les paires de cartes
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
  }, []);

  useEffect(() => {
    if (gameOver || matches === 8) return;
    
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
  }, [gameOver, matches]);

  useEffect(() => {
    if (matches === 8) {
      // Toutes les paires trouvées
      audioRef.current.playLevelUp();
      const timer = setTimeout(() => setGameOver(true), 500);
      return () => clearTimeout(timer);
    }
  }, [matches]);

  const handleCardClick = (cardId: number) => {
    if (gameOver) return;
    if (flippedCards.length >= 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    // Son de flip de carte (note musicale)
    const noteIndex = cardId % 8;
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    audioRef.current.playNote(notes[noteIndex], 0.15);

    const newCards = cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        // Match! - Son de succès
        setTimeout(() => {
          audioRef.current.playSuccess();
          setCards(prev =>
            prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // Pas de match - Son d'erreur
        setTimeout(() => {
          audioRef.current.playError();
          setCards(prev =>
            prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (gameOver) {
    // Calculer le score basé sur: paires trouvées, temps restant, nombre de coups
    const pairScore = (matches / 8) * 50;
    const timeScore = (timeLeft / 90) * 30;
    const moveScore = Math.max(0, (1 - moves / 40)) * 20;
    const finalScore = Math.round(pairScore + timeScore + moveScore);

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="text-5xl mb-4">🃏</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {matches === 8 ? 'Parfait!' : 'Temps écoulé!'}
          </h3>
          <div className="space-y-2 mb-4">
            <p className="text-gray-400">Paires trouvées: {matches}/8</p>
            <p className="text-gray-400">Coups: {moves}</p>
            <p className="text-gray-400">Temps restant: {timeLeft}s</p>
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
          <p className="text-sm text-gray-400">Paires</p>
          <p className="text-2xl font-bold text-green-400">{matches}/8</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Coups</p>
          <p className="text-2xl font-bold text-white">{moves}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Temps</p>
          <p className={`text-2xl font-bold ${timeLeft <= 15 ? 'text-red-400' : 'text-cyan-400'}`}>
            {timeLeft}s
          </p>
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-4 gap-3">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 rounded-xl text-2xl font-bold transition-all duration-300 ${
                card.isMatched
                  ? 'bg-green-500/30 border-2 border-green-500'
                  : card.isFlipped
                  ? 'bg-purple-500 shadow-lg shadow-purple-500/50'
                  : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
              }`}
              style={{
                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-gray-400 text-sm mt-6">
        Trouvez toutes les paires avant la fin du temps !
      </p>
    </div>
  );
}
