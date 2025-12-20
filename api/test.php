<?php
include_once 'config/cors.php';
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo json_encode(["status" => "ok", "message" => "API is working and DB Connected"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "API working but DB Connection Failed"]);
}
?>