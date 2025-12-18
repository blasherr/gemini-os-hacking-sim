'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MemorySequenceGameProps {
  onComplete: () => void;
}

// Jeu de mémoire - reproduire la séquence affichée
export default function MemorySequenceGame({ onComplete }: MemorySequenceGameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'ready' | 'showing' | 'input' | 'win' | 'lose'>('ready');
  const [message, setMessage] = useState('Prêt à mémoriser ?');
  
  const maxLevel = 5;
  const gridSize = 9; // 3x3 grid

  const generateSequence = useCallback((length: number) => {
    const newSequence: number[] = [];
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * gridSize));
    }
    return newSequence;
  }, []);

  const startLevel = useCallback(() => {
    const newSequence = generateSequence(level + 2); // Commence avec 3 éléments
    setSequence(newSequence);
    setPlayerInput([]);
    setShowSequence(true);
    setGameState('showing');
    setMessage(`Niveau ${level}/${maxLevel} - Mémorisez la séquence...`);

    // Afficher la séquence
    newSequence.forEach((item, index) => {
      setTimeout(() => {
        setCurrentHighlight(item);
        setTimeout(() => setCurrentHighlight(null), 400);
      }, index * 600);
    });

    // Passer en mode input après l'affichage
    setTimeout(() => {
      setShowSequence(false);
      setGameState('input');
      setMessage('À votre tour ! Reproduisez la séquence');
    }, newSequence.length * 600 + 500);
  }, [level, generateSequence]);

  const handleCellClick = (index: number) => {
    if (gameState !== 'input') return;

    const newInput = [...playerInput, index];
    setPlayerInput(newInput);
    setCurrentHighlight(index);
    setTimeout(() => setCurrentHighlight(null), 200);

    // Vérifier si la séquence est correcte
    for (let i = 0; i < newInput.length; i++) {
      if (newInput[i] !== sequence[i]) {
        setGameState('lose');
        setMessage('❌ Séquence incorrecte !');
        return;
      }
    }

    // Vérifier si la séquence est complète
    if (newInput.length === sequence.length) {
      if (level >= maxLevel) {
        setGameState('win');
        setMessage('🎉 Accès autorisé !');
        setTimeout(onComplete, 1500);
      } else {
        setMessage('✅ Correct ! Niveau suivant...');
        setTimeout(() => {
          setLevel(prev => prev + 1);
          setGameState('ready');
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setLevel(1);
    setSequence([]);
    setPlayerInput([]);
    setGameState('ready');
    setMessage('Prêt à mémoriser ?');
  };

  useEffect(() => {
    if (gameState === 'ready' && level > 0) {
      const timer = setTimeout(startLevel, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, level, startLevel]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black p-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-hacker-primary mb-2" style={{ fontFamily: 'Orbitron' }}>
          🧠 SÉQUENCE MÉMOIRE
        </h2>
        <p className="text-gray-400 text-sm">
          {message}
        </p>
      </div>

      {/* Indicateur de niveau */}
      <div className="flex gap-2 mb-6">
        {[...Array(maxLevel)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-2 rounded-full ${
              i < level ? 'bg-hacker-primary' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Grille 3x3 */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-900/50 rounded-lg border border-hacker-primary/30">
        {[...Array(gridSize)].map((_, index) => (
          <motion.button
            key={index}
            whileHover={gameState === 'input' ? { scale: 1.05 } : {}}
            whileTap={gameState === 'input' ? { scale: 0.95 } : {}}
            onClick={() => handleCellClick(index)}
            disabled={gameState !== 'input'}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 transition-all duration-200 ${
              currentHighlight === index
                ? 'bg-hacker-primary border-hacker-primary shadow-lg shadow-hacker-primary/50'
                : gameState === 'input'
                ? 'bg-gray-800 border-gray-600 hover:border-hacker-primary/50 cursor-pointer'
                : 'bg-gray-800 border-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Progression de la saisie */}
      {gameState === 'input' && (
        <div className="mt-4 flex gap-1">
          {sequence.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < playerInput.length ? 'bg-hacker-primary' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      )}

      {/* États de fin */}
      <AnimatePresence>
        {(gameState === 'win' || gameState === 'lose') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            {gameState === 'win' ? (
              <div className="text-hacker-primary">
                <p className="text-2xl font-bold">✅ ACCÈS AUTORISÉ</p>
                <p className="text-sm text-gray-400 mt-2">Mémoire validée</p>
              </div>
            ) : (
              <div>
                <p className="text-red-500 text-2xl font-bold">❌ ACCÈS REFUSÉ</p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-6 py-2 bg-hacker-primary text-black rounded hover:bg-hacker-primary/80 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
