<?php
/**
 * Handles operations for project members.
 */
require 'connect.php';

header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); 
    exit;
}

// ✅ GET: Retrieve all project members
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $members = [];
    $sql = "SELECT id, name, email, password FROM project_members";

    if ($result = mysqli_query($con, $sql)) {
        while ($row = mysqli_fetch_assoc($result)) {
            $members[] = $row;
        }
        echo json_encode(['data' => $members]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "No members found"]);
    }
    exit;
}

// ✅ POST: Create a new project member
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['data']['name'], $input['data']['email'], $input['data']['password'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    $name = mysqli_real_escape_string($con, $input['data']['name']);
    $email = mysqli_real_escape_string($con, $input['data']['email']);
    $password = password_hash($input['data']['password'], PASSWORD_DEFAULT); 

    $sql = "INSERT INTO project_members (name, email, password) VALUES ('$name', '$email', '$password')";

    if (mysqli_query($con, $sql)) {
        echo json_encode(['data' => ['id' => mysqli_insert_id($con), 'name' => $name, 'email' => $email]]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to insert project member"]);
    }
    exit;
}

// ✅ PUT: Update an existing project member
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['data']['id'], $input['data']['name'], $input['data']['email'], $input['data']['password'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    $id = (int) $input['data']['id'];
    $name = mysqli_real_escape_string($con, $input['data']['name']);
    $email = mysqli_real_escape_string($con, $input['data']['email']);
    $password = password_hash($input['data']['password'], PASSWORD_DEFAULT); 

    $sql = "UPDATE project_members SET name='$name', email='$email', password='$password' WHERE id=$id";

    if (mysqli_query($con, $sql)) {
        echo json_encode(['data' => ['id' => $id, 'name' => $name, 'email' => $email]]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update project member"]);
    }
    exit;
}

// ✅ DELETE: Remove a project member
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing member ID"]);
        exit;
    }

    $id = (int) $input['id'];

    // Lösche zuerst alle Verknüpfungen dieses Mitglieds aus project_member_links
    $deleteLinksSql = "DELETE FROM project_member_links WHERE member_id = $id";
    mysqli_query($con, $deleteLinksSql);

    // Lösche das Mitglied aus project_members
    $deleteSql = "DELETE FROM project_members WHERE id = $id";

    if (mysqli_query($con, $deleteSql)) {
        echo json_encode(["message" => "Member deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete member"]);
    }
    exit;
}

// ❌ If the method is not allowed, return a 405 error
http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
?>
