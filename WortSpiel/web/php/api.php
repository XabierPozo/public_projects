<?php
/* 
++==========================================================++
|| api.php - API                                            ||
++==========================================================++
*/

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// DB Config
define('DB_HOST', 'WortSpiel_db'); 
define('DB_USER', 'user_wortspiel');
define('DB_PASS', '****');
define('DB_NAME', 'wortspiel_db');

function getDB() {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        die(json_encode(['success' => false, 'error' => 'Error de conexión: ' . $e->getMessage()]));
    }
}

$action = $_GET['action'] ?? 'pairs';
$count  = min((int)($_GET['count'] ?? 8), 20);

if ($action === 'pairs') {
    try {
        $db = getDB();
        $stmt = $db->prepare("SELECT id, aleman, espanol FROM verbos ORDER BY RAND() LIMIT :limit");
        $stmt->bindValue(':limit', $count, PDO::PARAM_INT);
        $stmt->execute();
        
        $pairs = $stmt->fetchAll();

        echo json_encode(['success' => true, 'pairs' => $pairs]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Acción no válida']);
}
