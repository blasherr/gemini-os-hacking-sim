import { PsychoGame } from '@/types';

// Liste des jeux psychotechniques disponibles
export const PSYCHO_GAMES: PsychoGame[] = [
  // === MÉMOIRE ===
  {
    id: 'memory-grid',
    name: 'Grille Mémoire',
    description: 'Mémorisez les cases illuminées et reproduisez la séquence',
    category: 'memory',
    icon: '🧠',
    difficulty: 'medium',
    maxScore: 100,
    timeLimit: 60
  },
  {
    id: 'memory-sequence',
    name: 'Séquence Simon',
    description: 'Reproduisez des séquences de couleurs de plus en plus longues',
    category: 'memory',
    icon: '🎨',
    difficulty: 'medium',
    maxScore: 100,
    timeLimit: 120
  },
  {
    id: 'memory-cards',
    name: 'Paires de Cartes',
    description: 'Trouvez toutes les paires de cartes identiques',
    category: 'memory',
    icon: '🃏',
    difficulty: 'easy',
    maxScore: 100,
    timeLimit: 90
  },

  // === LOGIQUE ===
  {
    id: 'logic-patterns',
    name: 'Suites Logiques',
    description: 'Trouvez le nombre suivant dans la suite',
    category: 'logic',
    icon: '🔢',
    difficulty: 'medium',
    maxScore: 100,
    timeLimit: 120
  },
  {
    id: 'logic-math',
    name: 'Calcul Mental',
    description: 'Résolvez des opérations mathématiques rapidement',
    category: 'logic',
    icon: '➕',
    difficulty: 'medium',
    maxScore: 100,
    timeLimit: 60
  },

  // === ATTENTION ===
  {
    id: 'attention-stroop',
    name: 'Test de Stroop',
    description: 'Identifiez la couleur du texte, pas le mot écrit',
    category: 'attention',
    icon: '👁️',
    difficulty: 'hard',
    maxScore: 100,
    timeLimit: 45
  },
  {
    id: 'attention-target',
    name: 'Cible Mouvante',
    description: 'Cliquez sur les cibles qui apparaissent',
    category: 'attention',
    icon: '🎯',
    difficulty: 'easy',
    maxScore: 100,
    timeLimit: 30
  },

  // === VITESSE ===
  {
    id: 'speed-reaction',
    name: 'Temps de Réaction',
    description: 'Cliquez dès que la couleur change',
    category: 'speed',
    icon: '⚡',
    difficulty: 'easy',
    maxScore: 100,
    timeLimit: 30
  },
  {
    id: 'speed-typing',
    name: 'Frappe Rapide',
    description: 'Tapez les lettres affichées le plus vite possible',
    category: 'speed',
    icon: '⌨️',
    difficulty: 'medium',
    maxScore: 100,
    timeLimit: 30
  },

  // === SPATIAL ===
  {
    id: 'spatial-maze',
    name: 'Labyrinthe',
    description: 'Trouvez la sortie du labyrinthe',
    category: 'spatial',
    icon: '🗺️',
    difficulty: 'medium',
    maxScore: 100,
    timeLimit: 60
  },
  {
    id: 'spatial-rotation',
    name: 'Rotation Mentale',
    description: 'Identifiez la forme après rotation',
    category: 'spatial',
    icon: '🔄',
    difficulty: 'hard',
    maxScore: 100,
    timeLimit: 90
  }
];

// Grouper par catégorie - Format tableau pour pouvoir utiliser .map()
export const GAME_CATEGORIES = [
  { id: 'memory', name: 'Mémoire', color: '#8b5cf6', icon: '🧠' },
  { id: 'logic', name: 'Logique', color: '#3b82f6', icon: '🔢' },
  { id: 'attention', name: 'Attention', color: '#10b981', icon: '👁️' },
  { id: 'speed', name: 'Vitesse', color: '#f59e0b', icon: '⚡' },
  { id: 'spatial', name: 'Spatial', color: '#ef4444', icon: '🗺️' }
];

// Générer un code de succès pour les tests psycho
export function generatePsychoSuccessCode(): string {
  const prefix = 'PSYCHO';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

// Calculer le score global
export function calculateGlobalScore(results: { [gameId: string]: number }): number {
  const scores = Object.values(results);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
