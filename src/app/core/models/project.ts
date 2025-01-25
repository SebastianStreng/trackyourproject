export interface Project {
    id: string; // Eindeutige ID des Projekts
    name: string; // Name des Projekts
    description?: string; // Optionale Beschreibung des Projekts
    startDate: Date; // Startdatum
    endDate?: Date; // Optionales Enddatum
    status: ProjectStatus; // Aktueller Status des Projekts
    members: ProjectMember[]; // Liste der Projektmitglieder
    tasks: Task[]; // Liste der zugeordneten Aufgaben
    createdAt: Date; // Erstellungsdatum
    updatedAt?: Date; // Optional: Datum der letzten Aktualisierung
  }
  
  // Enum für den Projektstatus
  export enum ProjectStatus {
    NotStarted = 'Not Started',
    InProgress = 'In Progress',
    Completed = 'Completed',
    OnHold = 'On Hold',
    Cancelled = 'Cancelled'
  }
  
  // Interface für ein Projektmitglied
  export interface ProjectMember {
    id: string; // Eindeutige ID des Mitglieds
    name: string; // Name des Mitglieds
    role: MemberRole; // Rolle im Projekt
  }
  
  // Enum für die Rollen der Mitglieder
  export enum MemberRole {
    Manager = 'Manager',
    Developer = 'Developer',
    Designer = 'Designer',
    Tester = 'Tester',
    Other = 'Other'
  }
  
  // Interface für eine Aufgabe im Projekt
  export interface Task {
    id: string; // Eindeutige ID der Aufgabe
    title: string; // Titel der Aufgabe
    description?: string; // Optionale Beschreibung
    assignedTo?: string; // ID des zugeordneten Mitglieds
    dueDate?: Date; // Fälligkeitsdatum
    status: TaskStatus; // Status der Aufgabe
  }
  
  // Enum für den Aufgabenstatus
  export enum TaskStatus {
    NotStarted = 'Not Started',
    InProgress = 'In Progress',
    Completed = 'Completed',
    Blocked = 'Blocked'
  }
  