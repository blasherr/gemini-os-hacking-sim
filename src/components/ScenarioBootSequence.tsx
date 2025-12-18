'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ScenarioBootSequenceProps {
  onComplete: () => void;
  username: string;
}

const bootMessages = [
  { text: 'Initialisation du système GEMINI...', delay: 0 },
  { text: 'Chargement du kernel v3.0.0...', delay: 500 },
  { text: 'Vérification de l\'identité...', delay: 1000 },
  { text: 'Connexion au réseau sécurisé...', delay: 1500 },
  { text: 'Authentification réussie ✓', delay: 2000 },
  { text: 'Chargement de l\'environnement...', delay: 2500 },
  { text: 'Préparation des outils...', delay: 3000 },
  { text: 'Système prêt.', delay: 3500 },
];

export default function ScenarioBootSequence({ onComplete, username }: ScenarioBootSequenceProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Afficher les messages de boot progressivement
    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setCurrentLine(index + 1);
      }, msg.delay);
    });

    // Afficher le message de bienvenue
    setTimeout(() => {
      setShowWelcome(true);
    }, 4200);

    // Lancer le fadeout et terminer
    setTimeout(() => {
      setFadeOut(true);
    }, 6000);

    setTimeout(() => {
      onComplete();
    }, 7000);
  }, [onComplete]);

  if (fadeOut) {
    return (
      <div 
        className="fixed inset-0 z-[9999] bg-[#050810] transition-opacity duration-1000 opacity-0"
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a1628 0%, #050810 50%, #020408 100%)'
      }}
    >
      {/* Grille subtile bleue */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Logo GEMINI bleu animé */}
      <div className="mb-8 relative">
        <div 
          className="absolute inset-0 bg-blue-500/20 blur-[60px] scale-150 animate-pulse"
        />
        <Image
          src="/assets/logo/logo_améliorer_bleu.png"
          alt="GEMINI"
          width={120}
          height={120}
          className="relative z-10"
          style={{ 
            filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))',
            animation: 'pulse 2s ease-in-out infinite'
          }}
          priority
        />
      </div>

      {/* Titre */}
      <h1 
        className="text-2xl font-bold text-blue-400 mb-8 tracking-widest"
        style={{ 
          fontFamily: 'Orbitron, monospace',
          textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
        }}
      >
        GEMINI OS
      </h1>

      {/* Terminal de boot */}
      <div className="w-full max-w-xl px-8">
        <div 
          className="rounded-lg p-5 font-mono text-sm"
          style={{
            background: 'rgba(10, 20, 40, 0.8)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)'
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-500/20">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-3 text-blue-400/60 text-xs">GEMINI BOOT LOADER v3.0</span>
          </div>

          {/* Boot messages */}
          <div className="space-y-1.5 min-h-[180px]">
            {bootMessages.slice(0, currentLine).map((msg, index) => (
              <div
                key={index}
                className="flex items-center gap-2 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-blue-500">[{String(index).padStart(2, '0')}]</span>
                <span className={index === bootMessages.length - 1 ? 'text-blue-400 font-bold' : 'text-gray-400'}>
                  {msg.text}
                </span>
                {index === currentLine - 1 && index !== bootMessages.length - 1 && (
                  <span className="text-blue-400 animate-pulse">█</span>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-5 pt-4 border-t border-blue-500/20">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progression</span>
              <span className="text-blue-400">{Math.round((currentLine / bootMessages.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                style={{ width: `${(currentLine / bootMessages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Message de bienvenue */}
      {showWelcome && (
        <div className="mt-8 text-center animate-fadeIn">
          <h2
            className="text-2xl font-bold mb-2 text-blue-400"
            style={{ 
              fontFamily: 'Orbitron, monospace',
              textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}
          >
            BIENVENUE, {username.toUpperCase()}
          </h2>
          <p className="text-gray-500 text-sm tracking-wider mb-4">
            SCÉNARIO DE HACKING • NIVEAU DÉBUTANT
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-blue-400 text-sm">Chargement de la mission...</span>
          </div>
        </div>
      )}

      {/* Particules bleues */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
            style={{
              left: `${10 + (i * 8)}%`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.4
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10px); opacity: 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
