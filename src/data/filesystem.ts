import { FileNode } from '@/types';

// Système de fichiers SIMPLIFIÉ pour le scénario débutant
export const FILE_SYSTEM: FileNode[] = [
  {
    id: 'root',
    name: 'MacOS HD',
    type: 'folder',
    path: '/',
    children: [
      {
        id: 'applications',
        name: 'Applications',
        type: 'folder',
        path: '/Applications',
        children: [
          {
            id: 'terminal',
            name: 'Terminal.app',
            type: 'file',
            path: '/Applications/Terminal.app'
          },
          {
            id: 'finder',
            name: 'Finder.app',
            type: 'file',
            path: '/Applications/Finder.app'
          }
        ]
      },
      {
        id: 'documents',
        name: 'Documents',
        type: 'folder',
        path: '/Documents',
        children: [
          {
            id: 'corporate',
            name: 'corporate',
            type: 'folder',
            path: '/Documents/corporate',
            children: [
              {
                id: 'employees',
                name: 'employees.txt',
                type: 'file',
                path: '/Documents/corporate/employees.txt',
                content: `╔═══════════════════════════════════════════════════════════╗
║     GEMINI CORP - LISTE DES EMPLOYÉS - CONFIDENTIEL       ║
╚═══════════════════════════════════════════════════════════╝

📋 DÉPARTEMENT IT:
─────────────────────────────────────────────────────────────
• Admin Système: admin
  📧 admin@geminicorp.com
  🔑 Mot de passe: Admin2025!
  
• IT Manager: Sarah Connor
  📧 sarah.connor@geminicorp.com

─────────────────────────────────────────────────────────────
💡 INDICE: Le compte "admin" a accès au serveur principal
   Adresse du serveur: 192.168.1.100
─────────────────────────────────────────────────────────────`
              },
              {
                id: 'readme',
                name: 'README.txt',
                type: 'file',
                path: '/Documents/corporate/README.txt',
                content: `📖 BIENVENUE DANS LE SCÉNARIO DE HACKING

Ce dossier contient des fichiers confidentiels de l'entreprise.

🎯 Votre objectif:
1. Trouver les identifiants dans employees.txt
2. Trouver la clé de déchiffrement dans /keys
3. Vous connecter au serveur 192.168.1.100

Bonne chance! 🍀`
              }
            ]
          },
          {
            id: 'keys',
            name: 'keys',
            type: 'folder',
            path: '/Documents/keys',
            children: [
              {
                id: 'master_key',
                name: 'master.key',
                type: 'file',
                path: '/Documents/keys/master.key',
                content: `╔═══════════════════════════════════════════════════════════╗
║              🔐 CLÉ DE DÉCHIFFREMENT AES256               ║
╚═══════════════════════════════════════════════════════════╝

Clé: C0rp0r@t3S3cr3t2025

─────────────────────────────────────────────────────────────
⚠️  Cette clé permet de déchiffrer les fichiers sensibles.
    Gardez-la précieusement pour le mini-jeu Caesar!
─────────────────────────────────────────────────────────────`
              }
            ]
          }
        ]
      },
      {
        id: 'tmp',
        name: 'tmp',
        type: 'folder',
        path: '/tmp',
        children: [
          {
            id: 'exploit',
            name: 'exploit.sh',
            type: 'file',
            path: '/tmp/exploit.sh',
            content: `#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  SCRIPT D'ÉLÉVATION DE PRIVILÈGES
# ═══════════════════════════════════════════════════════════
#
#  Ce script exploite une faille sudo pour devenir root.
#  
#  💡 Utilisation: sudo /tmp/exploit.sh
#
# ═══════════════════════════════════════════════════════════

echo "🔓 Exploitation en cours..."
echo "✅ Privilèges root obtenus!"
sudo su -`
          }
        ]
      }
    ]
  }
];

// Fonction pour trouver un fichier par son chemin
export function findFileByPath(path: string): FileNode | null {
  function search(nodes: FileNode[]): FileNode | null {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const found = search(node.children);
        if (found) return found;
      }
    }
    return null;
  }
  return search(FILE_SYSTEM);
}

// Fonction pour décrypter un fichier (gardée pour compatibilité)
export function decryptFile(content: string, key: string): string | null {
  if (key === 'C0rp0r@t3S3cr3t2025') {
    return `✅ FICHIER DÉCHIFFRÉ AVEC SUCCÈS!

Identifiants serveur 192.168.1.100:
───────────────────────────────────
Utilisateur: admin
Mot de passe: Admin2025!`;
  }
  return null;
}
