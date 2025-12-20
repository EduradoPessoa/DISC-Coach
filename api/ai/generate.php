<?php
include_once '../config/cors.php';
include_once '../config/env.php';

// Função de Log Simples
function logError($message) {
    $logFile = '../logs/ai_error.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->prompt)) {
    http_response_code(400);
    echo json_encode(["error" => "Prompt is required"]);
    exit;
}

$apiKey = GEMINI_API_KEY;

if ($apiKey === 'YOUR_GEMINI_API_KEY_HERE' || empty($apiKey)) {
    logError("API Key missing or default.");
    http_response_code(500);
    echo json_encode(["error" => "Configuration Error: API Key is missing in api/config/env.php"]);
    exit;
}

$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;

$requestBody = [
    "contents" => [
        [
            "parts" => [
                ["text" => ($data->systemInstruction ?? "") . "\n\n" . $data->prompt]
            ]
        ]
    ],
    "generationConfig" => [
        "temperature" => 0.7
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

// IMPORTANT FIX FOR XAMPP/LOCAL DEV: Disable SSL Verification
// In production, you should configure certificates correctly, but this solves the immediate local issue.
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    $errorMsg = curl_error($ch);
    logError("Curl Error: " . $errorMsg);
    http_response_code(500);
    echo json_encode(["error" => "Connection Error: " . $errorMsg]);
} else {
    if ($httpCode === 200) {
        $jsonResponse = json_decode($response, true);
        $text = $jsonResponse['candidates'][0]['content']['parts'][0]['text'] ?? "No text generated.";
        echo json_encode(["text" => $text]);
    } else {
        logError("Google API Error ($httpCode): " . $response);
        
        if ($httpCode === 429) {
            http_response_code(429);
            echo json_encode([
                "error" => "High Traffic: Free Tier Limit Reached",
                "message" => "We are experiencing high demand. Please try again in a few moments or upgrade to Pro for priority access."
            ]);
        } else {
            http_response_code($httpCode);
            // Tenta decodificar o erro do Google para mostrar algo mais amigável
            $googleError = json_decode($response, true);
            $friendlyError = $googleError['error']['message'] ?? "Unknown AI Error";
            echo json_encode(["error" => "AI Provider Error: " . $friendlyError]);
        }
    }
}

curl_close($ch);
?>
