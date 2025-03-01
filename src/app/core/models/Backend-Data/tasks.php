<?php

require 'connect.php';

$tasks = [];
$sql = "SELECT t.id, t.project_id, t.title, t.description, t.assigned_to, 
               t.due_date, t.status, p.name AS project_name, pm.name AS assigned_to_name
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        LEFT JOIN project_members pm ON t.assigned_to = pm.id";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $tasks[$cr]['id'] = $row['id'];
        $tasks[$cr]['projectId'] = $row['project_id'];  
        $tasks[$cr]['title'] = $row['title'];
        $tasks[$cr]['description'] = $row['description'];
        $tasks[$cr]['assigned_to'] = [
            'id' => $row['assigned_to'],
            'name' => $row['assigned_to_name']
        ];
        $tasks[$cr]['due_date'] = $row['due_date'];
        $tasks[$cr]['status'] = $row['status'];
        $tasks[$cr]['project_name'] = $row['project_name']; 
        $cr++;
    }
    echo json_encode(['data' => $tasks]);
} else {
    http_response_code(404);
}
?>
