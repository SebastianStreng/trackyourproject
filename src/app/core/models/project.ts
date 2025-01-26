export interface Project {
    id: string; 
    name: string; 
    description?: string; 
    startDate: Date; 
    endDate?: Date; 
    members: ProjectMember[]; 
    tasks: Task[]; 
    createdAt: Date; 
    updatedAt?: Date; 
  }
  
  // Interface für ein Projektmitglied
  export interface ProjectMember {
    id: string; 
    name: string; 
  }
  

  export interface Task {
    id: string; 
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
  