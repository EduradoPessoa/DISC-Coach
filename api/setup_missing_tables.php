<?php
// Arquivo para criar tabelas que estão faltando
// Upload para: public_html/api/setup_missing_tables.php
// Acesso: https://disc.phoenyx.com.br/api/setup_missing_tables.php

include_once 'config/cors.php';
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "<h2>Verificação e Criação de Tabelas</h2>";

// 1. Tabela refresh_tokens (Faltando!)
echo "<h3>1. Verificando tabela 'refresh_tokens'...</h3>";
try {
    $check = $db->query("SELECT 1 FROM refresh_tokens LIMIT 1");
    echo "<p style='color:green'>Tabela já existe.</p>";
} catch (Exception $e) {
    echo "<p style='color:orange'>Tabela não encontrada. Criando...</p>";
    $sql = "CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token_hash VARCHAR(64) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX (token_hash)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    try {
        $db->exec($sql);
        echo "<p style='color:green'>✅ Tabela 'refresh_tokens' criada com sucesso!</p>";
    } catch (Exception $ex) {
        echo "<p style='color:red'>❌ Erro ao criar tabela: " . $ex->getMessage() . "</p>";
    }
}

// 2. Atualizar tabela users (Novos campos)
echo "<h3>2. Verificando colunas na tabela 'users'...</h3>";
try {
    // Tenta selecionar a coluna para ver se existe
    $db->query("SELECT terms_accepted_at FROM users LIMIT 1");
    echo "<p style='color:green'>Coluna 'terms_accepted_at' já existe.</p>";
} catch (Exception $e) {
    echo "<p style='color:orange'>Coluna 'terms_accepted_at' faltando. Adicionando...</p>";
    try {
        $db->exec("ALTER TABLE users ADD COLUMN terms_accepted_at DATETIME NULL DEFAULT NULL");
        $db->exec("ALTER TABLE users ADD COLUMN terms_version VARCHAR(20) NULL DEFAULT NULL");
        echo "<p style='color:green'>✅ Colunas adicionadas com sucesso!</p>";
    } catch (Exception $ex) {
        echo "<p style='color:red'>❌ Erro ao alterar tabela: " . $ex->getMessage() . "</p>";
    }
}

// 3. Tabela nps_feedback (Provavelmente faltando)
echo "<h3>3. Verificando tabela 'nps_feedback'...</h3>";
try {
    $check = $db->query("SELECT 1 FROM nps_feedback LIMIT 1");
    echo "<p style='color:green'>Tabela já existe.</p>";
} catch (Exception $e) {
    echo "<p style='color:orange'>Tabela não encontrada. Criando...</p>";
    $sql = "CREATE TABLE IF NOT EXISTS nps_feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        user_name VARCHAR(255) NULL,
        score INT NOT NULL,
        comment TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        is_public TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    try {
        $db->exec($sql);
        echo "<p style='color:green'>✅ Tabela 'nps_feedback' criada com sucesso!</p>";
    } catch (Exception $ex) {
        echo "<p style='color:red'>❌ Erro ao criar tabela: " . $ex->getMessage() . "</p>";
    }
}

echo "<hr><p><strong>Processo finalizado. Tente fazer login novamente.</strong></p>";
?>