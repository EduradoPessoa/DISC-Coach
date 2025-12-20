<?php
$is_localhost = ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1');

if ($is_localhost) {
    // XAMPP Default Credentials
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'disc_db');
    define('DB_USER', 'root');
    define('DB_PASS', ''); // XAMPP default is empty
    define('JWT_SECRET', 'local_dev_secret_key_123');
    define('GEMINI_API_KEY', 'AIzaSyBudOr7FrTg8l4-kM7BIAtafvrymEAzQ_k'); // Coloque sua chave aqui para testes locais
} else {
    // Production Credentials (Phoenyx)
    // Please update these with real values on the server
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'u225791063_disc'); // UPDATE ME
    define('DB_USER', 'u225791063_disc');    // UPDATE ME
    define('DB_PASS', 'c3[4d\-b3}oLxWm+'); // UPDATE ME
    define('JWT_SECRET', '9f3eC7aD8Kq2mZP@LxR#YVwT4H!bA6S$EJcM0UQeN'); // UPDATE ME
    define('GEMINI_API_KEY', 'AIzaSyBudOr7FrTg8l4-kM7BIAtafvrymEAzQ_k');
}
?>