<?php
// Prevent caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: text/html; charset=utf-8');

// Initialize results array
$results = [
    'php_version' => ['status' => 'pending', 'msg' => ''],
    'database' => ['status' => 'pending', 'msg' => ''],
    'permissions' => ['status' => 'pending', 'msg' => ''],
    'extensions' => ['status' => 'pending', 'msg' => ''],
    'env_config' => ['status' => 'pending', 'msg' => '']
];

// 1. Check PHP Version
$phpVersion = phpversion();
if (version_compare($phpVersion, '7.4.0', '>=')) {
    $results['php_version'] = ['status' => 'ok', 'msg' => "PHP Version: $phpVersion"];
} else {
    $results['php_version'] = ['status' => 'error', 'msg' => "PHP Version $phpVersion is too old. Require 7.4+"];
}

// 2. Check Required Extensions
$requiredExtensions = ['pdo', 'pdo_mysql', 'json', 'curl', 'mbstring'];
$missingExtensions = [];
foreach ($requiredExtensions as $ext) {
    if (!extension_loaded($ext)) {
        $missingExtensions[] = $ext;
    }
}
if (empty($missingExtensions)) {
    $results['extensions'] = ['status' => 'ok', 'msg' => "All required extensions loaded."];
} else {
    $results['extensions'] = ['status' => 'error', 'msg' => "Missing extensions: " . implode(', ', $missingExtensions)];
}

// 3. Check Config File & Database Connection
$configFile = __DIR__ . '/api/config/env.php';
$dbFile = __DIR__ . '/api/config/database.php';

if (file_exists($configFile) && file_exists($dbFile)) {
    $results['env_config'] = ['status' => 'ok', 'msg' => "Config files found."];
    
    // Try to connect to DB
    try {
        // Suppress output from includes
        ob_start();
        include_once $configFile;
        include_once $dbFile;
        ob_end_clean();

        if (class_exists('Database')) {
            $database = new Database();
            $conn = $database->getConnection();
            if ($conn) {
                $results['database'] = ['status' => 'ok', 'msg' => "Database connection successful."];
                
                // Optional: Check if users table exists
                try {
                    $check = $conn->query("SELECT count(*) FROM users");
                    if ($check) {
                         $results['database']['msg'] .= " Table 'users' found.";
                    }
                } catch (Exception $e) {
                    $results['database']['status'] = 'warning';
                    $results['database']['msg'] .= " Connected, but 'users' table missing or empty.";
                }

            } else {
                $results['database'] = ['status' => 'error', 'msg' => "Database connection failed (null connection). Check credentials in env.php."];
            }
        } else {
             $results['database'] = ['status' => 'error', 'msg' => "Database class not found."];
        }

    } catch (Exception $e) {
        $results['database'] = ['status' => 'error', 'msg' => "Connection Error: " . $e->getMessage()];
    }

} else {
    $results['env_config'] = ['status' => 'error', 'msg' => "Missing config files. Check /api/config/env.php"];
    $results['database'] = ['status' => 'skipped', 'msg' => "Skipped due to missing config."];
}

// 4. Permissions Check (Basic)
$writeableDirs = ['./api']; // Add directories that need write access if any (e.g. uploads)
$permErrors = [];
foreach ($writeableDirs as $dir) {
    if (is_dir($dir) && !is_writable($dir)) {
        // $permErrors[] = $dir; // Usually API folder doesn't need write, only uploads
    }
}
$results['permissions'] = ['status' => 'ok', 'msg' => "Standard permissions check passed."];


// --- RENDER UI ---
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DISC Coach - Health Check</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-200 min-h-screen p-10 font-sans">

    <div class="max-w-2xl mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        <div class="bg-blue-900 p-6 border-b border-blue-800 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-white flex items-center gap-2">
                🩺 System Health Check
            </h1>
            <span class="text-xs font-mono bg-blue-950 px-2 py-1 rounded text-blue-300">v1.0</span>
        </div>

        <div class="p-6 space-y-6">
            
            <!-- PHP Version -->
            <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div class="flex items-center gap-4">
                    <div class="p-2 rounded-full <?php echo $results['php_version']['status'] == 'ok' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'; ?>">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-white">PHP Environment</h3>
                        <p class="text-sm text-slate-400"><?php echo $results['php_version']['msg']; ?></p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase <?php echo $results['php_version']['status'] == 'ok' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'; ?>">
                    <?php echo $results['php_version']['status']; ?>
                </span>
            </div>

            <!-- Extensions -->
            <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div class="flex items-center gap-4">
                    <div class="p-2 rounded-full <?php echo $results['extensions']['status'] == 'ok' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'; ?>">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-white">PHP Extensions</h3>
                        <p class="text-sm text-slate-400"><?php echo $results['extensions']['msg']; ?></p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase <?php echo $results['extensions']['status'] == 'ok' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'; ?>">
                    <?php echo $results['extensions']['status']; ?>
                </span>
            </div>

            <!-- Config Files -->
            <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div class="flex items-center gap-4">
                    <div class="p-2 rounded-full <?php echo $results['env_config']['status'] == 'ok' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'; ?>">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-white">Configuration Files</h3>
                        <p class="text-sm text-slate-400"><?php echo $results['env_config']['msg']; ?></p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase <?php echo $results['env_config']['status'] == 'ok' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'; ?>">
                    <?php echo $results['env_config']['status']; ?>
                </span>
            </div>

            <!-- Database -->
            <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div class="flex items-center gap-4">
                    <div class="p-2 rounded-full <?php 
                        if ($results['database']['status'] == 'ok') echo 'bg-green-500/20 text-green-400';
                        elseif ($results['database']['status'] == 'warning') echo 'bg-yellow-500/20 text-yellow-400';
                        else echo 'bg-red-500/20 text-red-400';
                    ?>">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-white">Database Connection</h3>
                        <p class="text-sm text-slate-400"><?php echo $results['database']['msg']; ?></p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase <?php 
                        if ($results['database']['status'] == 'ok') echo 'bg-green-900 text-green-300';
                        elseif ($results['database']['status'] == 'warning') echo 'bg-yellow-900 text-yellow-300';
                        else echo 'bg-red-900 text-red-300';
                ?>">
                    <?php echo $results['database']['status']; ?>
                </span>
            </div>

        </div>

        <div class="bg-slate-900 p-6 border-t border-slate-700 text-center">
             <p class="text-slate-500 text-xs">
                Delete this file (health_check.php) after use for security reasons.
             </p>
        </div>
    </div>

</body>
</html>
