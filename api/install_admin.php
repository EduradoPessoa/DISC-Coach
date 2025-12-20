<?php
include_once 'config/cors.php';
include_once 'config/database.php';

// Apenas permitir execução via POST ou CLI para segurança básica
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && php_sapi_name() !== 'cli') {
    // Override JSON header from cors.php to HTML
    header("Content-Type: text/html; charset=UTF-8");
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Install SaaS Admin</title>
        <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; }
            .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
            input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px; }
            button { width: 100%; padding: 0.75rem; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
            button:hover { background: #4338ca; }
            h2 { margin-top: 0; color: #111827; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Create SaaS Admin</h2>
            <form method="POST">
                <label>Name</label>
                <input type="text" name="name" required placeholder="Admin Name">
                <label>Email</label>
                <input type="email" name="email" required placeholder="admin@phoenyx.com.br">
                <label>Password</label>
                <input type="password" name="password" required placeholder="********">
                <button type="submit">Create Admin User</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Database connection failed");
}

$name = $_POST['name'] ?? 'SaaS Admin';
$email = $_POST['email'] ?? 'admin@phoenyx.com.br';
$password = $_POST['password'] ?? 'password123';

// Check if user exists
$stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
$stmt->bindParam(':email', $email);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    echo "<div style='color: red; padding: 20px; background: white; border-radius: 8px; text-align: center;'>User already exists. Please delete this file manually.</div>";
    exit;
}

$password_hash = password_hash($password, PASSWORD_BCRYPT);
$role = 'saas_admin'; // Or 'admin' with special privileges
$plan = 'clevel'; // Top tier

$query = "INSERT INTO users (name, email, password_hash, role, plan, subscription_status, created_at) VALUES (:name, :email, :hash, :role, :plan, 'active', NOW())";
$stmt = $db->prepare($query);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':hash', $password_hash);
$stmt->bindParam(':role', $role);
$stmt->bindParam(':plan', $plan);

if ($stmt->execute()) {
    header("Content-Type: text/html; charset=UTF-8");
    echo "<div style='color: green; padding: 20px; background: white; border-radius: 8px; text-align: center; font-family: sans-serif;'>
            <h1>Success!</h1>
            <p>Admin user created successfully.</p>
            <p><strong>Email:</strong> $email</p>
            <p>Please delete this file (<code>api/install_admin.php</code>) immediately for security.</p>
            <a href='/'>Go to Login</a>
          </div>";
} else {
    echo "Error creating user: " . print_r($stmt->errorInfo(), true);
}
?>