<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// TODO: Validate Admin Authentication (JWT)
// For now, assuming open for dev/demo or controlled via frontend routing

if ($method === 'GET') {
    $query = "SELECT setting_key, setting_value FROM settings";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $settings = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    
    echo json_encode($settings);
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->settings)) {
        foreach ($data->settings as $key => $value) {
            $query = "INSERT INTO settings (setting_key, setting_value) VALUES (:key, :value) 
                      ON DUPLICATE KEY UPDATE setting_value = :value";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':key', $key);
            $stmt->bindParam(':value', $value);
            $stmt->execute();
        }
        echo json_encode(["message" => "Settings updated successfully."]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "No settings data provided."]);
    }
}
?>
