<?php
include_once '../config/cors.php';
include_once '../config/database.php';
include_once '../utils/JWT.php';

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

// Get Authorization Header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
$jwt = str_replace('Bearer ', '', $authHeader);

if ($jwt) {
    try {
        $decoded = JWT::decode($jwt, JWT_SECRET);
        $userId = $decoded->sub;

        if (!empty($userId)) {
            // Fields to update
            $name = $data->name ?? null;
            $position = $data->position ?? null;
            $department = $data->department ?? null;

            // Build query dynamically
            $updateFields = [];
            $params = [':id' => $userId];

            if ($name) {
                $updateFields[] = "name = :name";
                $params[':name'] = $name;
            }
            if ($position) {
                $updateFields[] = "position = :position";
                $params[':position'] = $position;
            }
            if ($department) {
                $updateFields[] = "department = :department";
                $params[':department'] = $department;
            }

            if (count($updateFields) > 0) {
                $query = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = :id";
                $stmt = $db->prepare($query);
                
                if ($stmt->execute($params)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Profile updated successfully."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to update profile."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "No fields to update."));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Access denied."));
        }
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(array("message" => "Access denied. " . $e->getMessage()));
    }
} else {
    http_response_code(401);
    echo json_encode(array("message" => "Access denied."));
}
?>