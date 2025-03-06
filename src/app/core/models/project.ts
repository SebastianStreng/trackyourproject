export interface Project {
    id: number; 
    name: string; 
    description?: string; 
    startDate: Date; 
    endDate?: Date; 
    members: ProjectMember[]; 
    tasks: Task[]; 
  }
  
  export interface ProjectMember {
    id: number; 
    name: string; 
    email: string; 
    password: string; 
  }
  

  export interface Task {
    id: number; 
    projectId: number;  
    title: string; 
    description?: string; 
    assignedTo?: number | null;  // ✅ Null explizit erlaubt
    dueDate?: Date | null;  
    status: TaskStatus; 
}



  export enum TaskStatus {
    NotStarted = 'Not Started',
    InProgress = 'In Progress',
    Completed = 'Completed',
    Blocked = 'Blocked'
  }
  