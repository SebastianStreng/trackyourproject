
CREATE DATABASE IF NOT EXISTS trackyourproject;
USE trackyourproject;


CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    description TEXT NULL, 
    start_date DATE NOT NULL, 
    end_date DATE NULL
);

CREATE TABLE IF NOT EXISTS project_members (
    id VARCHAR(36) PRIMARY KEY, 
    name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS project_member_links (
    project_id VARCHAR(36),
    member_id VARCHAR(36),
    PRIMARY KEY (project_id, member_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES project_members(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY, 
    project_id VARCHAR(36), 
    title VARCHAR(255) NOT NULL, 
    description TEXT NULL, 
    assigned_to VARCHAR(36) NULL, 
    due_date DATE NULL, 
    status ENUM('Not Started', 'In Progress', 'Completed', 'Blocked') NOT NULL DEFAULT 'Not Started',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES project_members(id) ON DELETE SET NULL
);


INSERT INTO projects (id, name, description, start_date, end_date) VALUES 
('1', 'Angular App', 'Task-Management System mit Angular und PHP', '2024-02-01', '2024-06-01'),
('2', 'Mobile App', 'Projekt für eine React Native App', '2024-03-01', '2024-08-01'),
('3', 'E-Commerce Website', 'Online-Shop mit Laravel und Vue.js', '2024-01-15', '2024-07-30'),
('4', 'AI Chatbot', 'KI-gestützter Chatbot mit Python und OpenAI API', '2024-04-10', '2024-10-20'),
('5', 'CRM System', 'Customer Relationship Management Software mit Spring Boot', '2024-02-20', '2024-09-10'),
('6', 'Finanzanalyse-App', 'Web-App zur Analyse von Finanzdaten mit Python und Django', '2024-05-01', '2024-12-01'),
('7', 'Social Media Plattform', 'Plattform für soziale Interaktionen, entwickelt mit MERN-Stack', '2024-06-01', '2024-12-31'),
('8', 'IoT Smart Home', 'Smart Home Steuerung mit Raspberry Pi und Node.js', '2024-07-15', '2025-01-15'),
('9', 'Blockchain Wallet', 'Kryptowährungs-Wallet mit Solidity und Ethereum Blockchain', '2024-08-10', '2025-02-28'),
('10', 'Lernplattform', 'E-Learning-Plattform mit Angular und Firebase', '2024-09-01', '2025-03-31');


INSERT INTO project_members (id, name) VALUES 
('1', 'Alice'), 
('2', 'Bob'), 
('3', 'Charlie');


INSERT INTO project_member_links (project_id, member_id) VALUES 
('1', '1'), 
('1', '2'), 
('2', '2'), 
('2', '3');


INSERT INTO tasks (id, project_id, title, description, assigned_to, due_date, status) VALUES 
('1', '1', 'Setup Angular', 'Install dependencies and configure project', '1', '2024-02-10', 'In Progress'),
('2', '1', 'Create Components', 'Build UI components for dashboard', '2', '2024-02-15', 'Not Started'),
('3', '2', 'Setup API', 'Create backend API for mobile app', '3', '2024-03-05', 'Blocked'),
('4', '2', 'UI Design', 'Design app screens using Figma', '2', '2024-03-12', 'Completed');


