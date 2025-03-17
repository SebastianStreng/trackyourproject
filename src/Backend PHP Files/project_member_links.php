<?php
/**
 * Handles retrieving, inserting, updating, and deleting project-member links.
 */

require 'connect.php';
header("Content-Type: application/json; charset=UTF-8");

// Allow CORS
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// ✅ GET: Retrieve all project-member links
if ($method === 'GET') {
    $links = [];
    $sql = "SELECT project_id, member_id FROM project_member_links";

    if ($result = mysqli_query($con, $sql)) {
        while ($row = mysqli_fetch_assoc($result)) {
            $links[] = [
                'project_id' => (int) $row['project_id'],
                'member_id' => (int) $row['member_id']
            ];
        }
        echo json_encode(['data' => $links], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed: " . mysqli_error($con)]);
    }
    exit;
}

// ✅ POST: Insert a new project-member link
if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['project_id']) || !isset($input['member_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "project_id and member_id are required"]);
        exit;
    }

    $project_id = (int) $input['project_id'];
    $member_id = (int) $input['member_id'];

    $sql = "INSERT INTO project_member_links (project_id, member_id) VALUES (?, ?)";
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $project_id, $member_id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["message" => "Project-Member link added successfully", "id" => mysqli_insert_id($con)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Database insert failed: " . mysqli_error($con)]);
    }

    mysqli_stmt_close($stmt);
    exit;
}

// ✅ PUT: Update project-member links for a project
if ($method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['project_id']) || !isset($input['member_ids']) || !is_array($input['member_ids'])) {
        http_response_code(400);
        echo json_encode(["error" => "project_id and member_ids (array) are required"]);
        exit;
    }

    $project_id = (int) $input['project_id'];
    $member_ids = array_map('intval', $input['member_ids']);

    // Retrieve existing member links for the project
    $existingLinks = [];
    $result = mysqli_query($con, "SELECT member_id FROM project_member_links WHERE project_id = $project_id");
    while ($row = mysqli_fetch_assoc($result)) {
        $existingLinks[] = (int) $row['member_id'];
    }

    // Check if any changes were made before proceeding
    if ($existingLinks === $member_ids) {
        echo json_encode(["message" => "No changes detected"]);
        exit;
    }

    // Start transaction
    mysqli_begin_transaction($con);

    try {
        // Delete existing links for this project
        $delete_sql = "DELETE FROM project_member_links WHERE project_id = ?";
        $delete_stmt = mysqli_prepare($con, $delete_sql);
        mysqli_stmt_bind_param($delete_stmt, "i", $project_id);
        mysqli_stmt_execute($delete_stmt);
        mysqli_stmt_close($delete_stmt);

        // Insert new links if there are any members
        if (!empty($member_ids)) {
            $insert_sql = "INSERT INTO project_member_links (project_id, member_id) VALUES (?, ?)";
            $insert_stmt = mysqli_prepare($con, $insert_sql);

            foreach ($member_ids as $member_id) {
                mysqli_stmt_bind_param($insert_stmt, "ii", $project_id, $member_id);
                mysqli_stmt_execute($insert_stmt);
            }

            mysqli_stmt_close($insert_stmt);
        }

        // Commit transaction
        mysqli_commit($con);

        echo json_encode(["message" => "Project-Member links updated successfully"]);
    } catch (Exception $e) {
        mysqli_rollback($con);
        http_response_code(500);
        echo json_encode(["error" => "Failed to update project-member links: " . $e->getMessage()]);
    }

    exit;
}

// ✅ DELETE: Remove a project-member link
if ($method === 'DELETE') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['project_id']) || !isset($input['member_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "project_id and member_id are required"]);
        exit;
    }

    $project_id = (int) $input['project_id'];
    $member_id = (int) $input['member_id'];

    $sql = "DELETE FROM project_member_links WHERE project_id = ? AND member_id = ?";
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $project_id, $member_id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["message" => "Project-Member link deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete project-member link: " . mysqli_error($con)]);
    }

    mysqli_stmt_close($stmt);
    exit;
}

// ❌ If the method is not GET, POST, PUT, or DELETE → return 405 error
http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
?>
