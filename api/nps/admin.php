<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // List for Admin
    $query = "SELECT n.*, u.name as user_name FROM nps_feedback n JOIN users u ON n.user_id = u.id ORDER BY n.created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($method === 'POST') {
    // Moderate (Update Status)
    $data = json_decode(file_get_contents("php://input"));
    $query = "UPDATE nps_feedback SET status = :status, is_public = :is_public WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $data->status);
    $stmt->bindParam(':is_public', $data->is_public); // 1 or 0
    $stmt->bindParam(':id', $data->id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update"]);
    }
}
?>
