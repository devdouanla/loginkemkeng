-- ========================================
-- Script de configuration pour PostgreSQL
-- ========================================

-- 1. Création de la base de données (si nécessaire)
-- CREATE DATABASE login;

-- 2. Connexion à la base de données
-- \c login;

-- 3. Création de la table utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('etudiant', 'vendeur', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 5. Création du trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Insertion de comptes de test (optionnel)
-- NOTE: Ces mots de passe sont hashés avec bcrypt
-- admin123 -> $2a$10$N9qo8uLOickgx2ZMRZoMye...
-- password123 -> $2a$10$N9qo8uLOickgx2ZMRZoMye...

-- Le compte admin sera créé automatiquement par l'application
-- Mais vous pouvez aussi le créer manuellement :
-- INSERT INTO users (email, password, role) 
-- VALUES ('admin@system.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdVxr7jGBzJQDw8wK5WwZsVqVqO6S', 'admin')
-- ON CONFLICT (email) DO NOTHING;

-- 7. Validation de la structure
\d users

-- 8. Test d'insertion (optionnel)
-- INSERT INTO users (email, password, role) 
-- VALUES ('test@example.com', 'temp_password', 'etudiant');

-- ========================================
-- INSTRUCTIONS POSTGRESQL :
-- ========================================

-- 1. Assurez-vous que PostgreSQL est installé et démarré
-- 2. Créez la base de données 'login' :
--    CREATE DATABASE login;
-- 3. Créez l'utilisateur 'postgres' avec le mot de passe 'douanla' :
--    CREATE USER postgres WITH PASSWORD 'douanla';
-- 4. Donnez les droits à l'utilisateur :
--    GRANT ALL PRIVILEGES ON DATABASE login TO postgres;
-- 5. Exécutez ce script dans la base de données :
--    psql -U postgres -d login -f setup-postgresql.sql

-- ========================================
-- CONNEXION APPLICATION :
-- ========================================

-- L'application utilisera la DATABASE_URL suivante :
-- postgresql://postgres:douanla@localhost:5432/login

-- Assurez-vous que PostgreSQL écoute sur localhost:5432
-- et que l'utilisateur 'postgres' a les droits nécessaires.
