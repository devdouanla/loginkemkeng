const express = require('express');
const bcrypt = require('bcryptjs');
const userService = require('../services/progressApi');

const router = express.Router();

/**
 * Middleware de validation pour l'inscription
 */
const validateRegistration = (req, res, next) => {
  const { email, password, role } = req.body;
  
  // Validation des champs requis
  if (!email || !password || !role) {
    return res.status(400).json({ 
      error: 'Tous les champs sont requis' 
    });
  }
  
  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Format d\'email invalide' 
    });
  }
  
  // Validation du mot de passe avec standards de sécurité
  const passwordErrors = [];
  
  if (password.length < 8) {
    passwordErrors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    passwordErrors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    passwordErrors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/[0-9]/.test(password)) {
    passwordErrors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    passwordErrors.push('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)');
  }
  
  if (passwordErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Mot de passe non sécurisé',
      details: passwordErrors,
      password_received: password // Afficher le mot de passe en clair pour débogage
    });
  }
  
  // RÈGLE MÉTIER: L'admin ne peut pas s'inscrire
  if (role === 'admin') {
    return res.status(403).json({ 
      error: 'Le rôle administrateur ne peut pas être créé via inscription' 
    });
  }
  
  // Validation des rôles autorisés pour l'inscription
  const allowedRoles = ['etudiant', 'vendeur'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ 
      error: 'Rôle non valide. Rôles autorisés: étudiant, vendeur' 
    });
  }
  
  next();
};

/**
 * Middleware de validation pour la connexion
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email et mot de passe sont requis' 
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Format d\'email invalide' 
    });
  }
  
  next();
};

/**
 * POST /register
 * Inscription d'un nouvel utilisateur (étudiant ou vendeur uniquement)
 */
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    console.log('🔍 TENTATIVE D\'INSCRIPTION:', {
      email: email,
      password_en_clair: password, // Afficher le mot de passe en clair pour débogage
      role: role,
      timestamp: new Date().toISOString()
    });
    
    // Vérifier si l'email existe déjà via la base de données
    const emailExists = await userService.checkEmailExists(email);
    if (emailExists) {
      return res.status(409).json({ 
        error: 'Cet email est déjà utilisé',
        email_tested: email
      });
    }
    
    // Créer l'utilisateur via le service
    const newUser = await userService.createUser({
      email,
      password,
      role
    });
    
    console.log('✅ INSCRIPTION RÉUSSIE:', {
      email: email,
      user_id: newUser.id,
      role: newUser.role
    });
    
    // Retourner l'utilisateur créé sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('❌ ERREUR INSCRIPTION:', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: error.message || 'Erreur lors de l\'inscription' 
    });
  }
});

/**
 * POST /login
 * Connexion d'un utilisateur (tous rôles autorisés)
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 TENTATIVE DE CONNEXION:', {
      email: email,
      password_en_clair: password, // Afficher le mot de passe en clair pour débogage
      timestamp: new Date().toISOString()
    });
    
    // Tenter d'authentifier l'utilisateur via la base de données
    const user = await userService.authenticateUser(email, password);
    
    if (!user) {
      console.log('❌ CONNEXION ÉCHOUÉE:', {
        email: email,
        reason: 'Email ou mot de passe incorrect',
        password_tested: password
      });
      return res.status(401).json({ 
        error: 'Email ou mot de passe incorrect',
        email_tested: email,
        password_tested: password // Afficher le mot de passe testé
      });
    }
    
    console.log('✅ CONNEXION RÉUSSIE:', {
      email: email,
      user_id: user.id,
      role: user.role
    });
    
    // Retourner les informations de l'utilisateur (sans mot de passe)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Connexion réussie',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('❌ ERREUR CONNEXION:', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    res.status(401).json({ 
      error: error.message || 'Email ou mot de passe incorrect' 
    });
  }
});

/**
 * GET /profile/:email
 * Récupérer le profil d'un utilisateur (pour test)
 */
router.get('/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Utilisateur non trouvé' 
      });
    }
    
    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération du profil' 
    });
  }
});

module.exports = router;
