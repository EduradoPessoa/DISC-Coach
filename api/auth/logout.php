<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

$refreshToken = null;
if (isset($_COOKIE['refreshToken'])) {
    $refreshToken = $_COOKIE['refreshToken'];
} elseif (!empty($data->refreshToken)) {
    $refreshToken = $data->refreshToken;
}

if($refreshToken) {
    $refreshTokenHash = hash('sha256', $refreshToken);

    // Revogar token
    $query = "UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = :hash";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':hash', $refreshTokenHash);
    
    if($stmt->execute()) {
        // Clear cookie
        setcookie("refreshToken", "", [
            'expires' => time() - 3600,
            'path' => '/',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        http_response_code(200);
        echo json_encode(array("message" => "Logged out successfully."));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Logout failed."));
    }
} else {
    // Se não enviou refresh token, assume logout do lado do cliente apenas (limpar storage)
    // Mas retorna 200 para não quebrar fluxo
    // Clear cookie anyway
    setcookie("refreshToken", "", [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    http_response_code(200);
    echo json_encode(array("message" => "Logged out (no server side revocation needed)."));
}
?>