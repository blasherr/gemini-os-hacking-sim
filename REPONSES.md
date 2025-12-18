# 📝 GUIDE COMPLET - SCÉNARIO HACKING GEMINI OS (Niveau Débutant)

## ⏱️ Durée estimée : 20 minutes

---

## 🎯 PARTIE 1 : DÉCOUVERTE (5 min)

### Étape 1 - Découverte du Terminal
1. Cliquez sur l'icône **Terminal** dans le dock en bas
2. Tapez la commande :
   ```bash
   help
   ```
3. Lisez la liste des commandes disponibles

---

### Étape 2 - Vérifier votre connexion
1. Tapez la commande :
   ```bash
   ifconfig
   ```
2. Notez votre adresse IP (ex: 192.168.1.50)

---

### Étape 3 - Scanner le réseau
1. Tapez la commande :
   ```bash
   nmap 192.168.1.0/24
   ```
2. Vous verrez la liste des machines sur le réseau
3. Notez l'adresse du serveur cible : **192.168.1.100**

---

## 📁 PARTIE 2 : EXPLORATION (5 min)

### Étape 4 - Explorer les fichiers
1. Cliquez sur l'icône **Fichiers** dans le dock
2. Double-cliquez sur le dossier **Documents**
3. Explorez les sous-dossiers

---

### Étape 5 - Trouver les identifiants
1. Allez dans **Documents → corporate**
2. Double-cliquez sur **employees.txt**
3. Vous trouverez : `admin` (nom d'utilisateur)

---

### Étape 6 - Trouver la clé secrète
1. Allez dans **Documents → keys**
2. Ouvrez **master.key**
3. **Clé à noter** : `C0rp0r@t3S3cr3t2025`

---

## 🧩 PARTIE 3 : MINI-JEUX (5 min)

### Étape 7 - Déchiffrer un message Caesar
1. Ouvrez les **Outils de Hacking** dans le dock
2. Sélectionnez **Décodeur Caesar**
3. **Réglage** : Décalage = **13** (ROT13)
4. **Message décodé** : `THE SECRET VAULT IS IN BUILDING B, ROOM 404`

---

### Étape 8 - Résoudre le puzzle binaire
1. Ouvrez le **Puzzle Binaire**
2. Convertissez les codes binaires :
   - `01010011` = S
   - `01000101` = E
   - `01000011` = C
   - `01010101` = U
   - `01010010` = R
   - `01000101` = E
3. **Code final** : `SECURE`

---

### Étape 9 - Cracker un mot de passe
1. Ouvrez le **Password Cracker**
2. Laissez l'outil travailler
3. **Mot de passe trouvé** : `Admin2025!`

---

## 🔌 PARTIE 4 : CONNEXION (5 min)

### Étape 10 - Scanner les ports
1. Retournez dans le Terminal
2. Tapez :
   ```bash
   nmap -p 22,80,443 192.168.1.100
   ```
3. Vous verrez les ports ouverts (22=SSH, 80=HTTP, 443=HTTPS)

---

### Étape 11 - Se connecter en SSH
1. Tapez :
   ```bash
   ssh admin@192.168.1.100
   ```
2. Mot de passe : `Admin2025!`

---

### Étape 12 - Lister les fichiers
1. Tapez :
   ```bash
   ls -la
   ```
2. Vous voyez tous les fichiers du serveur

---

### Étape 13 - Lire un fichier secret
1. Tapez :
   ```bash
   cat secret.txt
   ```
2. Notez les informations importantes

---

## 🏆 PARTIE 5 : MISSION FINALE (5 min)

### Étape 14 - Vérifier les privilèges
1. Tapez :
   ```bash
   sudo -l
   ```
2. Vous voyez les commandes autorisées

---

### Étape 15 - Utiliser l'exploit
1. Tapez :
   ```bash
   sudo /tmp/exploit.sh
   ```
2. Vous obtenez les droits root !

---

### Étape 16 - Vérifier l'identité
1. Tapez :
   ```bash
   whoami
   ```
2. Réponse attendue : `root`

---

### Étape 17 - Accéder au dossier root
1. Tapez :
   ```bash
   cd /root
   ```

---

### Étape 18 - Lister les fichiers
1. Tapez :
   ```bash
   ls
   ```
2. Vous voyez **mission_complete.txt**

---

### Étape 19 - Lire le code de succès
1. Tapez :
   ```bash
   cat mission_complete.txt
   ```
2. **Notez votre code de succès !**

---

### Étape 20 - Mission Accomplie ! 🎉
Félicitations ! Vous avez terminé le scénario de hacking.
Votre code est au format : `HACKER-2025-XXXX-XXXXX-XXXXXX`

---

## 📋 RÉCAPITULATIF RAPIDE DES COMMANDES

| Étape | Commande |
|-------|----------|
| 1 | `help` |
| 2 | `ifconfig` |
| 3 | `nmap 192.168.1.0/24` |
| 10 | `nmap -p 22,80,443 192.168.1.100` |
| 11 | `ssh admin@192.168.1.100` |
| 12 | `ls -la` |
| 13 | `cat secret.txt` |
| 14 | `sudo -l` |
| 15 | `sudo /tmp/exploit.sh` |
| 16 | `whoami` |
| 17 | `cd /root` |
| 18 | `ls` |
| 19 | `cat mission_complete.txt` |

---

## 🔑 MOTS DE PASSE & CODES IMPORTANTS

| Élément | Valeur |
|---------|--------|
| Clé AES256 | `C0rp0r@t3S3cr3t2025` |
| Mot de passe admin | `Admin2025!` |
| Décalage Caesar | `13` (ROT13) |
| Code binaire | `SECURE` |
| Message secret | `THE SECRET VAULT IS IN BUILDING B, ROOM 404` |

---

## 🧠 TESTS PSYCHOTECHNIQUES (11 jeux)

### Catégorie MÉMOIRE

#### 1. Memory Grid (Grille de Mémoire)
- **Description**: Mémoriser les cases illuminées et les reproduire
- **Durée**: 60 secondes
- **Niveaux**: 1-5 (grille 3x3 à 5x5)
- **Conseils**:
  - Se concentrer sur les patterns (lignes, diagonales)
  - Utiliser des repères visuels (coin, centre)
  - Nommer mentalement les positions

#### 2. Simon Game (Jeu de Simon)
- **Description**: Répéter des séquences de couleurs de plus en plus longues
- **Durée**: 60 secondes
- **Couleurs**: Rouge, Bleu, Vert, Jaune
- **Conseils**:
  - Associer des notes musicales aux couleurs
  - Répéter mentalement la séquence
  - Utiliser le rythme pour mémoriser

#### 3. Card Match (Cartes Mémoire)
- **Description**: Retrouver les paires de cartes identiques
- **Durée**: 60 secondes
- **Paires**: 8 paires à trouver
- **Conseils**:
  - Explorer d'abord systématiquement
  - Mémoriser les positions par zones
  - Ne pas cliquer au hasard

---

### Catégorie LOGIQUE

#### 4. Pattern Recognition (Suites Logiques)
- **Description**: Identifier le prochain nombre dans une suite
- **Durée**: 60 secondes
- **Types de suites**:
  - Arithmétiques (+n): 2, 5, 8, 11, **14**
  - Géométriques (×n): 2, 6, 18, 54, **162**
  - Fibonacci: 1, 1, 2, 3, 5, **8**
  - Carrés: 1, 4, 9, 16, **25**
  - Triangulaires: 1, 3, 6, 10, **15**
- **Conseils**:
  - Calculer les différences entre termes
  - Chercher des multiplications/divisions
  - Vérifier si c'est une suite connue

#### 5. Math Game (Calcul Mental)
- **Description**: Résoudre des opérations mathématiques rapidement
- **Durée**: 60 secondes
- **Opérations**: Addition, Soustraction, Multiplication, Division
- **Conseils**:
  - Commencer par les opérations simples
  - Arrondir puis ajuster pour les calculs complexes
  - Utiliser les tables de multiplication

---

### Catégorie ATTENTION

#### 6. Stroop Test
- **Description**: Identifier la COULEUR du texte (ignorer le mot écrit)
- **Durée**: 60 secondes
- **Exemple**: Le mot "BLEU" écrit en ROUGE → Réponse: ROUGE
- **Conseils**:
  - Se concentrer uniquement sur la couleur
  - Ignorer le sens du mot lu
  - Respirer et ne pas se précipiter

#### 7. Target Game (Cibles Mouvantes)
- **Description**: Cliquer sur les cibles qui apparaissent
- **Durée**: 60 secondes
- **Scoring**: Points selon rapidité et précision
- **Conseils**:
  - Garder le curseur au centre
  - Anticiper les mouvements
  - Viser le centre des cibles

---

### Catégorie VITESSE

#### 8. Reaction Time (Temps de Réaction)
- **Description**: Cliquer dès que l'écran change de couleur
- **Durée**: 10 essais
- **Score**: Temps de réaction moyen en ms
- **Objectif**: < 300ms = Excellent, < 400ms = Bon
- **Conseils**:
  - Maintenir le doigt prêt sur la souris
  - Se concentrer sur l'écran
  - Ne pas anticiper (pénalité si clic trop tôt)

#### 9. Typing Game (Frappe Rapide)
- **Description**: Taper les lettres affichées le plus vite possible
- **Durée**: 60 secondes
- **Scoring**: Lettres correctes par seconde
- **Conseils**:
  - Position correcte des doigts
  - Ne pas regarder le clavier
  - Maintenir un rythme régulier

---

### Catégorie SPATIAL

#### 10. Maze Game (Labyrinthe)
- **Description**: Naviguer du départ (🟢) à l'arrivée (🔴)
- **Durée**: 60 secondes
- **Niveaux**: 1-3 (taille croissante)
- **Contrôles**: Flèches directionnelles ou ZQSD
- **Conseils**:
  - Visualiser le chemin avant de bouger
  - Suivre un mur (main droite/gauche)
  - Ne pas faire marche arrière inutilement

#### 11. Rotation Game (Rotation Mentale)
- **Description**: Identifier si deux formes 3D sont identiques après rotation
- **Durée**: 60 secondes
- **Réponses**: "Identique" ou "Différent"
- **Conseils**:
  - Choisir un point de repère sur la forme
  - Imaginer la rotation mentalement
  - Compter les blocs si nécessaire

---

## 🎯 CODES DE SUCCÈS

### Scénario Hacking
- Format: `HACKER-2025-{USER_ID}-{TIMESTAMP}-{RANDOM}`
- Exemple: `HACKER-2025-JEAN-K8X9A-P2M7N`

### Tests Psychotechniques
- Format: `PSYCHO-{SCORE_GLOBAL}%-{TIMESTAMP}`
- Exemple: `PSYCHO-87%-X9K2M`

---

## 👨‍💼 ACCÈS OWNER/ADMIN

### Identifiants Panel Owner
- **URL**: `/owner` ou via bouton "Accès administrateur" sur la page de login
- **Username**: `admin`
- **Password**: `gemini2025`

### Fonctionnalités Owner
1. **Voir toutes les sessions** (en temps réel)
2. **Filtrer par type** (Scénario / Psychotest)
3. **Envoyer notifications** (texte, durée)
4. **Envoyer aide** (message d'assistance)
5. **Skip objectif/jeu** (passer une étape)
6. **Trigger screamer** (effet surprise)
7. **Supprimer session** (reset complet)

---

## 📊 BARÈME DE NOTATION PSYCHOTEST

| Score Global | Évaluation |
|--------------|------------|
| 90-100%      | Excellent  |
| 75-89%       | Très bien  |
| 60-74%       | Bien       |
| 45-59%       | Moyen      |
| 30-44%       | Faible     |
| < 30%        | Insuffisant|

### Calcul du Score
- Chaque jeu a un score sur 100%
- Score global = Moyenne des 11 jeux
- Les jeux "skippés" comptent comme 0%

---

## 🔧 COMMANDES TERMINAL UTILES

| Commande | Description |
|----------|-------------|
| `help` | Liste des commandes |
| `ifconfig` | Infos réseau |
| `nmap [IP]` | Scan réseau |
| `ssh user@host` | Connexion SSH |
| `cat [fichier]` | Lire fichier |
| `ls` | Lister fichiers |
| `cd [dossier]` | Changer dossier |
| `pwd` | Dossier actuel |
| `clear` | Effacer terminal |
| `sudo [cmd]` | Exécuter en admin |

---

## 📝 NOTES IMPORTANTES

1. **Sessions Firebase**: Chaque session est stockée dans Firestore avec un ID unique
2. **Auto-save**: La progression est sauvegardée automatiquement
3. **Reprise**: Un utilisateur peut reprendre sa session en se reconnectant
4. **Temps estimé**: ~20 min pour le scénario, ~15 min pour les psychotests
5. **Multi-utilisateurs**: Plusieurs sessions simultanées possibles

---

*Document généré pour GEMINI OS v2025.1*
*Projet MDT-FAN - Firebase*
