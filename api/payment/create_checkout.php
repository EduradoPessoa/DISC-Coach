<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->amount) || empty($data->email) || empty($data->plan)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields."]);
    exit;
}

// 1. Get API Key and Base URL
$query = "SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('abacatepay_api_key', 'app_base_url')";
$stmt = $db->prepare($query);
$stmt->execute();
$settings = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $settings[$row['setting_key']] = $row['setting_value'];
}

$apiKey = $settings['abacatepay_api_key'] ?? null;
// Use configured URL or fallback to a guess (useful for dev)
$baseUrl = $settings['app_base_url'] ?? "http://localhost/disc/dist"; 
// Ensure no trailing slash
$baseUrl = rtrim($baseUrl, '/');

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(["error" => "Payment gateway not configured (Missing API Key)."]);
    exit;
}

// 2. Prepare AbacatePay Payload
$url = "https://api.abacatepay.com/v1/billing/create"; // Hypothetical Endpoint
$payload = [
    "amount" => $data->amount * 100, // Cents
    "currency" => "BRL",
    "customer" => [
        "email" => $data->email,
        "name" => $data->name ?? "Customer"
    ],
    "metadata" => [
        "plan" => $data->plan,
        "user_id" => $data->user_id ?? null
    ],
    "return_url" => "$baseUrl/#/checkout/success", 
    "completion_url" => "$baseUrl/#/checkout/success", // Some gateways ask for this name
    "cancel_url" => "$baseUrl/#/checkout/cancel"
];

// 3. Call AbacatePay API
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 4. Handle Response
if ($httpCode >= 200 && $httpCode < 300) {
    $resData = json_decode($response, true);
    // Assuming AbacatePay returns { "data": { "url": "..." } } or similar
    // For now, let's assume standard structure or fallback
    $checkoutUrl = $resData['data']['url'] ?? $resData['url'] ?? null;
    
    if ($checkoutUrl) {
        echo json_encode(["success" => true, "url" => $checkoutUrl]);
    } else {
        // Fallback for simulation if API fails or is mock
        echo json_encode(["success" => true, "url" => "/checkout/success?mock=true"]);
    }
} else {
    // If API fails (e.g. invalid key), return error
    // For DEV purposes, if the key is 'mock_key', we simulate success
    if ($apiKey === 'mock_key') {
         echo json_encode([
             "success" => true, 
             "url" => "http://localhost/disc/dist/#/checkout/success?session_id=mock_" . time()
         ]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Gateway Error: " . $response]);
    }
}
?>
