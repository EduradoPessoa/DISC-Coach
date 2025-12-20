<?php
// Arquivo para atualizar a tabela users com colunas faltantes
// Upload para: public_html/api/update_users_table.php
// Acesso: https://disc.phoenyx.com.br/api/update_users_table.php

include_once 'config/cors.php';
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "<h2>Atualização de Estrutura da Tabela Users</h2>";

$columnsToAdd = [
    'tenant_id' => "INT NULL DEFAULT NULL AFTER id",
    'position' => "VARCHAR(100) NULL DEFAULT NULL",
    'department' => "VARCHAR(100) NULL DEFAULT NULL",
    'plan' => "VARCHAR(50) DEFAULT 'free'",
    'role' => "VARCHAR(20) DEFAULT 'user'"
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