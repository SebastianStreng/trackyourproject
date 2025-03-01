<?php
/**
 * Returns the list of projects.
 */
require 'connect.php';

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
?>
