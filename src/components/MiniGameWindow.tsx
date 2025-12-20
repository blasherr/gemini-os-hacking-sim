'use client';

import { useState } from 'react';
import Window from './Window';
import PasswordCrackGame from './minigames/PasswordCrackGame';
import CipherDecodeGame from './minigames/CipherDecodeGame';
import BinaryPuzzleGame from './minigames/BinaryPuzzleGame';
import PortScanGame from './minigames/PortScanGame';
import PortForwardGame from './minigames/PortForwardGame';
import StreamInterceptGame from './minigames/StreamInterceptGame';
import MemorySequenceGame from './minigames/MemorySequenceGame';
import { useGameStore } from '@/store/gameStore';
import { PSYCHO_GAMES, GAME_CATEGORIES } from '@/data/psychoGames';

interface MiniGameWindowProps {
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
}

export default function MiniGameWindow({ onClose, isActive, onFocus }: MiniGameWindowProps) {
  const { currentObjective, completeObjective, session } = useGameStore();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Determine which minigame to show based on current objective
  const getCurrentGame = () => {
    if (selectedGame) return selectedGame;
    
    if (currentObjective) {
      // Objectif 7: Déchiffrer un message Caesar
      if (currentObjective.id === 7) return 'cipher';
      // Objectif 8: Puzzle binaire
      if (currentObjective.id === 8) return 'binary';
      // Objectif 9: Password cracker
      if (currentObjective.id === 9) return 'password';
    }
    
    return null;
  };

  const handleGameComplete = (gameType: string) => {
    // Compléter l'objectif correspondant selon objectives.ts
    const objectiveMap: { [key: string]: number } = {
      'cipher': 7,      // Objectif 7: Déchiffrer un message (Caesar)
      'binary': 8,      // Objectif 8: Puzzle binaire
      'password': 9,    // Objectif 9: Cracker un mot de passe
      'portscan': 10,   // Objectif 10: Scanner les ports (si utilisé)
      'portforward': 0, // Non utilisé dans le scénario actuel
      'stream': 0,      // Non utilisé dans le scénario actuel
      'memory': 0       // Non utilisé dans le scénario actuel
    };
    
    const objectiveId = objectiveMap[gameType];
    if (objectiveId && objectiveId > 0) {
      completeObjective(objectiveId);
    }
  };

  const currentGame = getCurrentGame();
  const isPsychotest = session?.sessionType === 'psychotest';

  return (
    <Window
      title={isPsychotest ? "Tests Psychotechniques" : "Hacking Tools"}
      onClose={onClose}
      isActive={isActive}
      onFocus={onFocus}
      initialPosition={{ x: 400, y: 100 }}
      initialSize={{ width: 600, height: 600 }}
    >
      <div className="h-[500px] overflow-y-auto p-6 pb-20 pr-2 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-white/5">
        {!currentGame ? (
          isPsychotest ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Tests Psychotechniques</h2>
              {GAME_CATEGORIES.map(category => (
                <div key={category.id} className="mb-6">
                  <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                    <span>{category.icon}</span> {category.name}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {PSYCHO_GAMES.filter(g => g.category === category.id)
                      .sort((a, b) => {
                        const order: {[key: string]: number} = { easy: 1, medium: 2, hard: 3 };
                        return (order[a.difficulty] || 2) - (order[b.difficulty] || 2);
                      })
                      .map(game => (
                      <button
                        key={game.id}
                        onClick={() => setSelectedGame(game.id)}
                        className="w-full p-3 bg-gray-900/50 hover:bg-cyan-500/10 border border-gray-800 hover:border-cyan-500/50 rounded-xl text-left transition-all group"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
                            {game.name}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${
                            game.difficulty === 'easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                            game.difficulty === 'medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                            'border-red-500/30 text-red-400 bg-red-500/10'
                          }`}>{game.difficulty}</span>
                        </div>
                        <p className="text-xs text-gray-500">{game.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-hacker-primary mb-4">Available Hacking Tools</h2>
            
            <button
              onClick={() => setSelectedGame('password')}
              className="w-full p-4 bg-macos-topbar hover:bg-macos-accent/20 rounded-xl text-left transition-colors border border-macos-text-secondary/20"
            >
              <h3 className="font-semibold mb-1">🔓 Password Cracker</h3>
              <p className="text-sm text-macos-text-secondary">
                Brute force password hashes using dictionary attacks
              </p>
            </button>

            <button
              onClick={() => setSelectedGame('cipher')}
              className="w-full p-4 bg-macos-topbar hover:bg-macos-accent/20 rounded-xl text-left transition-colors border border-macos-text-secondary/20"
            >
              <h3 className="font-semibold mb-1">🔐 Cipher Decoder</h3>
              <p className="text-sm text-macos-text-secondary">
                Decode encrypted messages using various ciphers
              </p>
            </button>

            <button
              onClick={() => setSelectedGame('binary')}
              className="w-full p-4 bg-macos-topbar hover:bg-macos-accent/20 rounded-xl text-left transition-colors border border-macos-text-secondary/20"
            >
              <h3 className="font-semibold mb-1">💾 Binary Puzzle</h3>
              <p className="text-sm text-macos-text-secondary">
                Convert binary sequences to unlock secure vaults
              </p>
            </button>

            <button
              onClick={() => setSelectedGame('portscan')}
              className="w-full p-4 bg-macos-topbar hover:bg-macos-accent/20 rounded-xl text-left transition-colors border border-macos-text-secondary/20"
            >
              <h3 className="font-semibold mb-1">🌐 Port Scanner</h3>
              <p className="text-sm text-macos-text-secondary">
                Scan networks and identify vulnerabilities
              </p>
            </button>

            <button
              onClick={() => setSelectedGame('portforward')}
              className="w-full p-4 bg-macos-topbar hover:bg-macos-accent/20 rounded-xl text-left transition-colors border border-macos-text-secondary/20"
            >
              <h3 className="font-semibold mb-1">🚇 SSH Port Forwarding</h3>
              <p className="text-sm text-macos-text-secondary">
                Create SSH tunnels to bypass firewalls
              </p>
            </button>

            <button
              onClick={() => setSelectedGame('stream')}
              className="w-full p-4 bg-macos-topbar hover:bg-macos-accent/20 rounded-xl text-left transition-colors border border-macos-text-secondary/20"
            >
              <h3 className="font-semibold mb-1">📡 Stream Interceptor</h3>
              <p className="text-sm text-macos-text-secondary">
                Intercept data streams and capture target packets
              </p>
            </button>

            <button
              onClick={() => setSelectedGame('memory')}
              className="w-full p-4 bg-macos-topbar hover:bg-macos-accent/20 rounded-xl text-left transition-colors border border-macos-text-secondary/20"
            >
              <h3 className="font-semibold mb-1">🧠 Memory Sequence</h3>
              <p className="text-sm text-macos-text-secondary">
                Reproduce security patterns to bypass authentication
              </p>
            </button>
          </div>
          )
        ) : (
          <div>
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-4 text-hacker-primary hover:text-hacker-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to tools
            </button>

            {currentGame === 'password' && <PasswordCrackGame />}
            {currentGame === 'cipher' && <CipherDecodeGame onComplete={() => handleGameComplete('cipher')} />}
            {currentGame === 'binary' && <BinaryPuzzleGame />}
            {currentGame === 'portscan' && <PortScanGame />}
            {currentGame === 'portforward' && <PortForwardGame />}
            {currentGame === 'stream' && <StreamInterceptGame onComplete={() => handleGameComplete('stream')} />}
            {currentGame === 'memory' && <MemorySequenceGame onComplete={() => handleGameComplete('memory')} />}
            
            {/* Fallback pour les jeux psycho non implémentés */}
            {isPsychotest && !['password', 'cipher', 'binary', 'portscan', 'portforward', 'stream', 'memory'].includes(currentGame) && (
              <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-gray-700 rounded-xl">
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="text-xl font-bold text-white mb-2">Jeu en construction</h3>
                <p className="text-gray-400">Le module {currentGame} sera bientôt disponible.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Window>
  );
}
