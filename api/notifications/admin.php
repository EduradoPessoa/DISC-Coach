<?php
include_once '../config/cors.php';
include_once '../config/database.php';

// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 0);
error_reporting(E_ALL);

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input);

// Log incoming data for debugging
error_log("Notification Admin Input: " . $input);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON input"]);
    exit();
}

if ($data->action === 'create') {
    try {
        $query = "INSERT INTO notifications (user_id, type, message) VALUES (:user_id, :type, :message)";
        $stmt = $db->prepare($query);
        
        // Handle user_id: ensure it's NULL if empty or not numeric
        $userId = isset($data->user_id) && is_numeric($data->user_id) && $data->user_id > 0 ? $data->user_id : null;
        
        $stmt->bindValue(':user_id', $userId, $userId === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $stmt->bindValue(':type', $data->type);
        $stmt->bindValue(':message', $data->message);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            $errorInfo = $stmt->errorInfo();
            error_log("SQL Error: " . print_r($errorInfo, true));
            http_response_code(500);
            echo json_encode([
                "error" => "Failed to create notification", 
                "details" => $errorInfo[2] ?? "Unknown SQL error"
            ]);
        }
    } catch (Exception $e) {
        error_log("Exception: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Exception: " . $e->getMessage()]);
    }
} elseif ($data->action === 'list') {
    try {
        // List all for admin
        $query = "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50";
        $stmt = $db->prepare($query);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch notifications: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid action"]);
}
?>