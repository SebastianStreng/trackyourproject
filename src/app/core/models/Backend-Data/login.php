<?php
require 'db.php'; // Datenbankverbindung sicherstellen
require __DIR__ . '/vendor/autoload.php';
use Firebase\JWT\JWT;

// Eingehende Daten abrufen
$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    // Überprüfe, ob E-Mail und Passwort gesetzt sind
    if (empty($request->email) || empty($request->password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        exit();
    }

    // Werte sichern
    $email = mysqli_real_escape_string($conn, $request->email);
    $password = mysqli_real_escape_string($conn, $request->password);

    // Benutzer in der Datenbank suchen
    $sql = "SELECT * FROM project_members WHERE email = '{$email}'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) === 1) {
        $user = mysqli_fetch_assoc($result);

        // Überprüfe das Passwort
        if (password_verify($password, $user['password'])) {
            // Token generieren
            $token = generateToken($user);
            echo json_encode(['token' => $token, 'user' => mapUser($user)]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid password']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email']);
    }
}

// Token generieren (angepasst für `project_members`)
function generateToken($user)
{
    $secretKey = 'your_secret_key'; 
    $issuedAt = time();
    $expirationTime = $issuedAt + 3600; // Token läuft nach 1 Stunde ab
    $payload = [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'iat' => $issuedAt,
        'exp' => $expirationTime
    ];

    return JWT::encode($payload, $secretKey, 'HS256');
}

// Benutzer-Daten für das Frontend formatieren
function mapUser($user) {
    return [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email']
    ];
}
?>
