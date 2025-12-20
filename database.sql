-- Banco de Dados para Disc Coach Level C
-- Compatível com MySQL 8.0+ / MariaDB

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    position VARCHAR(255),
    department VARCHAR(255),
    plan ENUM('free', 'pro') DEFAULT 'free',
    subscription_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('in_progress', 'completed') DEFAULT 'in_progress',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessment_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    value INT NOT NULL,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessment_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    d_score DECIMAL(5,2),
    i_score DECIMAL(5,2),
    s_score DECIMAL(5,2),
    c_score DECIMAL(5,2),
    ai_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Nullable to allow SET NULL on delete
    provider VARCHAR(50) NOT NULL, -- 'abacatepay', 'stripe'
    transaction_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insere um usuário Admin padrão
-- Senha: password123 (O hash abaixo é um exemplo, você deve gerar um novo hash bcrypt para produção)
-- INSERT INTO users (name, email, password_hash, role, plan) VALUES 
-- ('Admin User', 'admin@disc.com', '$2y$10$YourHashHere...', 'admin', 'pro');
