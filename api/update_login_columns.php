<?php
// Arquivo para atualizar colunas de rastreamento de login na tabela users
// Upload para: public_html/api/update_login_columns.php
// Acesso: https://disc.phoenyx.com.br/api/update_login_columns.php

include_once 'config/cors.php';
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "<h2>Atualização de Colunas de Login</h2>";

$columnsToAdd = [
    'last_login_at' => "DATETIME NULL DEFAULT NULL",
    'last_login_ip' => "VARCHAR(45) NULL DEFAULT NULL"
];

foreach ($columnsToAdd as $column => $definition) {
    echo "<h3>Verificando coluna '$column'...</h3>";
    try {
        $db->query("SELECT $column FROM users LIMIT 1");
        echo "<p style='color:green'>✅ Coluna '$column' já existe.</p>";
    } catch (Exception $e) {
        echo "<p style='color:orange'>⚠️ Coluna '$column' não encontrada. Adicionando...</p>";
        try {
            $sql = "ALTER TABLE users ADD COLUMN $column $definition";
            $db->exec($sql);
            echo "<p style='color:green'>✅ Coluna '$column' criada com sucesso!</p>";
        } catch (Exception $ex) {
            echo "<p style='color:red'>❌ Erro ao criar coluna '$column': " . $ex->getMessage() . "</p>";
        }
    }
}

echo "<hr><p><strong>Processo finalizado. Tente fazer login novamente.</strong></p>";
?>