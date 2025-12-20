'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function PasswordCrackGame() {
  const [isCracking, setIsCracking] = useState(false);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [found, setFound] = useState(false);
  const [progress, setProgress] = useState(0);
  const { completeObjective, currentObjective, addNotification } = useGameStore();

  const targetPassword = 'Admin2025!';
  const dictionary = [
    'password', 'admin', '123456', 'qwerty', 'letmein',
    'welcome', 'monkey', 'dragon', 'master', 'Admin2025!'
  ];

  const startCracking = () => {
    setIsCracking(true);
    setAttempts([]);
    setProgress(0);
    setFound(false);

    let index = 0;
    const interval = setInterval(() => {
      if (index < dictionary.length) {
        const currentWord = dictionary[index];
        setAttempts(prev => [...prev, currentWord]);
        setProgress(((index + 1) / dictionary.length) * 100);

        if (currentWord === targetPassword) {
          setFound(true);
          setIsCracking(false);
          clearInterval(interval);
          
          // Objectif 9: Cracker un mot de passe
          if (currentObjective?.id === 9) {
            setTimeout(() => completeObjective(9), 1000);
          }
          
          addNotification({
            type: 'success',
            title: 'Password Cracked!',
            message: `Found: ${targetPassword}`,
            duration: 5000
          });
        }
        index++;
      } else {
        setIsCracking(false);
        clearInterval(interval);
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-hacker-primary mb-2">Password Cracker</h2>
        <p className="text-sm text-macos-text-secondary">
          Dictionary attack on SHA256 hash
        </p>
      </div>

      <div className="bg-terminal-bg p-4 rounded-xl font-mono text-sm">
        <div className="text-macos-yellow mb-2">Target Hash:</div>
        <div className="text-hacker-primary text-xs break-all">
          e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Progress:</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full h-4 bg-macos-window rounded-full overflow-hidden">
          <div
            className="h-full bg-hacker-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={startCracking}
        disabled={isCracking}
        className="w-full py-3 bg-hacker-primary hover:bg-hacker-secondary text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCracking ? 'Cracking...' : found ? 'Password Found!' : 'Start Attack'}
      </button>

      {found && (
        <div className="bg-hacker-primary/20 border border-hacker-primary rounded-xl p-4 text-center animate-pulse">
          <div className="text-2xl mb-2">✓</div>
          <div className="font-bold text-hacker-primary">SUCCESS!</div>
          <div className="text-sm text-macos-text-secondary mt-2">
            Password: <span className="text-hacker-primary font-mono">{targetPassword}</span>
          </div>
        </div>
      )}

      <div className="bg-terminal-bg p-4 rounded-xl max-h-64 overflow-y-auto">
        <div className="text-hacker-primary text-xs mb-2">Attempts:</div>
        {attempts.map((attempt, index) => (
          <div
            key={index}
            className={`text-xs font-mono ${
              attempt === targetPassword ? 'text-hacker-primary font-bold' : 'text-macos-text-secondary'
            }`}
          >
            [{index + 1}] Trying: {attempt} {attempt === targetPassword && '✓ MATCH!'}
          </div>
        ))}
      </div>
    </div>
  );
}
