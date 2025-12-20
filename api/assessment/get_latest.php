<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get user_id from query parameter
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

$query = "SELECT a.id, a.completed_at, r.d_score, r.i_score, r.s_score, r.c_score, r.ai_summary 
          FROM assessments a
          JOIN assessment_results r ON a.id = r.assessment_id
          WHERE a.user_id = :user_id AND a.status = 'completed'
          ORDER BY a.completed_at DESC
          LIMIT 1";

$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();

if($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Format response
    $result = array(
        "id" => $row['id'],
        "date" => $row['completed_at'],
        "scores" => array(
            "D" => floatval($row['d_score']),
            "I" => floatval($row['i_score']),
            "S" => floatval($row['s_score']),
            "C" => floatval($row['c_score'])
        ),
        "ai_summary" => $row['ai_summary']
    );

    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No completed assessment found."));
}
?>
