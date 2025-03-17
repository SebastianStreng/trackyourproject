<?php
require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// CORS Preflight-Check
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 🔧 **Direkte Datenbankverbindung (statt db.php)**
$host = "localhost"; 
$user = "root"; 
$pass = ""; // Falls dein MySQL ein Passwort hat, hier eintragen
$db_name = "trackyourproject"; 

$conn = mysqli_connect($host, $user, $pass, $db_name);

// Prüfen, ob die Verbindung erfolgreich ist
if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . mysqli_connect_error()]);
    exit;
}

// Eingehende JSON-Daten abrufen
$postdata = file_get_contents("php://input");

// JSON prüfen
if (!$postdata) {
    http_response_code(400);
    echo json_encode(['error' => 'No input data received']);
    exit;
}

$request = json_decode($postdata, true);

// Eingaben validieren
if (empty($request['email']) || empty($request['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

$email = mysqli_real_escape_string($conn, $request['email']);
$password = $request['password']; // Klartext-Passwort

// Benutzer in der Datenbank suchen
$sql = "SELECT * FROM project_members WHERE email = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($user = mysqli_fetch_assoc($result)) {
    // Passwort überprüfen
    if (password_verify($password, $user['password'])) {
        // Token generieren
        $token = generateToken($user);
        echo json_encode([
            'token' => $token,
            'user' => mapUser($user)
        ]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid password']);
        exit;
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

// Token generieren
function generateToken($user)
{
    $secretKey = 'your_secret_key'; // 🔒 Sicherstellen, dass dies geheim bleibt!
    $issuedAt = time();
    $expirationTime = $issuedAt + 3600; // Token läuft nach 1 Stunde ab
    $payload = [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'iat' => $issuedAt,
        'exp' => $expirationTime
    ];

    return JWT::encode($payload, $secretKey, 'HS256');
}

// Benutzer-Daten für das Frontend formatieren
function mapUser($user)
{
    return [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email']
    ];
}
?>
