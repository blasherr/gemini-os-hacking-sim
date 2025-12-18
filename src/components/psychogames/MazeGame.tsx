'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface MazeGameProps {
  onComplete: (score: number) => void;
}

// Directions
const DIRS = [
  { dx: 0, dy: -1 }, // Haut
  { dx: 1, dy: 0 },  // Droite
  { dx: 0, dy: 1 },  // Bas
  { dx: -1, dy: 0 }, // Gauche
];

export default function MazeGame({ onComplete }: MazeGameProps) {
  const [maze, setMaze] = useState<number[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [exitPos, setExitPos] = useState({ x: 0, y: 0 });
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelsCompleted, setLevelsCompleted] = useState(0);
  const audioRef = useRef(getGameAudio());

  const generateMaze = useCallback((size: number) => {
    // Créer une grille de murs
    const grid = Array(size).fill(null).map(() => Array(size).fill(1));
    
    // Algorithme de génération de labyrinthe simplifié
    const stack: { x: number; y: number }[] = [];
    const start = { x: 1, y: 1 };
    grid[start.y][start.x] = 0;
    stack.push(start);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors: { x: number; y: number }[] = [];

      for (const dir of DIRS) {
        const nx = current.x + dir.dx * 2;
        const ny = current.y + dir.dy * 2;
        if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && grid[ny][nx] === 1) {
          neighbors.push({ x: nx, y: ny });
        }
      }

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        grid[next.y][next.x] = 0;
        grid[current.y + (next.y - current.y) / 2][current.x + (next.x - current.x) / 2] = 0;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    // Créer des passages supplémentaires pour rendre le labyrinthe plus intéressant
    for (let i = 0; i < size / 3; i++) {
      const x = Math.floor(Math.random() * (size - 2)) + 1;
      const y = Math.floor(Math.random() * (size - 2)) + 1;
      if (Math.random() > 0.5) {
        grid[y][x] = 0;
      }
    }

    // Position de sortie
    const exit = { x: size - 2, y: size - 2 };
    grid[exit.y][exit.x] = 0;
    
    // S'assurer qu'il y a un chemin vers la sortie
    grid[exit.y - 1][exit.x] = 0;
    grid[exit.y][exit.x - 1] = 0;

    return { grid, exit };
  }, []);

  useEffect(() => {
    const size = 9 + level * 2; // Taille augmente avec le niveau
    const { grid, exit } = generateMaze(size);
    setMaze(grid);
    setExitPos(exit);
    setPlayerPos({ x: 1, y: 1 });
    // Son de début de niveau
    audioRef.current.playNote(523.25, 0.15);
  }, [level, generateMaze]);

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

    const handleKeyDown = (e: KeyboardEvent) => {
      let dx = 0, dy = 0;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          dy = -1;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          dy = 1;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          dx = -1;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          dx = 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      
      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      if (maze[newY]?.[newX] === 0) {
        setPlayerPos({ x: newX, y: newY });
        setMoves(prev => prev + 1);
        // Son de pas
        audioRef.current.playTick();

        // Vérifier si on a atteint la sortie
        if (newX === exitPos.x && newY === exitPos.y) {
          audioRef.current.playLevelUp();
          setLevelsCompleted(prev => prev + 1);
          if (level < 3) {
            setLevel(prev => prev + 1);
            setMoves(0);
          } else {
            setGameOver(true);
          }
        }
      } else {
        // Collision avec mur
        audioRef.current.playNote(150, 0.05, 'triangle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, maze, exitPos, level, gameOver]);

  if (gameOver) {
    const timeBonus = Math.round((timeLeft / 60) * 30);
    const levelBonus = levelsCompleted * 25;
    const finalScore = Math.min(timeBonus + levelBonus, 100);
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {levelsCompleted >= 3 ? 'Parfait!' : 'Test terminé!'}
          </h3>
          <div className="space-y-2 mb-4">
            <p className="text-gray-400">Niveaux complétés: {levelsCompleted}/3</p>
            <p className="text-gray-400">Temps restant: {timeLeft}s</p>
            <p className="text-gray-400">Déplacements: {moves}</p>
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

  const cellSize = Math.min(300 / maze.length, 25);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      {/* Stats */}
      <div className="flex gap-6 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">Niveau</p>
          <p className="text-2xl font-bold text-white">{level}/3</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Temps</p>
          <p className={`text-2xl font-bold ${timeLeft <= 15 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            {timeLeft}s
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Mouvements</p>
          <p className="text-2xl font-bold text-purple-400">{moves}</p>
        </div>
      </div>

      {/* Labyrinthe */}
      <div 
        className="border-2 border-cyan-500/50 rounded-lg overflow-hidden bg-black/60"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${maze.length}, ${cellSize}px)`,
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y;
            const isExit = exitPos.x === x && exitPos.y === y;
            
            return (
              <div
                key={`${x}-${y}`}
                className={`transition-colors ${
                  cell === 1 ? 'bg-gray-800' :
                  isPlayer ? 'bg-cyan-500' :
                  isExit ? 'bg-green-500' : 'bg-black/40'
                }`}
                style={{ width: cellSize, height: cellSize }}
              >
                {isPlayer && (
                  <motion.div
                    className="w-full h-full bg-cyan-400 rounded-full flex items-center justify-center text-xs"
                    layoutId="player"
                  >
                    🏃
                  </motion.div>
                )}
                {isExit && !isPlayer && (
                  <div className="w-full h-full flex items-center justify-center text-xs animate-pulse">
                    🚪
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Contrôles */}
      <div className="mt-4 text-gray-400 text-sm">
        Utilisez les flèches ou WASD pour vous déplacer
      </div>

      {/* Contrôles tactiles */}
      <div className="mt-4 grid grid-cols-3 gap-1">
        <div />
        <button
          onClick={() => {
            const e = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            window.dispatchEvent(e);
          }}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => {
            const e = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            window.dispatchEvent(e);
          }}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
        >
          ←
        </button>
        <button
          onClick={() => {
            const e = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            window.dispatchEvent(e);
          }}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
        >
          ↓
        </button>
        <button
          onClick={() => {
            const e = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            window.dispatchEvent(e);
          }}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
        >
          →
        </button>
      </div>
    </div>
  );
}
