-- ========================================
-- Script de configuration pour Progress OpenEdge
-- ========================================

-- 1. Création de la table utilisateurs
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Création des index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 3. Insertion du compte administrateur par défaut
-- Mot de passe : "admin123" (hashé avec bcrypt)
INSERT INTO users (id, email, password, role) 
VALUES (1, 'admin@system.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin');

-- 4. Insertion de comptes de test (optionnel)
-- Étudiant de test
INSERT INTO users (id, email, password, role) 
VALUES (2, 'etudiant@test.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'etudiant');

-- Vendeur de test
INSERT INTO users (id, email, password, role) 
VALUES (3, 'vendeur@test.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'vendeur');

-- 5. Validation des données insérées
SELECT * FROM users;

-- ========================================
-- NOTES IMPORTANTES :
-- ========================================

-- 1. Les mots de passe ci-dessus sont des exemples.
--    En production, utilisez des vrais hash bcrypt.

-- 2. Pour générer un hash bcrypt :
--    Node.js : require('bcrypt').hashSync('password', 10)

-- 3. Configuration PASOE requise :
--    - Démarrer PASOE sur le port 8810 (ou autre)
--    - Créer un service REST avec les endpoints :
--      * GET /users
--      * POST /users  
--      * POST /auth/login
--    - Configurer l'authentification de base

-- 4. Test de connexion :
--    Admin : admin@system.com / admin123
--    Étudiant : etudiant@test.com / password123
--    Vendeur : vendeur@test.com / password123
