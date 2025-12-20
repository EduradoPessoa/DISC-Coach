<?php
include_once '../config/cors.php';
include_once '../config/database.php';
include_once '../utils/JWT.php';

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

    // Buscar token válido
    $query = "SELECT id, user_id, expires_at FROM refresh_tokens WHERE token_hash = :hash AND revoked = 0 AND expires_at > NOW() LIMIT 0,1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':hash', $refreshTokenHash);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $tokenRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $userId = $tokenRow['user_id'];
        $tokenId = $tokenRow['id'];

        // Buscar dados atuais do usuário
        $userQuery = "SELECT id, email, role, plan, tenant_id FROM users WHERE id = :id";
        $userStmt = $db->prepare($userQuery);
        $userStmt->bindParam(':id', $userId);
        $userStmt->execute();
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        // Revogar token atual (Rotação)
        $revokeQuery = "UPDATE refresh_tokens SET revoked = 1 WHERE id = :id";
        $revokeStmt = $db->prepare($revokeQuery);
        $revokeStmt->bindParam(':id', $tokenId);
        $revokeStmt->execute();

        // Gerar novo Access Token
        $issuedAt = time();
        $expirationTime = $issuedAt + 900; // 15 min
        
        $payload = array(
            "sub" => $user['id'],
            "email" => $user['email'],
            "plano" => $user['plan'] ?? 'free',
            "role" => $user['role'] ?? 'user',
            "tenant_id" => $user['tenant_id'],
            "iat" => $issuedAt,
            "exp" => $expirationTime
        );

        $accessToken = JWT::encode($payload, JWT_SECRET);

        // Gerar novo Refresh Token
        $newRefreshToken = bin2hex(random_bytes(32));
        $newRefreshTokenHash = hash('sha256', $newRefreshToken);
        $newRefreshExpiresAt = date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60));

        // Salvar novo Refresh Token
        $insertQuery = "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (:user_id, :token_hash, :expires_at)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':user_id', $userId);
        $insertStmt->bindParam(':token_hash', $newRefreshTokenHash);
        $insertStmt->bindParam(':expires_at', $newRefreshExpiresAt);
        $insertStmt->execute();

        // Update Cookie
        setcookie("refreshToken", $newRefreshToken, [
            'expires' => time() + (30 * 24 * 60 * 60),
            'path' => '/',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);

        http_response_code(200);
        echo json_encode(array(
            "accessToken" => $accessToken,
            "refreshToken" => $newRefreshToken,
            "expiresIn" => 900
        ));

    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Invalid or expired refresh token."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Refresh token required."));
}
?>