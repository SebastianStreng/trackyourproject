export interface Project {
    id: number; 
    name: string; 
    description?: string; 
    startDate: Date; 
    endDate?: Date; 
    members: ProjectMember[]; 
    tasks: Task[]; 
  }
  
  // Interface für ein Projektmitglied
  export interface ProjectMember {
    id: number; 
    name: string; 
    email: string; 
    password: string; 
  }
  

  export interface Task {
    id: number; 
    title: string; 
    description?: string; 
    assignedTo?: string; 
    dueDate?: Date; 
    status: TaskStatus; 
  }
  

  export enum TaskStatus {
    NotStarted = 'Not Started',
    InProgress = 'In Progress',
    Completed = 'Completed',
    Blocked = 'Blocked'
  }
  