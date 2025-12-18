'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function BinaryPuzzleGame() {
  const [userCode, setUserCode] = useState('');
  const { completeObjective, currentObjective, addNotification } = useGameStore();

  const binarySequences = [
    '01010011', // S
    '01000101', // E
    '01000011', // C
    '01010101', // U
    '01010010', // R
    '01000101', // E
  ];

  const correctCode = 'SECURE';

  const binaryToAscii = (binary: string): string => {
    return String.fromCharCode(parseInt(binary, 2));
  };

  const handleSubmit = () => {
    if (userCode.toUpperCase() === correctCode) {
      addNotification({
        type: 'success',
        title: 'Vault Unlocked!',
        message: 'Binary sequence decoded successfully!',
        duration: 5000
      });

      if (currentObjective?.id === 14) {
        setTimeout(() => completeObjective(14), 1000);
      }
    } else {
      addNotification({
        type: 'error',
        title: 'Access Denied',
        message: 'Incorrect code. Try again.',
        duration: 3000
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-hacker-primary mb-2">Binary Puzzle</h2>
        <p className="text-sm text-macos-text-secondary">
          Convert binary sequences to ASCII to unlock the vault
        </p>
      </div>

      <div className="bg-terminal-bg p-6 rounded-xl">
        <div className="text-macos-yellow text-sm mb-4">Binary Sequences:</div>
        <div className="grid grid-cols-2 gap-3">
          {binarySequences.map((binary, index) => (
            <div key={index} className="bg-macos-window p-3 rounded-lg">
              <div className="text-hacker-primary font-mono text-lg mb-1">{binary}</div>
              <div className="text-xs text-macos-text-secondary">
                = {binaryToAscii(binary)} ({binary.length} bits)
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">
          Enter the 6-letter code:
        </label>
        <input
          type="text"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="w-full px-4 py-3 bg-macos-window border border-macos-text-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-hacker-primary text-macos-text font-mono text-2xl text-center tracking-widest uppercase"
          placeholder="??????"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={userCode.length !== 6}
        className="w-full py-3 bg-hacker-primary hover:bg-hacker-secondary text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Unlock Vault
      </button>

      <div className="bg-macos-window p-4 rounded-xl">
        <div className="text-xs text-macos-text-secondary space-y-2">
          <p>💡 <strong>How to solve:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Each 8-bit binary sequence represents one ASCII character</li>
            <li>Convert each binary number to decimal</li>
            <li>Find the corresponding ASCII character</li>
            <li>Combine all letters to form the code</li>
          </ol>
          <div className="mt-3 pt-3 border-t border-macos-text-secondary/20">
            <p className="text-macos-yellow">Example: 01000001 = 65 = 'A'</p>
          </div>
        </div>
      </div>

      <div className="bg-macos-accent/10 border border-macos-accent/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-macos-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-macos-text-secondary">
            The vault contains critical information about the backup server location.
            Once unlocked, you'll gain access to the final objective.
          </div>
        </div>
      </div>
    </div>
  );
}
