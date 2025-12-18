// Types de session disponibles
export type SessionType = 'scenario' | 'psychotest';

export interface UserSession {
  userId: string;
  username: string;
  sessionType: SessionType; // NOUVEAU: type de session
  currentObjective: number;
  completedObjectives: number[];
  startedAt: number;
  lastActivity: number;
  isCompleted: boolean;
  successCode?: string;
  progress: {
    [key: string]: any;
  };
  // Pour les tests psychotechniques
  psychoResults?: PsychoTestResults;
}

// Score individuel d'un jeu psychotechnique
export interface PsychoGameScore {
  score: number;
  maxScore: number;
  percentage: number;
  skipped?: boolean;
  completedAt?: number;
}

// Résultats des tests psychotechniques
export interface PsychoTestResults {
  completedGames: number;
  totalGames: number;
  scores: { [gameId: string]: PsychoGameScore };
  totalScore: number;
  averageScore: number;
  averageReactionTime?: number;
  memoryScore?: number;
  logicScore?: number;
  attentionScore?: number;
  speedScore?: number;
  spatialScore?: number;
}

// Définition d'un mini-jeu psychotechnique
export interface PsychoGame {
  id: string;
  name: string;
  description: string;
  category: 'memory' | 'logic' | 'attention' | 'speed' | 'spatial';
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  maxScore: number;
  timeLimit?: number; // en secondes
}

export interface Objective {
  id: number;
  title: string;
  description: string;
  type: 'terminal' | 'file' | 'minigame' | 'puzzle' | 'network';
  requiredAction?: string;
  hints: string[];
  solution?: any;
  nextObjective?: number;
}

export interface GameState {
  objectives: Objective[];
  files: FileNode[];
  networks: NetworkNode[];
  tools: Tool[];
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  encrypted?: boolean;
  encryptionKey?: string;
  children?: FileNode[];
  hidden?: boolean;
  locked?: boolean;
  password?: string;
}

export interface NetworkNode {
  id: string;
  ip: string;
  hostname: string;
  status: 'online' | 'offline' | 'compromised';
  ports: Port[];
  credentials?: {
    username: string;
    password: string;
  };
}

export interface Port {
  number: number;
  service: string;
  status: 'open' | 'closed' | 'filtered';
  vulnerability?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  command: string;
  unlocked: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error' | 'owner';
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
}

export interface OwnerAction {
  type: 'notification' | 'help' | 'skip' | 'minigame' | 'screamer';
  targetUserId: string;
  payload: any;
  timestamp: number;
}

export interface MiniGame {
  id: string;
  type: 'password-crack' | 'port-scan' | 'binary-puzzle' | 'cipher-decode';
  difficulty: 'easy' | 'medium' | 'hard';
  data: any;
  solution: any;
}
