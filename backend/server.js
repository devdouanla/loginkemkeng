require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const db = require('./services/database');

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permet les requêtes cross-origin (React frontend)
app.use(express.json()); // Parse le corps des requêtes en JSON
app.use(express.urlencoded({ extended: true }));

// Middleware de logging simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes API
app.use('/api/auth', authRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Serveur d\'authentification opérationnel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée' 
  });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur' 
  });
});

// Démarrage du serveur avec initialisation de la base de données
async function startServer() {
  try {
    // Initialiser la base de données
    await db.initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
      console.log(`📡 API disponible: http://localhost:${PORT}/api`);
      console.log(`🔗 Santé du serveur: http://localhost:${PORT}/api/health`);
      console.log(`🗄️ Base de données: PostgreSQL`);
      console.log(`📊 DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurée' : 'Non configurée'}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
