<?php

require 'connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getLinks($con);
        break;
    case 'POST':
        addLink($con);
        break;
    case 'DELETE':
        removeLink($con);
        break;
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
}


function getLinks($con) {
    $sql = "SELECT project_id, member_id FROM project_member_links";
    $result = mysqli_query($con, $sql);

    if ($result) {
        $links = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $links[] = $row;
        }
        echo json_encode(['data' => $links]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error fetching project-member links']);
    }
}


function addLink($con) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['project_id']) || !isset($data['member_id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing project_id or member_id']);
        return;
    }

    $project_id = mysqli_real_escape_string($con, $data['project_id']);
    $member_id = mysqli_real_escape_string($con, $data['member_id']);

    $sql = "INSERT INTO project_member_links (project_id, member_id) VALUES ('$project_id', '$member_id')";

    if (mysqli_query($con, $sql)) {
        echo json_encode(['message' => 'Project-Member link added successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error adding project-member link']);
    }
}


function removeLink($con) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['project_id']) || !isset($data['member_id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing project_id or member_id']);
        return;
    }

    $project_id = mysqli_real_escape_string($con, $data['project_id']);
    $member_id = mysqli_real_escape_string($con, $data['member_id']);

    $sql = "DELETE FROM project_member_links WHERE project_id = '$project_id' AND member_id = '$member_id'";

    if (mysqli_query($con, $sql)) {
        echo json_encode(['message' => 'Project-Member link removed successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error removing project-member link']);
    }
}

?>
