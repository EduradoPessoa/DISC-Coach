<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Public Testimonials (Approved and Public)
$query = "SELECT n.score, n.comment, u.name, u.position, u.avatar FROM nps_feedback n JOIN users u ON n.user_id = u.id WHERE n.status = 'approved' AND n.is_public = 1 ORDER BY n.created_at DESC LIMIT 6";
$stmt = $db->prepare($query);
$stmt->execute();
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
