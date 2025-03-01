<?php
/**
 * Handles operations for project members.
 */
require 'connect.php';

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
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['data']['name'];
    $email = $input['data']['email'];
    $password = $input['data']['password'];
    
    $sql = "INSERT INTO project_members (name, email, password) VALUES ('$name', '$email', '$password')";

    if (mysqli_query($con, $sql)) {
        echo json_encode(['data' => ['id' => mysqli_insert_id($con), 'name' => $name, 'email' => $email, 'password' => $password]]);
    } else {
        http_response_code(500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['data']['id'];
    $name = $input['data']['name'];
    $email = $input['data']['email'];
    $password = $input['data']['password'];
    
    $sql = "UPDATE project_members SET name='$name', email='$email', password='$password' WHERE id=$id";

    if (mysqli_query($con, $sql)) {
        echo json_encode(['data' => ['id' => $id, 'name' => $name, 'email' => $email, 'password' => $password]]);
    } else {
        http_response_code(500);
    }
}
