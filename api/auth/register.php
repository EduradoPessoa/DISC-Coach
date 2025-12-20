<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->terms_accepted) &&
    $data->terms_accepted === true
) {
    // Verificar se email já existe
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $data->email);
    $checkStmt->execute();

    if($checkStmt->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(array("message" => "Email already registered."));
        exit;
    }

    // Hash da senha
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $query = "INSERT INTO users 
              (name, email, password_hash, role, plan, terms_accepted_at, terms_version) 
              VALUES 
              (:name, :email, :password_hash, 'user', 'free', NOW(), :terms_version)";

    $stmt = $db->prepare($query);

    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':password_hash', $password_hash);
    $termsVersion = 'v1.0'; // Poderia vir do config
    $stmt->bindParam(':terms_version', $termsVersion);

    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "User registered successfully."));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to register user."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data. Terms acceptance is required."));
}
?>