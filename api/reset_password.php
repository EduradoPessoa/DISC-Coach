<?php
// Script para resetar senha manualmente
// Upload para: public_html/api/reset_password.php
// Acesso: https://disc.phoenyx.com.br/api/reset_password.php

include_once 'config/cors.php';
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

$email = "eduardo@phoenyx.com.br";
$novaSenha = "P3naBranc@";

echo "<h2>Reset de Senha Manual</h2>";

// Gerar novo hash seguro
$novoHash = password_hash($novaSenha, PASSWORD_DEFAULT);

try {
    // Verificar se usuário existe
    $check = $db->prepare("SELECT id FROM users WHERE email = :email");
    $check->bindParam(':email', $email);
    $check->execute();
    
    if ($check->rowCount() > 0) {
        // Atualizar senha
        $stmt = $db->prepare("UPDATE users SET password_hash = :hash WHERE email = :email");
        $stmt->bindParam(':hash', $novoHash);
        $stmt->bindParam(':email', $email);
        
        if ($stmt->execute()) {
            echo "<h3 style='color:green'>✅ Senha atualizada com sucesso!</h3>";
            echo "<p>Email: <strong>$email</strong></p>";
            echo "<p>Nova Senha: <strong>$novaSenha</strong></p>";
            echo "<p>Hash Gerado: " . substr($novoHash, 0, 20) . "...</p>";
        } else {
            echo "<h3 style='color:red'>❌ Erro ao atualizar no banco.</h3>";
        }
    } else {
        echo "<h3 style='color:orange'>⚠️ Usuário não encontrado: $email</h3>";
        
        // Criar usuário se não existir (Opcional)
        echo "<p>Tentando criar usuário...</p>";
        $insert = $db->prepare("INSERT INTO users (name, email, password_hash, role, plan, created_at) VALUES ('Eduardo', :email, :hash, 'admin', 'pro', NOW())");
        $insert->bindParam(':email', $email);
        $insert->bindParam(':hash', $novoHash);
        
        if ($insert->execute()) {
             echo "<h3 style='color:green'>✅ Usuário CRIADO com sucesso!</h3>";
        } else {
             echo "<h3 style='color:red'>❌ Erro ao criar usuário.</h3>";
        }
    }

} catch (Exception $e) {
    echo "<h3 style='color:red'>❌ Erro Fatal: " . $e->getMessage() . "</h3>";
}
?>