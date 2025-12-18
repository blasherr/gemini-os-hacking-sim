import { Objective } from '@/types';

// Scénario de hacking SIMPLIFIÉ pour débutants - environ 20 minutes
// Chaque étape est expliquée clairement avec des indices progressifs
export const GAME_OBJECTIVES: Objective[] = [
  // ========== PARTIE 1: DÉCOUVERTE (5 min) ==========
  {
    id: 1,
    title: '🖥️ Découverte du Terminal',
    description: 'Ouvrez le Terminal et tapez "help" pour découvrir les commandes disponibles.',
    type: 'terminal',
    requiredAction: 'help',
    hints: [
      'Cliquez sur l\'icône Terminal dans le dock en bas',
      'Tapez "help" puis appuyez sur Entrée',
      'Lisez la liste des commandes disponibles'
    ],
    nextObjective: 2
  },
  {
    id: 2,
    title: '🌐 Vérifier votre connexion',
    description: 'Utilisez la commande "ifconfig" pour voir vos informations réseau.',
    type: 'terminal',
    requiredAction: 'ifconfig',
    hints: [
      'Tapez "ifconfig" dans le terminal',
      'Cette commande affiche votre adresse IP',
      'Notez l\'adresse IP de votre machine'
    ],
    nextObjective: 3
  },
  {
    id: 3,
    title: '🔍 Scanner le réseau',
    description: 'Découvrez les autres machines sur le réseau avec un scan.',
    type: 'network',
    requiredAction: 'nmap 192.168.1.0/24',
    hints: [
      'La commande nmap permet de scanner un réseau',
      'Tapez: nmap 192.168.1.0/24',
      'Vous verrez la liste des machines connectées'
    ],
    nextObjective: 4
  },

  // ========== PARTIE 2: EXPLORATION (5 min) ==========
  {
    id: 4,
    title: '📁 Explorer les fichiers',
    description: 'Ouvrez le Gestionnaire de fichiers et explorez le dossier Documents.',
    type: 'file',
    requiredAction: 'open_files',
    hints: [
      'Cliquez sur l\'icône Fichiers dans le dock',
      'Double-cliquez sur le dossier "Documents"',
      'Explorez les sous-dossiers disponibles'
    ],
    nextObjective: 5
  },
  {
    id: 5,
    title: '🔑 Trouver les identifiants',
    description: 'Dans Documents/corporate/, ouvrez le fichier "employees.txt".',
    type: 'file',
    requiredAction: 'view_employees',
    hints: [
      'Allez dans Documents → corporate',
      'Double-cliquez sur employees.txt',
      'Vous trouverez des noms d\'utilisateurs'
    ],
    nextObjective: 6
  },
  {
    id: 6,
    title: '🔐 Trouver la clé secrète',
    description: 'Cherchez la clé de déchiffrement dans Documents/keys/.',
    type: 'file',
    requiredAction: 'find_key',
    hints: [
      'Allez dans Documents → keys',
      'Ouvrez le fichier master.key',
      'La clé est: C0rp0r@t3S3cr3t2025'
    ],
    nextObjective: 7
  },

  // ========== PARTIE 3: MINI-JEUX (5 min) ==========
  {
    id: 7,
    title: '🧩 Déchiffrer un message (Caesar)',
    description: 'Un message chiffré a été intercepté. Utilisez le décodeur Caesar.',
    type: 'minigame',
    requiredAction: 'cipher_decode',
    hints: [
      'Ouvrez les Outils de Hacking dans le dock',
      'Sélectionnez "Décodeur Caesar"',
      'Essayez le décalage 13 (ROT13)',
      'Le message commence par "THE SECRET"'
    ],
    solution: { 
      cipher: 'caesar', 
      shift: 13,
      message: 'THE SECRET VAULT IS IN BUILDING B, ROOM 404'
    },
    nextObjective: 8
  },
  {
    id: 8,
    title: '🔢 Résoudre le puzzle binaire',
    description: 'Convertissez ce code binaire en texte pour obtenir un mot de passe.',
    type: 'minigame',
    requiredAction: 'binary_puzzle',
    hints: [
      'Ouvrez le "Puzzle Binaire" dans les outils',
      'Chaque groupe de 8 chiffres = 1 lettre',
      '01010011 = S, 01000101 = E, etc.',
      'Le code final est: SECURE'
    ],
    solution: { code: 'SECURE' },
    nextObjective: 9
  },
  {
    id: 9,
    title: '🔓 Cracker un mot de passe',
    description: 'Utilisez l\'outil de crack pour trouver le mot de passe admin.',
    type: 'minigame',
    requiredAction: 'password_crack',
    hints: [
      'Ouvrez le "Password Cracker"',
      'Laissez l\'outil tester les combinaisons',
      'Le mot de passe est: Admin2025!',
      'Les mots de passe simples sont faciles à deviner'
    ],
    solution: { password: 'Admin2025!' },
    nextObjective: 10
  },

  // ========== PARTIE 4: CONNEXION (5 min) ==========
  {
    id: 10,
    title: '🖧 Scanner les ports du serveur',
    description: 'Identifiez les services actifs sur le serveur cible.',
    type: 'network',
    requiredAction: 'nmap -p 22,80,443 192.168.1.100',
    hints: [
      'Tapez: nmap -p 22,80,443 192.168.1.100',
      'Port 22 = SSH (connexion sécurisée)',
      'Port 80 = HTTP (site web)',
      'Port 443 = HTTPS (site web sécurisé)'
    ],
    nextObjective: 11
  },
  {
    id: 11,
    title: '🔌 Se connecter en SSH',
    description: 'Connectez-vous au serveur distant avec SSH.',
    type: 'terminal',
    requiredAction: 'ssh admin@192.168.1.100',
    hints: [
      'SSH permet de se connecter à distance',
      'Tapez: ssh admin@192.168.1.100',
      'Utilisez le mot de passe: Admin2025!'
    ],
    nextObjective: 12
  },
  {
    id: 12,
    title: '📂 Lister les fichiers distants',
    description: 'Maintenant connecté, listez les fichiers du serveur.',
    type: 'terminal',
    requiredAction: 'ls -la',
    hints: [
      'Vous êtes maintenant sur le serveur distant',
      'Tapez: ls -la pour voir tous les fichiers',
      '-la affiche les fichiers cachés aussi'
    ],
    nextObjective: 13
  },
  {
    id: 13,
    title: '📖 Lire un fichier secret',
    description: 'Lisez le contenu du fichier "secret.txt".',
    type: 'terminal',
    requiredAction: 'cat secret.txt',
    hints: [
      'La commande "cat" affiche le contenu d\'un fichier',
      'Tapez: cat secret.txt',
      'Notez les informations importantes'
    ],
    nextObjective: 14
  },

  // ========== PARTIE 5: MISSION FINALE (5 min) ==========
  {
    id: 14,
    title: '⬆️ Élévation de privilèges',
    description: 'Vérifiez si vous pouvez obtenir les droits administrateur.',
    type: 'terminal',
    requiredAction: 'sudo -l',
    hints: [
      'sudo permet d\'exécuter des commandes en admin',
      'Tapez: sudo -l pour voir vos permissions',
      'Certaines commandes sont autorisées'
    ],
    nextObjective: 15
  },
  {
    id: 15,
    title: '🛠️ Utiliser l\'exploit',
    description: 'Un script d\'exploitation est disponible. Exécutez-le.',
    type: 'terminal',
    requiredAction: 'sudo /tmp/exploit.sh',
    hints: [
      'Le script est dans /tmp/exploit.sh',
      'Tapez: sudo /tmp/exploit.sh',
      'Vous obtenez maintenant les droits root!'
    ],
    nextObjective: 16
  },
  {
    id: 16,
    title: '👤 Vérifier l\'identité',
    description: 'Confirmez que vous êtes maintenant root (administrateur).',
    type: 'terminal',
    requiredAction: 'whoami',
    hints: [
      'Tapez: whoami',
      'Si ça affiche "root", vous avez réussi!',
      'root = super-utilisateur Linux'
    ],
    nextObjective: 17
  },
  {
    id: 17,
    title: '📁 Accéder au dossier root',
    description: 'Naviguez vers le dossier personnel de l\'administrateur.',
    type: 'terminal',
    requiredAction: 'cd /root',
    hints: [
      'Le dossier root est /root',
      'Tapez: cd /root',
      'Puis listez avec: ls'
    ],
    nextObjective: 18
  },
  {
    id: 18,
    title: '🔍 Trouver le fichier final',
    description: 'Listez les fichiers pour trouver le fichier de mission.',
    type: 'terminal',
    requiredAction: 'ls',
    hints: [
      'Tapez: ls',
      'Cherchez un fichier nommé mission_complete.txt',
      'C\'est le fichier contenant votre code de succès'
    ],
    nextObjective: 19
  },
  {
    id: 19,
    title: '📜 Lire le code de succès',
    description: 'Affichez le contenu du fichier mission_complete.txt.',
    type: 'terminal',
    requiredAction: 'cat mission_complete.txt',
    hints: [
      'Tapez: cat mission_complete.txt',
      'Le fichier contient votre code de réussite',
      'Notez ce code précieusement!'
    ],
    nextObjective: 20
  },
  {
    id: 20,
    title: '🏆 Mission Accomplie!',
    description: 'Félicitations! Vous avez terminé le scénario de hacking.',
    type: 'file',
    requiredAction: 'mission_complete',
    hints: [
      'Bravo! Vous avez réussi toutes les étapes!',
      'Vous avez appris les bases du hacking éthique',
      'Votre code de succès a été généré'
    ],
    solution: { successCode: 'HACKER-2025-MASTER-{RANDOM}' }
  }
];

// Génère un code de succès unique pour chaque utilisateur
export function generateSuccessCode(userId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const userHash = userId.substring(0, 4).toUpperCase();
  return `HACKER-2025-${userHash}-${timestamp}-${random}`;
}
