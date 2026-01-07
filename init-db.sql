-- Fitness Challenge API - Script d'Initialisation de la Base de Données
-- Ce script crée toutes les tables nécessaires pour l'application

-- Activer l'extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Créer les types énumérés
DO $$ BEGIN
    CREATE TYPE role AS ENUM ('super_admin', 'gym_owner', 'client');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gym_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE challenge_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role role NOT NULL DEFAULT 'client',
    gym_id VARCHAR,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des salles de sport
CREATE TABLE IF NOT EXISTS gyms (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    owner_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    description TEXT,
    capacity INTEGER NOT NULL,
    image_url TEXT,
    status gym_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des équipements
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table d'association salles-équipements
CREATE TABLE IF NOT EXISTS gym_equipment (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    gym_id VARCHAR NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    equipment_id VARCHAR NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des exercices
CREATE TABLE IF NOT EXISTS exercises (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    target_muscles TEXT[] NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des défis
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    creator_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gym_id VARCHAR REFERENCES gyms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty difficulty NOT NULL,
    duration_days INTEGER NOT NULL,
    objectives JSONB NOT NULL,
    exercise_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    status challenge_status NOT NULL DEFAULT 'draft',
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    start_date TIMESTAMP
);

-- Table des participants aux défis
CREATE TABLE IF NOT EXISTS challenge_participants (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    challenge_id VARCHAR NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    progress INTEGER NOT NULL DEFAULT 0
);

-- Table des badges
CREATE TABLE IF NOT EXISTS badges (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    rules JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des badges obtenus par les utilisateurs
CREATE TABLE IF NOT EXISTS user_badges (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des séances d'entraînement
CREATE TABLE IF NOT EXISTS training_sessions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id VARCHAR REFERENCES challenges(id) ON DELETE SET NULL,
    calories_burned INTEGER,
    duration_minutes INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des exercices par séance
CREATE TABLE IF NOT EXISTS session_exercises (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id VARCHAR NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    exercise_id VARCHAR NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    repetitions INTEGER,
    rest_time_seconds INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des points des utilisateurs
CREATE TABLE IF NOT EXISTS user_points (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_points INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_gyms_owner_id ON gyms(owner_id);
CREATE INDEX IF NOT EXISTS idx_gyms_status ON gyms(status);
CREATE INDEX IF NOT EXISTS idx_challenges_creator_id ON challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_gym_id ON challenges(gym_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge_id ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_id ON challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_user_id ON training_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);

-- Insérer des données de test (optionnel)
-- Vous pouvez décommenter ces lignes pour avoir des données de test

-- INSERT INTO users (email, password, first_name, last_name, role) VALUES
-- ('admin@fitness.com', '$2b$10$YourHashedPasswordHere', 'Super', 'Admin', 'super_admin');

COMMENT ON TABLE users IS 'Table des utilisateurs avec 3 rôles: super_admin, gym_owner, client';
COMMENT ON TABLE gyms IS 'Table des salles de sport avec système d''approbation';
COMMENT ON TABLE equipment IS 'Table des équipements disponibles dans le système';
COMMENT ON TABLE gym_equipment IS 'Association entre salles et équipements avec quantité';
COMMENT ON TABLE exercises IS 'Table des types d''exercices avec muscles ciblés';
COMMENT ON TABLE challenges IS 'Table des défis d''entraînement avec objectifs JSON';
COMMENT ON TABLE challenge_participants IS 'Table de participation aux défis avec progression';
COMMENT ON TABLE badges IS 'Table des badges avec règles dynamiques en JSON';
COMMENT ON TABLE user_badges IS 'Table des badges obtenus par les utilisateurs';
COMMENT ON TABLE training_sessions IS 'Table des séances d''entraînement';
COMMENT ON TABLE session_exercises IS 'Table des exercices effectués par séance';
COMMENT ON TABLE user_points IS 'Table des points et classement des utilisateurs';
