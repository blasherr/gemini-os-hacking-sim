'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { PSYCHO_GAMES, GAME_CATEGORIES } from '@/data/psychoGames';
import { PsychoGame } from '@/types';

// Import des jeux
import MemoryGridGame from './psychogames/MemoryGridGame';
import SimonGame from './psychogames/SimonGame';
import CardMatchGame from './psychogames/CardMatchGame';
import PatternGame from './psychogames/PatternGame';
import MathGame from './psychogames/MathGame';
import StroopGame from './psychogames/StroopGame';
import TargetGame from './psychogames/TargetGame';
import ReactionGame from './psychogames/ReactionGame';
import TypingGame from './psychogames/TypingGame';
import MazeGame from './psychogames/MazeGame';
import RotationGame from './psychogames/RotationGame';

interface PsychoTestDesktopProps {
  onComplete?: () => void;
}

// Mapping des composants de jeux
const GAME_COMPONENTS: { [key: string]: React.ComponentType<{ onComplete: (score: number) => void }> } = {
  'memory-grid': MemoryGridGame,
  'memory-sequence': SimonGame,
  'memory-cards': CardMatchGame,
  'logic-patterns': PatternGame,
  'logic-math': MathGame,
  'attention-stroop': StroopGame,
  'attention-target': TargetGame,
  'speed-reaction': ReactionGame,
  'speed-typing': TypingGame,
  'spatial-maze': MazeGame,
  'spatial-rotation': RotationGame,
};

export default function PsychoTestDesktop({ onComplete }: PsychoTestDesktopProps) {
  const { session, completePsychoGame, logout } = useGameStore();
  const [selectedGame, setSelectedGame] = useState<PsychoGame | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Horloge temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const psychoResults = session?.psychoResults;
  const completedGames = psychoResults?.completedGames || 0;
  const scores = psychoResults?.scores || {};

  const isGameCompleted = (gameId: string) => {
    return scores[gameId]?.percentage > 0;
  };

  const handleGameComplete = async (score: number) => {
    if (selectedGame) {
      await completePsychoGame(selectedGame.id, score);
      setSelectedGame(null);
    }
  };

  const getProgressByCategory = (categoryId: string) => {
    const categoryGames = PSYCHO_GAMES.filter(g => g.category === categoryId);
    const completed = categoryGames.filter(g => isGameCompleted(g.id)).length;
    return { completed, total: categoryGames.length };
  };

  // Écran d'introduction style macOS
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex items-center justify-center p-8 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 80, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px]"
          />
        </div>

        {/* macOS style window */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="relative z-10 max-w-2xl w-full"
        >
          {/* Window chrome */}
          <div className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-lg shadow-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-lg shadow-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-lg shadow-green-500/50" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-white/50 text-sm font-medium">Tests Psychotechniques</span>
              </div>
              <div className="w-16" />
            </div>

            {/* Content */}
            <div className="p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 p-[2px] shadow-2xl shadow-purple-500/30"
              >
                <div className="w-full h-full rounded-3xl bg-[#1a1a2e] flex items-center justify-center">
                  <span className="text-5xl">🧠</span>
                </div>
              </motion.div>

              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Évaluation Cognitive
              </h1>
              <p className="text-white/40 text-lg mb-8">
                Formation MDT - Module Psychotechnique
              </p>

              {/* Category preview */}
              <div className="flex justify-center gap-3 mb-8">
                {GAME_CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-default"
                    title={cat.name}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                  </motion.div>
                ))}
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3 mb-8 text-left">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-cyan-400">📋</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">11 Épreuves</p>
                      <p className="text-white/40 text-sm">5 catégories</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400">⏱️</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">~15 minutes</p>
                      <p className="text-white/40 text-sm">Temps estimé</p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => setShowIntro(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
              >
                Démarrer l&apos;évaluation
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Écran de jeu actif - style macOS window
  if (selectedGame) {
    const GameComponent = GAME_COMPONENTS[selectedGame.id];
    
    if (!GameComponent) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex items-center justify-center">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
            <p className="text-white text-xl mb-4">Jeu en cours de développement</p>
            <button
              onClick={() => setSelectedGame(null)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6">
        {/* Game window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-4xl mx-auto backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/5">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGame(null)}
                className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors"
                title="Fermer"
              />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 text-center flex items-center justify-center gap-3">
              <span className="text-2xl">{selectedGame.icon}</span>
              <span className="text-white/70 font-medium">{selectedGame.name}</span>
            </div>
            <div className="text-white/40 text-sm">
              {selectedGame.timeLimit && `⏱️ ${selectedGame.timeLimit}s`}
            </div>
          </div>

          {/* Game content */}
          <div className="p-6">
            <GameComponent onComplete={handleGameComplete} />
          </div>
        </motion.div>
      </div>
    );
  }

  // Menu principal style macOS
  return (
    <div className="h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px]" />
      </div>

      {/* macOS Menu Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <span className="text-xl">🧠</span>
            <span className="text-white/70 text-sm font-medium">Tests Psychotechniques</span>
            <span className="text-white/30 text-sm">Agent: {session?.username}</span>
          </div>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <span>{currentTime.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            <span className="font-medium">{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            
            {/* Logout button */}
            <div className="relative ml-2">
              <motion.button
                onClick={() => setShowLogoutConfirm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Se déconnecter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </motion.button>

              {/* Confirmation popup */}
              <AnimatePresence>
                {showLogoutConfirm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl z-50 min-w-[220px]"
                  >
                    <p className="text-white text-sm mb-3">Se déconnecter ?</p>
                    <p className="text-gray-400 text-xs mb-4">Votre progression est sauvegardée automatiquement.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 px-3 py-2 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={logout}
                        className="flex-1 px-3 py-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header with stats */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Tableau de bord
            </h1>
            <p className="text-white/40">Complétez les 11 épreuves pour obtenir votre certification</p>
          </div>

          {/* Stats cards */}
          <div className="flex gap-3">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 px-6 py-4 min-w-[140px]">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Progression</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-cyan-400">{completedGames}</span>
                <span className="text-white/30">/11</span>
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 px-6 py-4 min-w-[140px]">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Score moyen</p>
              <span className="text-3xl font-bold text-purple-400">
                {psychoResults?.averageScore?.toFixed(0) || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedGames / 11) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Categories - macOS style segmented control */}
        <div className="flex items-center gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl w-fit backdrop-blur-xl border border-white/5">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            Tous
          </button>
          {GAME_CATEGORIES.map(category => {
            const progress = getProgressByCategory(category.id);
            const isSelected = selectedCategory === category.id;
            const isComplete = progress.completed === progress.total;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {isComplete && <span className="text-green-400">✓</span>}
                <span className="text-white/30 text-xs">{progress.completed}/{progress.total}</span>
              </button>
            );
          })}
        </div>

        {/* Games grid - macOS app style */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory || 'all'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {PSYCHO_GAMES
              .filter(game => !selectedCategory || game.category === selectedCategory)
              .sort((a, b) => {
                const order: {[key: string]: number} = { easy: 1, medium: 2, hard: 3 };
                return (order[a.difficulty] || 2) - (order[b.difficulty] || 2);
              })
              .map((game, index) => {
                const completed = isGameCompleted(game.id);
                const score = scores[game.id];
                const category = GAME_CATEGORIES.find(c => c.id === game.category);

                return (
                  <motion.button
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => !completed && setSelectedGame(game)}
                    disabled={completed}
                    className={`group relative backdrop-blur-xl rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
                      completed
                        ? 'bg-green-500/5 border-green-500/20 cursor-default'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer hover:-translate-y-1'
                    }`}
                  >
                    {/* Hover gradient effect */}
                    {!completed && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
                    )}

                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-lg">
                          {game.icon}
                        </div>
                        {completed && (
                          <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full">
                            <span className="text-green-400 text-sm font-medium">{score?.percentage}%</span>
                            <span className="text-green-400">✓</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-white mb-1">{game.name}</h3>
                      <p className="text-white/40 text-sm mb-4 line-clamp-2">{game.description}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs px-2.5 py-1 rounded-lg font-medium"
                            style={{ 
                              backgroundColor: `${category?.color}15`,
                              color: category?.color 
                            }}
                          >
                            {category?.name}
                          </span>
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                            game.difficulty === 'easy' 
                              ? 'bg-green-500/15 text-green-400' 
                              : game.difficulty === 'medium'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}>
                            {game.difficulty === 'easy' ? 'Facile' : game.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                          </span>
                        </div>
                        {game.timeLimit && (
                          <span className="text-white/30 text-xs flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {game.timeLimit}s
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
          </motion.div>
        </AnimatePresence>

        {/* Completion modal */}
        <AnimatePresence>
          {completedGames >= 11 && session?.successCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-6"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-10 text-center max-w-md w-full shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30"
                >
                  <span className="text-5xl">🏆</span>
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-2">Félicitations!</h2>
                <p className="text-white/50 mb-8">
                  Vous avez complété tous les tests psychotechniques
                </p>

                <div className="bg-black/30 rounded-2xl p-6 mb-6 border border-white/5">
                  <p className="text-white/40 text-sm mb-2">Votre code de certification</p>
                  <p className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {session.successCode}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Score moyen</p>
                    <p className="text-2xl font-bold text-white">
                      {psychoResults?.averageScore?.toFixed(0)}%
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Épreuves</p>
                    <p className="text-2xl font-bold text-green-400">11/11</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
