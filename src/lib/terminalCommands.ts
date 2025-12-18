import { UserSession } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { findFileByPath } from '@/data/filesystem';

interface CommandResult {
  output: string;
  error?: boolean;
  newDirectory?: string;
}

// Commandes SIMPLIFIÉES pour le scénario débutant
const AVAILABLE_COMMANDS = {
  help: 'Affiche cette liste de commandes',
  ls: 'Liste les fichiers du dossier',
  'ls -la': 'Liste tous les fichiers (y compris cachés)',
  cd: 'Change de dossier (ex: cd /Documents)',
  pwd: 'Affiche le dossier actuel',
  cat: 'Affiche le contenu d\'un fichier (ex: cat fichier.txt)',
  clear: 'Efface l\'écran du terminal',
  whoami: 'Affiche l\'utilisateur actuel',
  ifconfig: 'Affiche la configuration réseau',
  nmap: 'Scanne le réseau (ex: nmap 192.168.1.0/24)',
  ssh: 'Connexion à distance (ex: ssh admin@192.168.1.100)',
  sudo: 'Exécute en tant qu\'administrateur',
  'sudo -l': 'Liste les permissions sudo'
};

export async function processCommand(
  command: string,
  currentDir: string,
  session: UserSession | null
): Promise<CommandResult> {
  const [cmd, ...args] = command.trim().split(/\s+/);
  const store = useGameStore.getState();

  // Gestion des commandes
  switch (cmd.toLowerCase()) {
    case 'help':
      return handleHelp(store);

    case 'clear':
      return { output: '__CLEAR__' };

    case 'whoami':
      return handleWhoami(store);

    case 'pwd':
      return { output: currentDir };

    case 'ls':
      return handleLs(currentDir, args, store);

    case 'cd':
      return handleCd(currentDir, args, store);

    case 'cat':
      return handleCat(currentDir, args, store);

    case 'ifconfig':
      return handleIfconfig(store);

    case 'nmap':
      return handleNmap(args, store);

    case 'ssh':
      return handleSsh(args, store);

    case 'sudo':
      return handleSudo(args, store);

    default:
      return {
        output: `❌ Commande inconnue: ${cmd}\n💡 Tapez 'help' pour voir les commandes disponibles`,
        error: true
      };
  }
}

// ========== COMMANDE HELP ==========
function handleHelp(store: ReturnType<typeof useGameStore.getState>): CommandResult {
  // Compléter objectif 1 si c'est la première commande
  if (store.currentObjective?.id === 1 && !store.completedObjectives.includes(1)) {
    store.completeObjective(1);
  }

  const output = `
╔═══════════════════════════════════════════════════════════╗
║              📖 COMMANDES DISPONIBLES                     ║
╚═══════════════════════════════════════════════════════════╝

${Object.entries(AVAILABLE_COMMANDS)
  .map(([cmd, desc]) => `  ${cmd.padEnd(15)} │ ${desc}`)
  .join('\n')}

─────────────────────────────────────────────────────────────
💡 Conseil: Commencez par 'ifconfig' pour voir votre IP
─────────────────────────────────────────────────────────────`;

  return { output };
}

// ========== COMMANDE WHOAMI ==========
function handleWhoami(store: ReturnType<typeof useGameStore.getState>): CommandResult {
  const isRoot = store.session?.progress?.hasRootAccess;
  
  // Compléter objectif 16 (vérifier identité après exploit)
  if (isRoot && store.currentObjective?.id === 16 && !store.completedObjectives.includes(16)) {
    store.completeObjective(16);
  }

  return { output: isRoot ? 'root' : (store.session?.username || 'hacker') };
}

// ========== COMMANDE LS ==========
function handleLs(currentDir: string, args: string[], store: ReturnType<typeof useGameStore.getState>): CommandResult {
  // Structure simplifiée des dossiers
  const directories: Record<string, string[]> = {
    '~': ['📁 Documents', '📁 Applications', '📁 tmp'],
    '/': ['📁 Documents', '📁 Applications', '📁 tmp'],
    '/Documents': ['📁 corporate', '📁 keys'],
    '/Documents/corporate': ['📄 employees.txt', '📄 README.txt'],
    '/Documents/keys': ['🔑 master.key'],
    '/tmp': ['⚡ exploit.sh'],
    '/root': ['🏆 mission_complete.txt']
  };

  // Compléter objectif 12 (lister fichiers après SSH)
  if (store.currentObjective?.id === 12 && !store.completedObjectives.includes(12)) {
    store.completeObjective(12);
  }

  // Compléter objectif 18 (lister fichiers dans /root)
  if (currentDir === '/root' && store.currentObjective?.id === 18 && !store.completedObjectives.includes(18)) {
    store.completeObjective(18);
  }

  const contents = directories[currentDir] || ['(dossier vide)'];
  return { output: contents.join('\n') };
}

// ========== COMMANDE CD ==========
function handleCd(currentDir: string, args: string[], store: ReturnType<typeof useGameStore.getState>): CommandResult {
  if (!args[0]) {
    return { output: '', newDirectory: '~' };
  }

  const target = args[0];
  let newDir = currentDir;

  if (target === '~' || target === '/') {
    newDir = '~';
  } else if (target === '..') {
    const parts = currentDir.split('/').filter(Boolean);
    parts.pop();
    newDir = parts.length > 0 ? '/' + parts.join('/') : '~';
  } else if (target.startsWith('/')) {
    newDir = target;
  } else {
    newDir = currentDir === '~' ? `/${target}` : `${currentDir}/${target}`;
  }

  // Compléter objectif 17 (accéder au dossier /root)
  if (newDir === '/root') {
    const isRoot = store.session?.progress?.hasRootAccess;
    if (isRoot) {
      if (store.currentObjective?.id === 17 && !store.completedObjectives.includes(17)) {
        store.completeObjective(17);
      }
    } else {
      return { output: '❌ Permission refusée. Vous devez être root.', error: true };
    }
  }

  return { output: `📂 ${newDir}`, newDirectory: newDir };
}

// ========== COMMANDE CAT ==========
function handleCat(currentDir: string, args: string[], store: ReturnType<typeof useGameStore.getState>): CommandResult {
  if (!args[0]) {
    return { output: '❌ Usage: cat <fichier>', error: true };
  }

  const filename = args[0];

  // Fichiers spéciaux
  if (filename === 'secret.txt') {
    // Compléter objectif 13 (lire fichier secret après SSH)
    if (store.currentObjective?.id === 13 && !store.completedObjectives.includes(13)) {
      store.completeObjective(13);
    }
    return {
      output: `╔═══════════════════════════════════════════════════════════╗
║                   📜 FICHIER SECRET                       ║
╚═══════════════════════════════════════════════════════════╝

Ce fichier contient des informations sensibles...

🔐 Pour obtenir les droits root:
   1. Tapez: sudo -l (pour voir vos permissions)
   2. Tapez: sudo /tmp/exploit.sh (pour devenir root)

─────────────────────────────────────────────────────────────`
    };
  }

  if (filename === 'mission_complete.txt') {
    // Compléter objectif 19 (lire le code de succès)
    if (store.currentObjective?.id === 19 && !store.completedObjectives.includes(19)) {
      store.completeObjective(19);
    }
    
    const session = store.session;
    const successCode = session?.successCode || `HACKER-2025-${Date.now().toString(36).toUpperCase()}`;
    
    // Stocker le code de succès via updateProgress
    if (session && !session.successCode) {
      store.updateProgress('successCode', successCode);
    }

    // Compléter objectif 20 (mission accomplie)
    setTimeout(() => {
      if (store.currentObjective?.id === 20 && !store.completedObjectives.includes(20)) {
        store.completeObjective(20);
      }
    }, 1000);

    return {
      output: `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           🎉🎉🎉 MISSION ACCOMPLIE! 🎉🎉🎉                ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   Agent: ${(session?.username || 'Hacker').padEnd(20)}                    ║
║                                                           ║
║   📋 VOTRE CODE DE SUCCÈS:                                ║
║                                                           ║
║   🔑 ${successCode.padEnd(40)}     ║
║                                                           ║
║   ✅ Félicitations! Vous avez terminé le scénario!       ║
║   📝 Présentez ce code pour valider votre réussite.      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`
    };
  }

  // Chercher dans le filesystem
  const filePath = filename.startsWith('/') ? filename : `${currentDir}/${filename}`;
  const file = findFileByPath(filePath);

  if (file && file.content) {
    return { output: file.content };
  }

  return { output: `❌ Fichier non trouvé: ${filename}`, error: true };
}

// ========== COMMANDE IFCONFIG ==========
function handleIfconfig(store: ReturnType<typeof useGameStore.getState>): CommandResult {
  // Compléter objectif 2
  if (store.currentObjective?.id === 2 && !store.completedObjectives.includes(2)) {
    store.completeObjective(2);
  }

  return {
    output: `
╔═══════════════════════════════════════════════════════════╗
║              🌐 CONFIGURATION RÉSEAU                      ║
╚═══════════════════════════════════════════════════════════╝

eth0: 
    📍 Adresse IP:     192.168.1.50
    📍 Masque:         255.255.255.0
    📍 Passerelle:     192.168.1.1

─────────────────────────────────────────────────────────────
💡 Prochaine étape: Scannez le réseau avec 'nmap 192.168.1.0/24'
─────────────────────────────────────────────────────────────`
  };
}

// ========== COMMANDE NMAP ==========
function handleNmap(args: string[], store: ReturnType<typeof useGameStore.getState>): CommandResult {
  const target = args[args.length - 1];
  
  if (!target) {
    return { output: '❌ Usage: nmap <cible>\n💡 Exemple: nmap 192.168.1.0/24', error: true };
  }

  // Scan réseau complet
  if (target === '192.168.1.0/24') {
    // Compléter objectif 3
    if (store.currentObjective?.id === 3 && !store.completedObjectives.includes(3)) {
      store.completeObjective(3);
    }

    return {
      output: `
╔═══════════════════════════════════════════════════════════╗
║              🔍 SCAN RÉSEAU - NMAP                        ║
╚═══════════════════════════════════════════════════════════╝

Scan en cours sur 192.168.1.0/24...

┌─────────────────┬────────────────────────┬────────┐
│ Adresse IP      │ Nom                    │ État   │
├─────────────────┼────────────────────────┼────────┤
│ 192.168.1.50    │ votre-machine          │ 🟢 UP  │
│ 192.168.1.100   │ 🎯 serveur-cible       │ 🟢 UP  │
│ 192.168.1.1     │ passerelle             │ 🟢 UP  │
└─────────────────┴────────────────────────┴────────┘

✅ Scan terminé - 3 machines trouvées

─────────────────────────────────────────────────────────────
💡 Le serveur cible est: 192.168.1.100
   Scannez ses ports: nmap -p 22,80,443 192.168.1.100
─────────────────────────────────────────────────────────────`
    };
  }

  // Scan de ports sur la cible
  if (target === '192.168.1.100' || args.join(' ').includes('192.168.1.100')) {
    // Compléter objectif 10
    if (store.currentObjective?.id === 10 && !store.completedObjectives.includes(10)) {
      store.completeObjective(10);
    }

    return {
      output: `
╔═══════════════════════════════════════════════════════════╗
║           🔍 SCAN PORTS - 192.168.1.100                   ║
╚═══════════════════════════════════════════════════════════╝

┌────────┬────────┬─────────────────────────────────┐
│ Port   │ État   │ Service                         │
├────────┼────────┼─────────────────────────────────┤
│ 22     │ 🟢 OPEN│ SSH (connexion sécurisée)       │
│ 80     │ 🟢 OPEN│ HTTP (site web)                 │
│ 443    │ 🟢 OPEN│ HTTPS (site web sécurisé)       │
└────────┴────────┴─────────────────────────────────┘

✅ Le port 22 (SSH) est ouvert!

─────────────────────────────────────────────────────────────
💡 Prochaine étape: ssh admin@192.168.1.100
   (utilisez le mot de passe trouvé: Admin2025!)
─────────────────────────────────────────────────────────────`
    };
  }

  return { output: `🔍 Scan de ${target}...\n❌ Aucune machine trouvée` };
}

// ========== COMMANDE SSH ==========
function handleSsh(args: string[], store: ReturnType<typeof useGameStore.getState>): CommandResult {
  const target = args[0];

  if (!target) {
    return { output: '❌ Usage: ssh utilisateur@serveur\n💡 Exemple: ssh admin@192.168.1.100', error: true };
  }

  if (target === 'admin@192.168.1.100') {
    // Compléter objectif 11
    if (store.currentObjective?.id === 11 && !store.completedObjectives.includes(11)) {
      store.completeObjective(11);
    }

    return {
      output: `
╔═══════════════════════════════════════════════════════════╗
║           🔌 CONNEXION SSH - 192.168.1.100                ║
╚═══════════════════════════════════════════════════════════╝

Connexion en cours...
Mot de passe: ********

✅ Connexion établie!

Bienvenue sur le serveur GEMINI CORP
Dernière connexion: ${new Date().toLocaleString()}

admin@serveur-cible:~$ 

─────────────────────────────────────────────────────────────
💡 Vous êtes connecté! Tapez 'ls -la' pour voir les fichiers
─────────────────────────────────────────────────────────────`
    };
  }

  return { output: `❌ Connexion refusée à ${target}`, error: true };
}

// ========== COMMANDE SUDO ==========
function handleSudo(args: string[], store: ReturnType<typeof useGameStore.getState>): CommandResult {
  const subCommand = args.join(' ');

  // sudo -l (lister permissions)
  if (subCommand === '-l') {
    // Compléter objectif 14
    if (store.currentObjective?.id === 14 && !store.completedObjectives.includes(14)) {
      store.completeObjective(14);
    }

    return {
      output: `
╔═══════════════════════════════════════════════════════════╗
║           🔒 PERMISSIONS SUDO                             ║
╚═══════════════════════════════════════════════════════════╝

L'utilisateur admin peut exécuter les commandes suivantes:
    (root) NOPASSWD: /tmp/exploit.sh

─────────────────────────────────────────────────────────────
💡 Vous pouvez exécuter: sudo /tmp/exploit.sh
   Cela vous donnera les droits root!
─────────────────────────────────────────────────────────────`
    };
  }

  // sudo /tmp/exploit.sh (élévation de privilèges)
  if (subCommand === '/tmp/exploit.sh' || subCommand.includes('exploit')) {
    // Compléter objectif 15
    if (store.currentObjective?.id === 15 && !store.completedObjectives.includes(15)) {
      store.completeObjective(15);
      store.updateProgress('hasRootAccess', true);
    }

    return {
      output: `
╔═══════════════════════════════════════════════════════════╗
║           ⚡ ÉLÉVATION DE PRIVILÈGES                      ║
╚═══════════════════════════════════════════════════════════╝

Exécution de /tmp/exploit.sh...

[▓▓▓▓▓▓▓▓▓▓] 100%

🔓 Exploitation réussie!
✅ Vous êtes maintenant ROOT!

root@serveur-cible:~#

─────────────────────────────────────────────────────────────
💡 Vérifiez avec 'whoami' - puis accédez à /root avec 'cd /root'
─────────────────────────────────────────────────────────────`
    };
  }

  return { output: '❌ sudo: commande non autorisée', error: true };
}
