<?php
include_once 'config/cors.php';
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

// Check if user 1 exists
$query = "SELECT id FROM users WHERE id = 1";
$stmt = $db->prepare($query);
$stmt->execute();

if ($stmt->rowCount() == 0) {
    // Insert default user
    $queryInsert = "INSERT INTO users (id, name, email, password_hash, role, plan) 
                    VALUES (1, 'Eduardo Pessoa', 'eduardo@phoenyx.com.br', '$2y$10$DefaultHashForDev', 'admin', 'pro')";
    $stmtInsert = $db->prepare($queryInsert);
    if($stmtInsert->execute()) {
        echo json_encode(["message" => "Default User (ID 1) created successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to create default user."]);
    }
} else {
    echo json_encode(["message" => "Default User (ID 1) already exists."]);
}
?>
