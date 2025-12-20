<?php
// Arquivo de teste de conexão isolado
// Upload para: public_html/api/test_connection.php
// Acesso: https://disc.phoenyx.com.br/api/test_connection.php

header('Content-Type: text/html; charset=utf-8');

$host = 'localhost';
$db   = 'u225791063_disc';
$user = 'u225791063_disc';
$pass = 'c3[4d\-b3}oLxWm+'; // Senha exata como fornecida

echo "<h2>Teste de Conexão com Banco de Dados</h2>";
echo "<p><strong>Host:</strong> $host</p>";
echo "<p><strong>Banco:</strong> $db</p>";
echo "<p><strong>Usuário:</strong> $user</p>";
echo "<p><strong>Senha (exibição):</strong> " . htmlspecialchars($pass) . "</p>";

echo "<hr>";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<h3 style='color: green;'>✅ SUCESSO! Conexão estabelecida.</h3>";
    
    // Teste extra: listar tabelas
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<p>Tabelas encontradas no banco:</p><ul>";
    if (empty($tables)) {
        echo "<li><em>Nenhuma tabela encontrada (banco vazio?)</em></li>";
    } else {
        foreach ($tables as $table) {
            echo "<li>$table</li>";
        }
    }
    echo "</ul>";

} catch (PDOException $e) {
    echo "<h3 style='color: red;'>❌ ERRO NA CONEXÃO</h3>";
    echo "<p>Mensagem do erro: <strong>" . $e->getMessage() . "</strong></p>";
    
    echo "<hr>";
    echo "<p><em>Dica: Verifique se a senha contém caracteres especiais que precisam de escape ou se o usuário tem permissão de acesso a este banco.</em></p>";
}
?>