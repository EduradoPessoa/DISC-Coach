<?php
include_once 'config/cors.php';
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die(json_encode(["error" => "Database connection failed"]));
}

$sql = "
-- Atualização da tabela Users
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) DEFAULT NULL AFTER id;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_version VARCHAR(20) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45) DEFAULT NULL;

-- Tabela de Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(64) NOT NULL, -- SHA256 do token
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (token_hash)
);
";

try {
    // Executar múltiplas queries pode exigir configuração específica no PDO dependendo do driver
    // Vamos dividir
    $statements = explode(";", $sql);
    foreach($statements as $stmt) {
        if(trim($stmt) != "") {
            $db->exec($stmt);
        }
    }
    echo json_encode(["success" => true, "message" => "Auth database updated successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Migration failed", "details" => $e->getMessage()]);
}
?>