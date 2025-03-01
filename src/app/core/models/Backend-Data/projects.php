<?php
/**
 * Handles retrieving and inserting projects.
 */




require 'connect.php';
header("Content-Type: application/json; charset=UTF-8");


header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Bestätige Preflight-Anfrage
    exit;
}

// GET: Retrieve all projects
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $projects = [];
    $sql = "SELECT id, name, description, start_date, end_date FROM projects";

    if ($result = mysqli_query($con, $sql)) {
        while ($row = mysqli_fetch_assoc($result)) {
            $projects[] = [
                'id' => (int) $row['id'],
                'name' => $row['name'],
                'description' => $row['description'] ?? '',
                'start_date' => $row['start_date'] ?? null,
                'end_date' => $row['end_date'] ?? null,
            ];
        }
        echo json_encode(['data' => $projects], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed: " . mysqli_error($con)]);
    }
    exit;
}

// POST: Insert a new project
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['name']) || empty(trim($input['name']))) {
        http_response_code(400);
        echo json_encode(["error" => "Project name is required"]);
        exit;
    }

    $name = mysqli_real_escape_string($con, trim($input['name']));
    $description = isset($input['description']) ? mysqli_real_escape_string($con, trim($input['description'])) : null;
    $start_date = isset($input['start_date']) && !empty($input['start_date']) ? mysqli_real_escape_string($con, $input['start_date']) : null;
    $end_date = isset($input['end_date']) && !empty($input['end_date']) ? mysqli_real_escape_string($con, $input['end_date']) : null;

    if ($start_date === null) {
        http_response_code(400);
        echo json_encode(["error" => "start_date cannot be null"]);
        exit;
    }

    $sql = "INSERT INTO projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)";
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "ssss", $name, $description, $start_date, $end_date);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["message" => "Project added successfully", "id" => mysqli_insert_id($con)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Database insert failed: " . mysqli_error($con)]);
    }

    mysqli_stmt_close($stmt);
    exit;
}

// If the request method is not GET or POST, return a 405 error
http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
?>
