'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface MemoryGridGameProps {
  onComplete: (score: number) => void;
}

const MAX_LEVEL = 10;

// Grille qui augmente avec les niveaux
const getGridSize = (level: number): number => {
  if (level <= 2) return 3;  // 3x3
  if (level <= 4) return 4;  // 4x4
  if (level <= 6) return 5;  // 5x5
  if (level <= 8) return 6;  // 6x6
  return 7;                  // 7x7
};

// Nombre de cases à mémoriser selon le niveau
const getCellsToLight = (level: number, gridSize: number): number => {
  const totalCells = gridSize * gridSize;
  const baseRatio = 0.25 + (level * 0.03);
  return Math.min(Math.floor(totalCells * baseRatio) + level, Math.floor(totalCells * 0.6));
};

export default function MemoryGridGame({ onComplete }: MemoryGridGameProps) {
  const [phase, setPhase] = useState<'ready' | 'memorize' | 'recall' | 'feedback' | 'result'>('ready');
  const [pattern, setPattern] = useState<boolean[]>([]);
  const [userPattern, setUserPattern] = useState<boolean[]>([]);
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [showPattern, setShowPattern] = useState(true);
  const [gridSize, setGridSize] = useState(3);
  const [feedback, setFeedback] = useState<'success' | 'fail' | null>(null);
  const [memorizeTime, setMemorizeTime] = useState(3);
  const audioRef = useRef(getGameAudio());

  // Générer un pattern aléatoire
  const generatePattern = useCallback((size: number, lvl: number) => {
    const totalCells = size * size;
    const cellsToLight = getCellsToLight(lvl, size);
    const newPattern = Array(totalCells).fill(false);
    
    // Mélanger les indices
    const indices = Array.from({ length: totalCells }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Allumer les premières cases
    for (let i = 0; i < cellsToLight; i++) {
      newPattern[indices[i]] = true;
    }
    
    return newPattern;
  }, []);

  // Démarrer un niveau
  const startLevel = useCallback(() => {
    const newGridSize = getGridSize(level);
    setGridSize(newGridSize);
    
    const newPattern = generatePattern(newGridSize, level);
    setPattern(newPattern);
    setUserPattern(Array(newGridSize * newGridSize).fill(false));
    
    setShowPattern(true);
    setPhase('memorize');
    setFeedback(null);
    
    // Son de démarrage
    audioRef.current.playNote(523.25, 0.2);
    
    // Temps de mémorisation: diminue avec les niveaux
    const time = Math.max(4 - Math.floor(level / 3), 1.5);
    setMemorizeTime(time);
    
    const timer = setTimeout(() => {
      setShowPattern(false);
      setPhase('recall');
      audioRef.current.playNote(440, 0.15);
    }, time * 1000);

    return () => clearTimeout(timer);
  }, [level, generatePattern]);

  // Premier démarrage
  useEffect(() => {
    const timer = setTimeout(() => {
      startLevel();
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clic sur une case
  const handleCellClick = (index: number) => {
    if (phase !== 'recall') return;
    
    audioRef.current.playTick();
    
    const newUserPattern = [...userPattern];
    newUserPattern[index] = !newUserPattern[index];
    setUserPattern(newUserPattern);
  };

  // Valider le pattern
  const handleSubmit = () => {
    let correct = 0;
    let total = 0;
    
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i]) total++;
      if (pattern[i] === userPattern[i]) {
        if (pattern[i]) correct++;
      }
    }
    
    // Calculer les faux positifs
    let falsePositives = 0;
    for (let i = 0; i < userPattern.length; i++) {
      if (userPattern[i] && !pattern[i]) falsePositives++;
    }
    
    const accuracy = Math.max(0, ((correct - falsePositives * 0.5) / total) * 100);
    const levelScore = Math.round(accuracy);
    
    setPhase('feedback');
    
    if (accuracy >= 70) {
      // Niveau réussi !
      setFeedback('success');
      audioRef.current.playLevelUp();
      setTotalScore(prev => prev + levelScore);
      
      if (level >= MAX_LEVEL) {
        // Jeu terminé avec succès
        setTimeout(() => {
          setPhase('result');
        }, 1500);
      } else {
        // Niveau suivant
        setTimeout(() => {
          setLevel(prev => prev + 1);
          startLevel();
        }, 1500);
      }
    } else {
      // Échec - Fin du jeu
      setFeedback('fail');
      audioRef.current.playError();
      setTimeout(() => {
        setPhase('result');
      }, 1500);
    }
  };

  // Écran de résultat
  if (phase === 'result') {
    // Calcul plus juste : on ne compte que les niveaux complétés pour la moyenne
    const completedLevels = feedback === 'success' ? level : level - 1;
    const effectiveLevels = Math.max(1, completedLevels);
    const averageScore = Math.round(totalScore / effectiveLevels);
    const finalScore = Math.min(averageScore + (completedLevels * 5), 100);
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-sm"
        >
          <div className="text-5xl mb-4">{level >= MAX_LEVEL ? '🏆' : '🧠'}</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {level >= MAX_LEVEL ? 'Parfait!' : 'Test terminé!'}
          </h3>
          <p className="text-gray-400 mb-2">Niveau atteint: {level}/{MAX_LEVEL}</p>
          <p className="text-gray-400 mb-4">Grille finale: {gridSize}×{gridSize}</p>
          
          {/* Progression visuelle */}
          <div className="flex gap-1 justify-center mb-4">
            {Array.from({ length: MAX_LEVEL }).map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-sm ${
                  i < level ? 'bg-gradient-to-br from-cyan-500 to-purple-500' : 'bg-gray-700'
                }`} 
              />
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
      <div className="flex gap-4 mb-4">
        <div className="text-center bg-white/5 rounded-xl px-4 py-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Niveau</p>
          <p className="text-2xl font-bold text-white">{level}<span className="text-sm text-gray-500">/{MAX_LEVEL}</span></p>
        </div>
        <div className="text-center bg-white/5 rounded-xl px-4 py-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Grille</p>
          <p className="text-2xl font-bold text-purple-400">{gridSize}×{gridSize}</p>
        </div>
        <div className="text-center bg-white/5 rounded-xl px-4 py-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Score</p>
          <p className="text-2xl font-bold text-amber-400">{totalScore}</p>
        </div>
      </div>

      {/* Phase indicator */}
      <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
        phase === 'memorize' ? 'bg-amber-500/20 text-amber-400' :
        phase === 'recall' ? 'bg-cyan-500/20 text-cyan-400' :
        feedback === 'success' ? 'bg-green-500/20 text-green-400' :
        feedback === 'fail' ? 'bg-red-500/20 text-red-400' :
        'bg-gray-500/20 text-gray-400'
      }`}>
        {phase === 'memorize' && `👁️ Mémorisez ! (${memorizeTime}s)`}
        {phase === 'recall' && '🎯 Reproduisez le pattern !'}
        {phase === 'feedback' && feedback === 'success' && '✨ Bravo ! Niveau suivant...'}
        {phase === 'feedback' && feedback === 'fail' && '❌ Raté ! Fin du test.'}
        {phase === 'ready' && '⏳ Préparez-vous...'}
      </div>

      {/* Grille */}
      <motion.div 
        className="grid gap-1.5 mb-6 p-3 bg-white/5 rounded-2xl"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        key={level}
      >
        {(phase === 'memorize' && showPattern ? pattern : userPattern).map((active, index) => {
          // Pour le feedback, montrer ce qui était correct ou pas
          const isCorrect = phase === 'feedback' && pattern[index] && userPattern[index];
          const isMissed = phase === 'feedback' && pattern[index] && !userPattern[index];
          const isWrong = phase === 'feedback' && !pattern[index] && userPattern[index];
          
          return (
            <motion.button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={phase !== 'recall'}
              whileHover={phase === 'recall' ? { scale: 1.1 } : {}}
              whileTap={phase === 'recall' ? { scale: 0.9 } : {}}
              className={`rounded-lg transition-all ${
                // Taille adaptative selon la grille
                gridSize <= 4 ? 'w-14 h-14' : 
                gridSize <= 5 ? 'w-12 h-12' : 
                gridSize <= 6 ? 'w-10 h-10' : 'w-8 h-8'
              } ${
                phase === 'memorize' && active
                  ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/50'
                  : phase === 'recall' && userPattern[index]
                  ? 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/50'
                  : phase === 'feedback' && isCorrect
                  ? 'bg-green-500 shadow-lg shadow-green-500/50'
                  : phase === 'feedback' && isMissed
                  ? 'bg-amber-500/50 border-2 border-amber-500 border-dashed'
                  : phase === 'feedback' && isWrong
                  ? 'bg-red-500/50'
                  : 'bg-gray-700/50 hover:bg-gray-600/50'
              } ${phase === 'recall' ? 'cursor-pointer' : ''}`}
            />
          );
        })}
      </motion.div>

      {/* Bouton de validation */}
      {phase === 'recall' && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
        >
          ✓ Valider
        </motion.button>
      )}

      {/* Légende */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        {phase === 'memorize' && 'Les cases cyan sont à mémoriser'}
        {phase === 'recall' && 'Cliquez sur les cases pour les sélectionner'}
        {phase === 'feedback' && '🟢 Correct | 🟡 Manqué | 🔴 Erreur'}
      </div>
    </div>
  );
}
