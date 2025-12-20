<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();
$userId = $_GET['user_id'] ?? 0;

if (!$userId) {
    echo json_encode([]);
    exit;
}

// Fetch global (NULL) and user specific notifications
$query = "SELECT * FROM notifications WHERE (user_id IS NULL OR user_id = :user_id) AND created_at > DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $userId);
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
