const { Pool } = require('pg');

/**
 * Service de connexion à la base de données PostgreSQL
 */
class DatabaseService {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  /**
   * Exécuter une requête SQL
   * @param {string} text - Requête SQL
   * @param {Array} params - Paramètres de la requête
   * @returns {Promise<Object>} - Résultat de la requête
   */
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Query executed', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  /**
   * Vérifier si un email existe déjà
   * @param {string} email - Email à vérifier
   * @returns {Promise<boolean>} - true si l'email existe
   */
  async checkEmailExists(email) {
    const text = 'SELECT id FROM users WHERE email = $1';
    const result = await this.query(text, [email]);
    return result.rows.length > 0;
  }

  /**
   * Créer un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} - Utilisateur créé
   */
  async createUser(userData) {
    const text = `
      INSERT INTO users (email, password, role) 
      VALUES ($1, $2, $3) 
      RETURNING id, email, role, created_at
    `;
    const values = [userData.email, userData.password, userData.role];
    const result = await this.query(text, values);
    return result.rows[0];
  }

  /**
   * Authentifier un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<Object|null>} - Utilisateur ou null
   */
  async getUserByEmail(email) {
    const text = 'SELECT id, email, password, role, created_at FROM users WHERE email = $1';
    const result = await this.query(text, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Initialiser la table users si elle n'existe pas
   */
  async initializeDatabase() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.query(createTableQuery);
      console.log('Table users vérifiée/créée avec succès');
      
      // Créer un admin par défaut s'il n'existe pas
      await this.createDefaultAdmin();
      
      // Créer un compte de test par défaut s'il n'existe pas
      await this.createTestUser();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base:', error);
    }
  }

  /**
   * Créer un compte admin par défaut
   */
  async createDefaultAdmin() {
    const adminEmail = 'admin@system.com';
    const adminExists = await this.checkEmailExists(adminEmail);
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await this.createUser({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Compte admin par défaut créé: admin@system.com / admin123');
    }
  }

  /**
   * Créer un compte de test par défaut
   */
  async createTestUser() {
    const testEmail = 'test@test.com';
    const testExists = await this.checkEmailExists(testEmail);
    
    if (!testExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Test123!', 10);
      
      await this.createUser({
        email: testEmail,
        password: hashedPassword,
        role: 'etudiant'
      });
      
      console.log('✅ Compte test par défaut créé: test@test.com / Test123!');
    }
  }

  /**
   * Fermer la connexion à la base de données
   */
  async close() {
    await this.pool.end();
  }
}

module.exports = new DatabaseService();
