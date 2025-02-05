# 🚀 Organisation du travail pour finir en 1 jour

## ✅ Répartition claire des tâches
- Travail en parallèle sur le front et le back
- Utilisation de GitHub pour éviter les conflits

## 🛠 1. Structure du projet
Le projet est composé de deux parties :
- **Front-end (React/Next.js)** → Interface et interactions des joueurs
- **Back-end (Node.js + Socket.io)** → Gestion des parties et des règles du jeu

## 📌 Organisation GitHub
Créer deux branches :
- `feature/front` → Dédiée au développement de l'UI
- `feature/back` → Dédiée à la logique serveur

Push & pull fréquemment pour éviter les conflits. Faire des commits clairs et courts. Fusionner dans `main` une fois stable.

## 👥 2. Répartition des tâches

### 🟢 Développeur 1 : Front-end (React / Next.js)
#### 📌 Objectifs :
- Créer l’interface principale (table de jeu, dés, actions)
- Connecter le front à Socket.io pour les mises à jour en temps réel
- Afficher les enchères et le chat

#### 🏗️ Tâches à faire (sur `feature/front`)
**Matin :**
- Initialiser le projet React/Next.js
- Mettre en place Tailwind CSS
- Créer la page d’accueil avec un bouton "Créer / Rejoindre une partie"

**Après-midi :**
- Écouter les événements WebSocket et mettre à jour l'UI en fonction des actions des joueurs
- Afficher les dés et les enchères en temps réel
- Ajouter un bouton "Dudo" pour contester une enchère

### 🟡 Développeur 2 : Back-end (Node.js / Socket.io)
#### 📌 Objectifs :
- Mettre en place le serveur Express + Socket.io
- Gérer la logique du jeu (dés, enchères, défis)
- Synchroniser les actions entre les joueurs

#### 🏗️ Tâches à faire (sur `feature/back`)
**Matin :**
- Initialiser un serveur Express avec Socket.io
- Gérer la connexion/déconnexion des joueurs
- Créer un modèle de partie (joueurs, dés, état du jeu)

**Après-midi :**
- Implémenter la gestion des dés et enchères
- Ajouter la vérification du bluff (Dudo)
- Envoyer les mises à jour aux clients via WebSocket

## 🔄 3. Fusionner et tester rapidement
**🕒 17h00 :** Merge des branches et tests ensemble
- Tester les interactions en multijoueur
- Corriger les derniers bugs
- Déployer sur Vercel (front) + Railway/Fly.io (back)