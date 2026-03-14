CREATE DATABASE IF NOT EXISTS trackyourproject;
USE trackyourproject;

CREATE TABLE IF NOT EXISTS projects (
    id INT(5) PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(255) NOT NULL, 
    description TEXT NULL, 
    start_date DATE NOT NULL, 
    end_date DATE NULL
);

CREATE TABLE IF NOT EXISTS project_members (
    id INT(5) PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_member_links (
    project_id INT(5),
    member_id INT(5),
    PRIMARY KEY (project_id, member_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES project_members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT(5) PRIMARY KEY AUTO_INCREMENT, 
    project_id INT(5), 
    title VARCHAR(255) NOT NULL, 
    description TEXT NULL, 
    assigned_to INT(5) NULL, 
    due_date DATE NULL, 
    status ENUM('Not Started', 'In Progress', 'Completed', 'Blocked') NOT NULL DEFAULT 'Not Started',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES project_members(id) ON DELETE SET NULL
);

INSERT INTO projects (name, description, start_date, end_date) VALUES 
('Angular App', 'Task-Management System mit Angular und PHP', '2024-02-01', '2024-06-01'),
('Mobile App', 'Projekt für eine React Native App', '2024-03-01', '2024-08-01'),
('E-Commerce Website', 'Online-Shop mit Laravel und Vue.js', '2024-01-15', '2024-07-30'),
('AI Chatbot', 'KI-gestützter Chatbot mit Python und OpenAI API', '2024-04-10', '2024-10-20'),
('CRM System', 'Customer Relationship Management Software mit Spring Boot', '2024-02-20', '2024-09-10'),
('Finanzanalyse-App', 'Web-App zur Analyse von Finanzdaten mit Python und Django', '2024-05-01', '2024-12-01'),
('Social Media Plattform', 'Plattform für soziale Interaktionen, entwickelt mit MERN-Stack', '2024-06-01', '2024-12-31'),
('IoT Smart Home', 'Smart Home Steuerung mit Raspberry Pi und Node.js', '2024-07-15', '2025-01-15'),
('Blockchain Wallet', 'Kryptowährungs-Wallet mit Solidity und Ethereum Blockchain', '2024-08-10', '2025-02-28'),
('Lernplattform', 'E-Learning-Plattform mit Angular und Firebase', '2024-09-01', '2025-03-31');

-- All seed users have password: password123
INSERT INTO project_members (name, email, password) VALUES
('Alice', 'alice@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi'),
('Bob', 'bob@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi'),
('Charlie', 'charlie@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi'),
('David', 'david@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi'),
('Emma', 'emma@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi'),
('Frank', 'frank@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi'),
('Grace', 'grace@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi'),
('Henry', 'henry@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi'),
('Ivy', 'ivy@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi'),
('Jack', 'jack@example.com', '$2y$10$d1TlyRoS3mZXOWgWOYb65eyBaaoMaaqS74s8F7IX/D.yga4EUW7pi');


INSERT INTO project_member_links (project_id, member_id) VALUES 
(1, 1), 
(1, 2), 
(2, 2), 
(2, 3);

INSERT INTO tasks (project_id, title, description, assigned_to, due_date, status) VALUES 
(1, 'Setup Angular', 'Install dependencies and configure project', 1, '2024-02-10', 'In Progress'),
(1, 'Create Components', 'Build UI components for dashboard', 2, '2024-02-15', 'Not Started'),
(2, 'Setup API', 'Create backend API for mobile app', 3, '2024-03-05', 'Blocked'),
(2, 'UI Design', 'Design app screens using Figma', 2, '2024-03-12', 'Completed');
