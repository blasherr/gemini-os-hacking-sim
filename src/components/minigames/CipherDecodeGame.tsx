'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

interface CipherDecodeGameProps {
  onComplete?: () => void;
}

export default function CipherDecodeGame({ onComplete }: CipherDecodeGameProps) {
  const [shift, setShift] = useState(0);
  const [decoded, setDecoded] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const { completeObjective, currentObjective, addNotification } = useGameStore();

  const encryptedMessage = 'GUR FRPERG INHYG VF VA OHVYQVAT O, EBBZ 404';
  const correctShift = 13; // ROT13
  const correctMessage = 'THE SECRET VAULT IS IN BUILDING B, ROOM 404';

  const caesarDecode = (text: string, shift: number): string => {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = char === char.toUpperCase();
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base - shift + 26) % 26) + base);
      }
      return char;
    }).join('');
  };

  const handleDecode = () => {
    const result = caesarDecode(encryptedMessage, shift);
    setDecoded(result);

    if (result === correctMessage && !isCompleted) {
      setIsCompleted(true);
      addNotification({
        type: 'success',
        title: 'Message Decoded!',
        message: 'Secret location revealed!',
        duration: 5000
      });

      // Compléter l'objectif 7 (Déchiffrer un message Caesar)
      if (currentObjective?.id === 7) {
        setTimeout(() => completeObjective(7), 1000);
      }
      
      // Appeler le callback onComplete si fourni
      if (onComplete) {
        setTimeout(() => onComplete(), 1500);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-hacker-primary mb-2">Cipher Decoder</h2>
        <p className="text-sm text-macos-text-secondary">
          Caesar Cipher - Find the correct shift value
        </p>
      </div>

      <div className="bg-terminal-bg p-4 rounded-xl">
        <div className="text-macos-yellow text-xs mb-2">Encrypted Message:</div>
        <div className="text-hacker-primary font-mono text-sm break-all">
          {encryptedMessage}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">
          Shift Value: <span className="text-hacker-primary font-mono">{shift}</span>
        </label>
        <input
          type="range"
          min="0"
          max="25"
          value={shift}
          onChange={(e) => setShift(parseInt(e.target.value))}
          className="w-full accent-hacker-primary"
        />
        <div className="flex justify-between text-xs text-macos-text-secondary mt-1">
          <span>0</span>
          <span>13 (ROT13)</span>
          <span>25</span>
        </div>
      </div>

      <button
        onClick={handleDecode}
        className="w-full py-3 bg-hacker-primary hover:bg-hacker-secondary text-black font-semibold rounded-xl transition-all"
      >
        Decode Message
      </button>

      {decoded && (
        <div className={`p-4 rounded-xl border ${
          decoded === correctMessage 
            ? 'bg-hacker-primary/20 border-hacker-primary' 
            : 'bg-macos-window border-macos-text-secondary/20'
        }`}>
          <div className="text-xs text-macos-text-secondary mb-2">Decoded:</div>
          <div className={`font-mono text-sm ${
            decoded === correctMessage ? 'text-hacker-primary font-bold' : 'text-macos-text'
          }`}>
            {decoded}
          </div>
          {decoded === correctMessage && (
            <div className="mt-3 pt-3 border-t border-hacker-primary/30">
              <div className="flex items-center gap-2 text-hacker-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold">SUCCESS! Message decoded correctly!</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-macos-window p-4 rounded-xl">
        <div className="text-xs text-macos-text-secondary">
          <p className="mb-2">💡 <strong>Hint:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>The message starts with "THE SECRET"</li>
            <li>Try ROT13 (shift = 13)</li>
            <li>Adjust the slider to find the right shift</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
