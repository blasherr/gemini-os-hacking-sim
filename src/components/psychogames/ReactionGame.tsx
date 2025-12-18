'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getGameAudio } from '@/lib/gameAudio';

interface ReactionGameProps {
  onComplete: (score: number) => void;
}

export default function ReactionGame({ onComplete }: ReactionGameProps) {
  const [phase, setPhase] = useState<'waiting' | 'ready' | 'go' | 'result' | 'early' | 'final'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const totalRounds = 5;
  const audioRef = useRef(getGameAudio());

  const startRound = useCallback(() => {
    setPhase('ready');
    
    // Délai aléatoire avant de passer au vert
    const delay = Math.random() * 3000 + 2000; // 2-5 secondes
    
    const timer = setTimeout(() => {
      setPhase('go');
      setStartTime(Date.now());
      // Son "GO!" - note aiguë
      audioRef.current.playNote(880, 0.15);
    }, delay);

    return timer;
  }, []);

  useEffect(() => {
    if (phase === 'waiting' && currentRound < totalRounds) {
      const timer = setTimeout(() => {
        startRound();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, currentRound, startRound]);

  const handleClick = () => {
    if (phase === 'ready') {
      // Cliqué trop tôt !
      audioRef.current.playError();
      setPhase('early');
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setPhase('waiting');
      }, 1500);
    } else if (phase === 'go') {
      const reactionTime = Date.now() - startTime;
      setReactionTimes(prev => [...prev, reactionTime]);
      
      // Son basé sur le temps de réaction
      if (reactionTime < 250) {
        audioRef.current.playSuccess();
      } else if (reactionTime < 400) {
        audioRef.current.playNote(523.25, 0.2);
      } else {
        audioRef.current.playNote(349.23, 0.2);
      }
      
      setPhase('result');
      
      setTimeout(() => {
        if (currentRound + 1 >= totalRounds) {
          audioRef.current.playLevelUp();
          setPhase('final');
        } else {
          setCurrentRound(prev => prev + 1);
          setPhase('waiting');
        }
      }, 1500);
    }
  };

  if (phase === 'final') {
    const validTimes = reactionTimes.filter(t => t > 0);
    const avgTime = validTimes.length > 0 
      ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length)
      : 999;
    
    // Score basé sur le temps de réaction moyen
    // < 200ms = 100%, 200-300ms = 80%, 300-400ms = 60%, 400-500ms = 40%, > 500ms = 20%
    let finalScore: number;
    if (avgTime < 200) finalScore = 100;
    else if (avgTime < 250) finalScore = 90;
    else if (avgTime < 300) finalScore = 80;
    else if (avgTime < 350) finalScore = 70;
    else if (avgTime < 400) finalScore = 60;
    else if (avgTime < 500) finalScore = 50;
    else finalScore = 30;

    // Pénalité pour clics précoces
    const earlyClicks = totalRounds - validTimes.length;
    finalScore = Math.max(0, finalScore - earlyClicks * 10);
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-white mb-2">Test terminé!</h3>
          <div className="space-y-2 mb-4">
            <p className="text-gray-400">Temps moyen: {avgTime}ms</p>
            <p className="text-gray-400">Essais valides: {validTimes.length}/{totalRounds}</p>
            {validTimes.length > 0 && (
              <p className="text-gray-400">
                Meilleur: {Math.min(...validTimes)}ms
              </p>
            )}
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
      <div className="flex gap-6 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-400">Essai</p>
          <p className="text-2xl font-bold text-white">{currentRound + 1}/{totalRounds}</p>
        </div>
        {reactionTimes.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-gray-400">Dernier</p>
            <p className="text-2xl font-bold text-cyan-400">
              {reactionTimes[reactionTimes.length - 1]}ms
            </p>
          </div>
        )}
      </div>

      {/* Zone de clic */}
      <motion.button
        onClick={handleClick}
        disabled={phase === 'waiting' || phase === 'result' || phase === 'early'}
        className={`w-64 h-64 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
          phase === 'waiting' ? 'bg-gray-700 cursor-not-allowed' :
          phase === 'ready' ? 'bg-red-500 hover:bg-red-400 cursor-pointer shadow-lg shadow-red-500/50' :
          phase === 'go' ? 'bg-green-500 hover:bg-green-400 cursor-pointer shadow-lg shadow-green-500/50' :
          phase === 'result' ? 'bg-blue-500 cursor-default' :
          'bg-yellow-500 cursor-default'
        }`}
        whileHover={phase === 'ready' || phase === 'go' ? { scale: 1.05 } : {}}
        whileTap={phase === 'ready' || phase === 'go' ? { scale: 0.95 } : {}}
      >
        {phase === 'waiting' && <span className="text-gray-400">Préparez-vous...</span>}
        {phase === 'ready' && <span className="text-white">ATTENDEZ...</span>}
        {phase === 'go' && <span className="text-white">CLIQUEZ !</span>}
        {phase === 'result' && (
          <span className="text-white">
            {reactionTimes[reactionTimes.length - 1]}ms
          </span>
        )}
        {phase === 'early' && <span className="text-white">Trop tôt !</span>}
      </motion.button>

      {/* Instructions */}
      <div className="mt-6 text-center">
        {phase === 'ready' && (
          <p className="text-red-400">Attendez que le cercle devienne VERT</p>
        )}
        {phase === 'go' && (
          <p className="text-green-400 animate-pulse">Cliquez maintenant !</p>
        )}
        {phase === 'waiting' && currentRound > 0 && (
          <p className="text-gray-400">Prochain essai...</p>
        )}
      </div>

      {/* Historique des temps */}
      {reactionTimes.length > 0 && (
        <div className="mt-6 flex gap-2">
          {reactionTimes.map((time, i) => (
            <div
              key={i}
              className="px-3 py-1 bg-black/40 rounded-lg text-sm"
            >
              <span className={time < 300 ? 'text-green-400' : time < 400 ? 'text-yellow-400' : 'text-red-400'}>
                {time}ms
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
