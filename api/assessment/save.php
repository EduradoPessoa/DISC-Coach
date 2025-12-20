<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->user_id) && !empty($data->scores)) {
    try {
        $db->beginTransaction();

        // 1. Create Assessment Record
        $query = "INSERT INTO assessments (user_id, status, completed_at) VALUES (:user_id, 'completed', NOW())";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->execute();
        $assessment_id = $db->lastInsertId();

        // 2. Save Results (Scores)
        $queryResults = "INSERT INTO assessment_results (assessment_id, d_score, i_score, s_score, c_score, ai_summary) 
                         VALUES (:assessment_id, :d, :i, :s, :c, :summary)";
        $stmtResults = $db->prepare($queryResults);
        $stmtResults->bindParam(':assessment_id', $assessment_id);
        $stmtResults->bindParam(':d', $data->scores->D);
        $stmtResults->bindParam(':i', $data->scores->I);
        $stmtResults->bindParam(':s', $data->scores->S);
        $stmtResults->bindParam(':c', $data->scores->C);
        $summary = $data->ai_summary ?? '';
        $stmtResults->bindParam(':summary', $summary);
        $stmtResults->execute();

        // 3. Save Answers (Optional, if sent)
        if (!empty($data->answers)) {
            $queryAnswers = "INSERT INTO assessment_answers (assessment_id, question_id, value) VALUES (:assessment_id, :question_id, :value)";
            $stmtAnswers = $db->prepare($queryAnswers);
            
            foreach($data->answers as $answer) {
                $stmtAnswers->bindParam(':assessment_id', $assessment_id);
                $stmtAnswers->bindParam(':question_id', $answer->questionId);
                $stmtAnswers->bindParam(':value', $answer->value);
                $stmtAnswers->execute();
            }
        }

        $db->commit();

        http_response_code(201);
        echo json_encode(array("message" => "Assessment saved successfully.", "id" => $assessment_id));

    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(array("message" => "Failed to save assessment.", "error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data."));
}
?>
