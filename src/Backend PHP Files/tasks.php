<?php

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

if ($method === 'GET') {
    getTasks($con);
} elseif ($method === 'POST') {
    createTask($con);
} elseif ($method === 'PUT') {
    updateTask($con);
} elseif ($method === 'DELETE') {
    deleteTask($con);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}

// ✅ GET: Retrieve all tasks
function getTasks($con)
{
    $tasks = [];
    $sql = "SELECT t.id, t.project_id, t.title, t.description, t.assigned_to, 
                   t.due_date, t.status, p.name AS project_name, pm.name AS assigned_to_name
            FROM tasks t
            JOIN projects p ON t.project_id = p.id
            LEFT JOIN project_members pm ON t.assigned_to = pm.id";

    if ($result = mysqli_query($con, $sql)) {
        while ($row = mysqli_fetch_assoc($result)) {
            $tasks[] = [
                'id' => (int) $row['id'],
                'projectId' => (int) $row['project_id'],
                'title' => $row['title'],
                'description' => $row['description'] ?? '',
                'assigned_to' => [
                    'id' => (int) $row['assigned_to'],
                    'name' => $row['assigned_to_name']
                ],
                'due_date' => $row['due_date'] ?? null,
                'status' => $row['status'] ?? 'Not Started',
                'project_name' => $row['project_name']
            ];
        }
        echo json_encode(['data' => $tasks], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error retrieving tasks", "error" => mysqli_error($con)]);
    }
}

// ✅ POST: Create a new task
function createTask($con)
{
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    error_log("📥 Received JSON: " . $json); // Debugging

    if ($data === null) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid JSON", "error" => json_last_error_msg()]);
        return;
    }

    // Ensure the status is a string and not an object
    $status = is_array($data['status']) ? ($data['status']['value'] ?? 'Not Started') : $data['status'];

    // Validate required fields
    $required_fields = ['project_id', 'title', 'description', 'assigned_to', 'due_date', 'status'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["message" => "Missing required field: $field"]);
            return;
        }
    }

    // Sanitize inputs
    $projectId = (int) $data['project_id'];
    $title = mysqli_real_escape_string($con, trim($data['title']));
    $description = mysqli_real_escape_string($con, trim($data['description']));
    $assigned_to = (int) $data['assigned_to'];
    $due_date = mysqli_real_escape_string($con, trim($data['due_date']));
    $status = mysqli_real_escape_string($con, $status);

    $sql = "INSERT INTO tasks (project_id, title, description, assigned_to, due_date, status) 
            VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "ississ", $projectId, $title, $description, $assigned_to, $due_date, $status);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["message" => "Task successfully created", "task_id" => mysqli_insert_id($con)]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error creating task", "error" => mysqli_error($con)]);
    }

    mysqli_stmt_close($stmt);
}

// ✅ PUT: Update an existing task
function updateTask($con)
{
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    if (!isset($data['id'], $data['title'], $data['description'], $data['assigned_to'], $data['due_date'], $data['status'])) {
        http_response_code(400);
        echo json_encode(["message" => "Missing parameters"]);
        return;
    }

    $id = (int) $data['id'];
    $title = mysqli_real_escape_string($con, trim($data['title']));
    $description = mysqli_real_escape_string($con, trim($data['description']));
    $assigned_to = (int) $data['assigned_to'];
    $due_date = mysqli_real_escape_string($con, trim($data['due_date']));
    $status = is_array($data['status']) ? ($data['status']['value'] ?? 'Not Started') : $data['status'];
    $status = mysqli_real_escape_string($con, $status);

    $sql = "UPDATE tasks SET title = ?, description = ?, assigned_to = ?, due_date = ?, status = ? WHERE id = ?";
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "ssissi", $title, $description, $assigned_to, $due_date, $status, $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["message" => "Task updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error updating task", "error" => mysqli_error($con)]);
    }

    mysqli_stmt_close($stmt);
}

// ✅ DELETE: Remove a task
function deleteTask($con)
{
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);
    $id = $data['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Missing task ID"]);
        return;
    }

    $id = (int) $id;

    $sql = "DELETE FROM tasks WHERE id = ?";
    $stmt = mysqli_prepare($con, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["message" => "Task deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error deleting task", "error" => mysqli_error($con)]);
    }

    mysqli_stmt_close($stmt);
}

?>
