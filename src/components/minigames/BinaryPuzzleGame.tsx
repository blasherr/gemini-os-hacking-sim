'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';


export default function BinaryPuzzleGame() {
  const [userBinary, setUserBinary] = useState('');
  const { completeObjective, currentObjective, addNotification } = useGameStore();

  // Séquences binaires attendues (solution)
  const binarySequences = [
    '01010011', // S
    '01000101', // E
    '01000011', // C
    '01010101', // U
    '01010010', // R
    '01000101', // E
  ];
  const correctBinary = binarySequences.join(''); // 48 chiffres
  const correctCode = 'SECURE';

  // Convertit une séquence binaire de 8 chiffres en ASCII
  const binaryToAscii = (binary: string): string => {
    return String.fromCharCode(parseInt(binary, 2));
  };

  // Convertit la saisie utilisateur (48 chiffres) en texte
  const userBinaryToText = (input: string): string => {
    if (input.length !== 48) return '';
    let result = '';
    for (let i = 0; i < 48; i += 8) {
      const chunk = input.slice(i, i + 8);
      result += binaryToAscii(chunk);
    }
    return result;
  };

  const handleSubmit = () => {
    if (userBinary.length !== 48) {
      addNotification({
        type: 'error',
        title: 'Format incorrect',
        message: 'Entrez exactement 48 chiffres binaires (6 x 8).',
        duration: 3000
      });
      return;
    }
    if (userBinary === correctBinary) {
      addNotification({
        type: 'success',
        title: 'Vault Unlocked!',
        message: 'Binary sequence decoded successfully!',
        duration: 5000
      });
      if (currentObjective?.id === 8) {
        setTimeout(() => completeObjective(8), 1000);
      }
    } else {
      // Affiche le texte décodé pour aider
      const decoded = userBinaryToText(userBinary);
      addNotification({
        type: 'error',
        title: 'Access Denied',
        message: decoded ? `Décodé: ${decoded}` : 'Incorrect code. Try again.',
        duration: 4000
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
          Entrez les 6 séquences binaires (48 chiffres, sans espace) :
        </label>
        <input
          type="text"
          value={userBinary}
          onChange={(e) => setUserBinary(e.target.value.replace(/[^01]/g, ''))}
          maxLength={48}
          className="w-full px-4 py-3 bg-macos-window border border-macos-text-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-hacker-primary text-macos-text font-mono text-lg text-center tracking-widest"
          placeholder="Ex: 0101001101000101..."
        />
        <div className="text-xs text-macos-text-secondary mt-2">
          {userBinary.length}/48 chiffres saisis
        </div>
        {userBinary.length === 48 && (
          <div className="text-xs text-hacker-primary mt-1">
            Décodé: <span className="font-mono">{userBinaryToText(userBinary)}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={userBinary.length !== 48}
        className="w-full py-3 bg-hacker-primary hover:bg-hacker-secondary text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Déverrouiller le coffre
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
