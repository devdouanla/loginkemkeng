const db = require('./database');
const bcrypt = require('bcryptjs');

/**
 * Service de gestion des utilisateurs avec PostgreSQL
 * Remplace l'API Progress OpenEdge par une connexion directe PostgreSQL
 */
class UserService {
  /**
   * Vérifier si un email existe déjà dans la base
   * @param {string} email - Email à vérifier
   * @returns {Promise<boolean>} - true si l'email existe
   */
  async checkEmailExists(email) {
    try {
      return await db.checkEmailExists(email);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error.message);
      throw new Error('Impossible de vérifier l\'existence de l\'email');
    }
  }

  /**
   * Créer un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} - Utilisateur créé
   */
  async createUser(userData) {
    try {
      // Hasher le mot de passe avant de l'insérer
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const newUser = await db.createUser({
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });
      
      return newUser;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error.message);
      if (error.code === '23505') { // Violation de contrainte unique
        throw new Error('Cet email est déjà utilisé');
      }
      throw new Error('Impossible de créer l\'utilisateur');
    }
  }

  /**
   * Authentifier un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe en clair
   * @returns {Promise<Object|null>} - Utilisateur authentifié ou null
   */
  async authenticateUser(email, password) {
    try {
      const user = await db.getUserByEmail(email);
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
      
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error.message);
      throw error;
    }
  }

  /**
   * Récupérer un utilisateur par son email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<Object|null>} - Utilisateur ou null
   */
  async getUserByEmail(email) {
    try {
      const user = await db.getUserByEmail(email);
      
      if (!user) {
        return null;
      }
      
      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
      
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error.message);
      throw new Error('Impossible de récupérer l\'utilisateur');
    }
  }
}

module.exports = new UserService();
