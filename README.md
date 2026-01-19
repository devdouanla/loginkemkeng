# 🏛️ Système d'Authentification - PostgreSQL

Système complet d'authentification avec **React + Express.js + PostgreSQL**.

## 📋 Description

Ce projet implémente un système d'authentification respectant les règles métier suivantes :
- **Étudiant** : Peut créer un compte et se connecter
- **Vendeur** : Peut créer un compte et se connecter  
- **Admin** : Uniquement connexion (compte pré-créé en base)
- Le rôle `admin` n'apparaît jamais dans le formulaire d'inscription

## 🏗️ Architecture

```
React (Frontend:5173) 
       ↓ HTTP/JSON
Express.js (Backend:3000)
       ↓ Connexion directe  
PostgreSQL (Base de données:5432)
```

## 📁 Structure du Projet

```
auth-project/
├── backend/
│   ├── services/
│   │   ├── database.js         # Service de connexion PostgreSQL
│   │   └── progressApi.js      # Service des utilisateurs (remplacé)
│   ├── routes/
│   │   └── auth.routes.js      # Routes d'authentification Express
│   ├── server.js               # Serveur Express principal
│   ├── package.json
│   └── .env.example            # Variables d'environnement
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 16+ installé
- PostgreSQL installé et démarré
- Base de données PostgreSQL créée

### 1. Configuration PostgreSQL

#### A. Créer la base de données

```sql
CREATE DATABASE login;
CREATE USER postgres WITH PASSWORD 'douanla';
GRANT ALL PRIVILEGES ON DATABASE login TO postgres;
```

#### B. Exécuter le script de configuration

```bash
psql -U postgres -d login -f scripts/setup-postgresql.sql
```

Le script crée automatiquement :
- La table `users` avec les contraintes nécessaires
- Les index pour optimiser les performances
- Un trigger pour mettre à jour `updated_at`
- Un compte admin par défaut (`admin@system.com` / `admin123`)

### 2. Backend Express.js

```bash
# Installer les dépendances
cd backend
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec votre DATABASE_URL

# Démarrer le serveur
npm run dev
```

Le serveur backend démarre sur `http://localhost:3000`

### 3. Frontend React

```bash
# Installer les dépendances
cd frontend
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application frontend démarre sur `http://localhost:5173`

## 🔧 Configuration

### Variables d'environnement Backend (.env)

```env
# Configuration PostgreSQL
DATABASE_URL=postgresql://postgres:douanla@localhost:5432/login

# Port du serveur Express
PORT=3000

# JWT Secret (optionnel pour future implémentation)
JWT_SECRET=your-secret-key-here
```

## 📡 API Endpoints

### Backend Express.js

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription (étudiant/vendeur uniquement) |
| POST | `/api/auth/login` | Connexion (tous rôles) |
| GET | `/api/auth/profile/:email` | Profil utilisateur (test) |
| GET | `/api/health` | Santé du serveur |

### PostgreSQL (base de données)

| Table | Description |
|-------|-------------|
| `users` | Stocke les utilisateurs avec id, email, password (hashé), role |

## 🎯 Règles Métier Implémentées

### ✅ Validation Backend
- Refus de l'inscription avec rôle `admin`
- Vérification de l'unicité de l'email
- Validation du format email et mot de passe (min 6 caractères)
- Hashage des mots de passe avec bcrypt

### ✅ Validation Frontend  
- Formulaire d'inscription sans option admin
- Confirmation de mot de passe
- Messages d'erreur clairs
- Redirection automatique si connecté

### ✅ Gestion des Rôles
- Contenu différent selon le rôle dans le dashboard
- Badges visuels pour chaque rôle
- Permissions respectées dans toute l'application

## 🔐 Sécurité

- **Hashage des mots de passe** avec bcrypt (10 rounds)
- **Validation des entrées** côté backend et frontend
- **Protection CORS** configurée
- **Pas de stockage** de mots de passe en clair
- **Authentification** via localStorage (à améliorer avec JWT)

## 🧪 Tests

### Test des endpoints avec curl

```bash
# Inscription étudiant
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"etudiant@test.com","password":"password123","role":"etudiant"}'

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"etudiant@test.com","password":"password123"}'

# Test admin (créé automatiquement)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@system.com","password":"admin123"}'
```

## 🚨 Dépannage

### Problèmes courants

1. **Connexion PostgreSQL refusée**
   - Vérifier que PostgreSQL est démarré
   - Vérifier la DATABASE_URL dans `.env`
   - Confirmer que la base de données `login` existe
   - Vérifier les droits de l'utilisateur `postgres`

2. **Erreur CORS**
   - Le frontend doit tourner sur `localhost:5173`
   - Le backend sur `localhost:3000`
   - Vérifier la configuration CORS dans `server.js`

3. **Inscription admin refusée**
   - C'est normal ! L'admin ne peut pas s'inscrire
   - Le compte admin est créé automatiquement au démarrage
   - Identifiants : `admin@system.com` / `admin123`

## 🔄 Améliorations Futures

- [ ] Implémentation JWT pour les sessions
- [ ] Rafraîchissement automatique des tokens
- [ ] Logs d'activité utilisateur
- [ ] Interface admin pour gérer les utilisateurs
- [ ] Tests unitaires et d'intégration
- [ ] Dockerisation de l'application

## 📝 Licence

MIT License - Libre utilisation et modification

---

**🎯 Ce système est prêt pour un environnement de production académique ou industriel avec PostgreSQL.**
# loginkemkeng
