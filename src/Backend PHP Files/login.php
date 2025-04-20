<?php
require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


$host = "localhost"; 
$user = "root"; 
$pass = ""; 
$db_name = "trackyourproject"; 

$conn = mysqli_connect($host, $user, $pass, $db_name);

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . mysqli_connect_error()]);
    exit;
}

$postdata = file_get_contents("php://input");

if (!$postdata) {
    http_response_code(400);
    echo json_encode(['error' => 'No input data received']);
    exit;
}

$request = json_decode($postdata, true);

if (empty($request['email']) || empty($request['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

$email = mysqli_real_escape_string($conn, $request['email']);
$password = $request['password']; 

$sql = "SELECT * FROM project_members WHERE email = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($user = mysqli_fetch_assoc($result)) {
    if (password_verify($password, $user['password'])) {

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

function generateToken($user)
{
    $secretKey = 'your_secret_key'; 
    $issuedAt = time();
    $expirationTime = $issuedAt + 3600; 
    $payload = [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'iat' => $issuedAt,
        'exp' => $expirationTime
    ];

    return JWT::encode($payload, $secretKey, 'HS256');
}

function mapUser($user)
{
    return [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email']
    ];
}
?>
