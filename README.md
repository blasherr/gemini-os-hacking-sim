# 🎮 GEMINI OS - Simulation de Hacking Immersive

## 📋 Description

GEMINI OS est une simulation interactive d'OS (style MacOS 2025) avec un scénario de hacking immersif de 20 minutes. Les utilisateurs doivent infiltrer un réseau d'entreprise, exploiter des vulnérabilités, déchiffrer des fichiers cryptés, et accomplir 20 objectifs pour obtenir leur code de succès.

## ✨ Fonctionnalités

### Pour les Utilisateurs (Agents)
- 🖥️ **Interface OS Réaliste** : Simulation complète d'un OS moderne avec fenêtres, terminal, gestionnaire de fichiers
- 🎯 **20 Objectifs Progressifs** : Scénario de hacking structuré (~20 minutes)
- 🔐 **Mini-Jeux Interactifs** :
  - Password Cracker (attaque par dictionnaire)
  - Cipher Decoder (déchiffrement Caesar/ROT13)
  - Binary Puzzle (conversion binaire→ASCII)
  - Port Scanner (reconnaissance réseau)
  - SSH Port Forwarding (bypass firewall)
- 💻 **Terminal Fonctionnel** : Commandes système réalistes (nmap, ssh, decrypt, etc.)
- 📁 **Système de Fichiers** : Exploration de dossiers avec fichiers cryptés
- 🎉 **Code de Succès Unique** : À la fin de la mission

### Pour les Owners/Admins
- 👥 **Panel Admin Temps Réel** : Surveillance de tous les utilisateurs actifs
- 📊 **Statistiques en Direct** : Progression, temps passé, objectifs complétés
- 💬 **Système de Notifications** : Envoyer des messages aux utilisateurs
- ⏭️ **Contrôles d'Aide** : Passer des objectifs, aider les utilisateurs
- 🔄 **Reset Sessions** : Réinitialiser les sessions utilisateurs
- 🗑️ **Suppression Sessions** : Supprimer définitivement des sessions
- ➕ **Création de Sessions** : Créer des comptes utilisateurs (simple ou en masse)

## 🚀 Flux d'Utilisation

### 1. Owner crée les comptes
1. Se connecter sur `/` avec les identifiants admin (bouton "Accès administrateur")
2. Accéder au Panel Owner
3. Créer les sessions utilisateurs (code d'agent)

### 2. Utilisateur se connecte
1. Aller sur `/`
2. Entrer son code d'agent
3. La simulation MacOS se lance automatiquement

### 3. Scénario de jeu
- Fenêtre Mission Briefing s'ouvre automatiquement
- Suivre les 20 objectifs progressivement
- Utiliser Terminal, Files, et Hacking Tools
- Obtenir le code de succès final

## 🔧 Installation

```bash
npm install
npm run dev
```

## 🔐 Identifiants Owner

- **Username**: `Blasher`
- **Password**: `123456`

(Modifiable dans `.env.local`)

## 📁 Structure du Projet

```
src/
├── app/              # Pages Next.js
│   ├── page.tsx      # Page principale (Login/Desktop)
│   └── owner/        # Panel Admin
├── components/       # Composants React
│   ├── Desktop.tsx   # Bureau principal
│   ├── Terminal.tsx  # Terminal interactif
│   ├── FileManager.tsx
│   ├── MissionBriefing.tsx
│   └── minigames/    # Mini-jeux
├── data/             # Données du jeu
│   ├── objectives.ts # 20 objectifs
│   └── filesystem.ts # Système de fichiers virtuel
├── lib/              # Utilitaires
│   ├── firebase.ts
│   ├── terminalCommands.ts
│   └── audioPlayer.ts
├── store/            # État global (Zustand)
│   └── gameStore.ts
└── types/            # Types TypeScript
    └── index.ts
```

## 🛠️ Technologies

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Firebase Firestore** - Base de données temps réel
- **Zustand** - Gestion d'état

## 📝 Les 20 Objectifs (Niveau Débutant)

### Partie 1 : Découverte (5 min)
1. 🖥️ Découverte du Terminal (commande `help`)
2. 🌐 Vérifier votre connexion (`ifconfig`)
3. 🔍 Scanner le réseau (`nmap`)

### Partie 2 : Exploration (5 min)
4. 📁 Explorer les fichiers (Gestionnaire)
5. 🔑 Trouver les identifiants (employees.txt)
6. 🔐 Trouver la clé secrète (master.key)

### Partie 3 : Mini-Jeux (5 min)
7. 🧩 Déchiffrer un message (Caesar ROT13)
8. 🔢 Puzzle binaire → Code: SECURE
9. 🔓 Password Cracker → Admin2025!

### Partie 4 : Connexion (5 min)
10. 🖧 Scanner les ports du serveur
11. 🔌 Se connecter en SSH
12. 📂 Lister les fichiers distants
13. 📖 Lire un fichier secret

### Partie 5 : Mission Finale (5 min)
14. ⬆️ Élévation de privilèges (`sudo -l`)
15. 🛠️ Utiliser l'exploit
16. 👤 Vérifier l'identité (`whoami`)
17. 📁 Accéder au dossier root
18. 🔍 Trouver le fichier final
19. 📜 Lire le code de succès
20. 🏆 Mission Accomplie !

## 🎨 Assets

- **Logo bleu**: `/public/assets/logo/logo_améliorer_bleu.png`
- **Audio**: `/public/assets/audio/` (fichiers mp3 optionnels)

## 📦 Déploiement

Le projet est optimisé pour Vercel:

```bash
npm run build
```

---

**Version**: 2.0.0  
**Durée estimée du scénario**: ~20 minutes (niveau débutant)
