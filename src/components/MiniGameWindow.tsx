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

interface MiniGameWindowProps {
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
}

export default function MiniGameWindow({ onClose, isActive, onFocus }: MiniGameWindowProps) {
  const { currentObjective, completeObjective } = useGameStore();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Determine which minigame to show based on current objective
  const getCurrentGame = () => {
    if (selectedGame) return selectedGame;
    
    if (currentObjective) {
      if (currentObjective.id === 5) return 'decipher';
      if (currentObjective.id === 9) return 'portforward';
      if (currentObjective.id === 11) return 'cipher';
      if (currentObjective.id === 14) return 'binary';
      if (currentObjective.id === 17) return 'password';
      // Nouveaux mini-jeux liés aux objectifs
      if (currentObjective.id === 7) return 'stream'; // Interception de données
      if (currentObjective.id === 15) return 'memory'; // Accès base de données
    }
    
    return null;
  };

  const handleGameComplete = (gameType: string) => {
    // Compléter l'objectif correspondant
    const objectiveMap: { [key: string]: number } = {
      'stream': 7,
      'memory': 15,
      'portforward': 9,
      'decipher': 5,
      'cipher': 11,
      'binary': 14,
      'password': 17
    };
    
    if (objectiveMap[gameType]) {
      completeObjective(objectiveMap[gameType]);
    }
  };

  const currentGame = getCurrentGame();

  return (
    <Window
      title="Hacking Tools"
      onClose={onClose}
      isActive={isActive}
      onFocus={onFocus}
      initialPosition={{ x: 400, y: 100 }}
      initialSize={{ width: 600, height: 600 }}
    >
      <div className="h-full overflow-y-auto p-6">
        {!currentGame ? (
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
            {currentGame === 'cipher' && <CipherDecodeGame />}
            {currentGame === 'binary' && <BinaryPuzzleGame />}
            {currentGame === 'portscan' && <PortScanGame />}
            {currentGame === 'portforward' && <PortForwardGame />}
            {currentGame === 'decipher' && <CipherDecodeGame />}
            {currentGame === 'stream' && <StreamInterceptGame onComplete={() => handleGameComplete('stream')} />}
            {currentGame === 'memory' && <MemorySequenceGame onComplete={() => handleGameComplete('memory')} />}
          </div>
        )}
      </div>
    </Window>
  );
}
