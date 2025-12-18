'use client';

import Window from './Window';
import { useGameStore } from '@/store/gameStore';

interface MissionBriefingProps {
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
}

export default function MissionBriefing({ onClose, isActive, onFocus }: MissionBriefingProps) {
  const { currentObjective, completedObjectives } = useGameStore();

  return (
    <Window
      title="🎯 Mission Briefing"
      onClose={onClose}
      isActive={isActive}
      onFocus={onFocus}
      initialPosition={{ x: 100, y: 80 }}
      initialSize={{ width: 650, height: 550 }}
    >
      <div className="h-full overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Header */}
        <div className="text-center pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-blue-400 mb-1 tracking-wide">
            🎓 INITIATION AU HACKING
          </h2>
          <p className="text-cyan-400/80 text-[10px] font-mono tracking-wider">
            SIMULATION ÉDUCATIVE - NIVEAU DÉBUTANT
          </p>
        </div>

        {/* Mission Objective Card */}
        {currentObjective && (
          <div className="rounded-lg overflow-hidden bg-blue-500/5 border border-blue-500/20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <h3 className="font-semibold text-white text-sm">Objectif Actuel</h3>
                </div>
                <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-blue-400">
                  {completedObjectives.length} / 20
                </span>
              </div>
              
              <h4 className="text-blue-400 font-bold mb-1 flex items-center gap-2 text-sm">
                <span className="text-white/40 font-mono text-xs">#{currentObjective.id}</span>
                {currentObjective.title}
              </h4>
              
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                {currentObjective.description}
              </p>
              
              {currentObjective.hints && currentObjective.hints.length > 0 && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-[10px] font-semibold text-amber-400 mb-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Indices
                  </p>
                  <ul className="text-[11px] text-gray-500 space-y-1">
                    {currentObjective.hints.map((hint, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <span className="text-amber-400/60">▸</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mission Context */}
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-white/3 border border-white/8">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-white text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              Bienvenue
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Bienvenue dans cette <span className="text-cyan-400">simulation de hacking</span> !
              Vous allez apprendre les bases de la cybersécurité en infiltrant un réseau fictif.
              Suivez les étapes une par une et n'hésitez pas à lire les indices.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/3 border border-white/8">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-white text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Les 5 Parties (~20 min)
            </h3>
            <ul className="text-xs text-gray-400 space-y-1">
              {[
                '📖 Découverte - Apprendre les commandes de base',
                '📁 Exploration - Naviguer dans les fichiers',
                '🧩 Mini-Jeux - Déchiffrer et cracker',
                '🔌 Connexion - Se connecter au serveur',
                '🏆 Mission Finale - Obtenir les droits admin'
              ].map((obj, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-mono bg-white/5 text-white/50">
                    {i + 1}
                  </span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-white/3 border border-white/8">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-white text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Commandes Utiles
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { cmd: 'help', desc: 'Liste des commandes' },
                { cmd: 'nmap', desc: 'Scanner le réseau' },
                { cmd: 'ssh', desc: 'Connexion distante' },
                { cmd: 'cat', desc: 'Lire un fichier' }
              ].map((tool, i) => (
                <div key={i} className="p-2 rounded bg-white/3 border border-white/5">
                  <span className="font-mono text-blue-400">{tool.cmd}</span>
                  <p className="text-[10px] text-gray-500">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg p-3 bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="font-semibold mb-1 text-cyan-400 flex items-center gap-1.5 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Conseil
            </h3>
            <p className="text-[11px] text-gray-500">
              Lisez bien les indices de chaque étape ! Ils vous guident pas à pas.
              Simulation éducative - usage sur systèmes réels = illégal.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-3">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-500">Progression</span>
            <span className="font-mono text-blue-400">{completedObjectives.length} / 20</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(completedObjectives.length / 20) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Window>
  );
}
