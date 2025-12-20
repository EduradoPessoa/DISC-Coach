<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';

    $query = "SELECT id, name, email, plan, subscription_status as status, created_at as joined, role FROM users WHERE 1=1";
    
    if (!empty($search)) {
        $query .= " AND (name LIKE :search OR email LIKE :search)";
    }

    if ($filter !== 'all') {
        if ($filter === 'active') {
            $query .= " AND subscription_status = 'active'";
        } elseif ($filter === 'past_due') {
            $query .= " AND subscription_status = 'past_due'";
        } elseif ($filter === 'prospect') {
            // Assuming prospect means no plan or specific status
             $query .= " AND (plan = 'free' OR plan IS NULL)";
        }
    }

    $query .= " ORDER BY created_at DESC LIMIT 100";

    $stmt = $db->prepare($query);

    if (!empty($search)) {
        $searchTerm = "%{$search}%";
        $stmt->bindParam(':search', $searchTerm);
    }

    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);

} elseif ($method === 'POST') {
    // Update user plan
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->id) || !isset($data->plan)) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit();
    }

    // Optional: Update status as well if provided
    $statusUpdate = "";
    if (isset($data->status)) {
        $statusUpdate = ", subscription_status = :status";
    }

    $query = "UPDATE users SET plan = :plan" . $statusUpdate . " WHERE id = :id";
    $stmt = $db->prepare($query);

    $stmt->bindParam(':plan', $data->plan);
    $stmt->bindParam(':id', $data->id);
    
    if (isset($data->status)) {
        $stmt->bindParam(':status', $data->status);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update user"]);
    }
}
?>