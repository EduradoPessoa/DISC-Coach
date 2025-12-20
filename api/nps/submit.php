<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->score) || !isset($data->user_id)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing data"]);
    exit;
}

$query = "INSERT INTO nps_feedback (user_id, score, comment) VALUES (:user_id, :score, :comment)";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $data->user_id);
$stmt->bindParam(':score', $data->score);
$stmt->bindParam(':comment', $data->comment);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to submit NPS"]);
}
?>
