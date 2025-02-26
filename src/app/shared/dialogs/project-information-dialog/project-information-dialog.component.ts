import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { Project, Task, TaskStatus } from 'src/app/core/models/project';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/core/services/task-service/task-service';

@Component({
  selector: 'app-project-information-dialog',
  standalone: true, 
  imports: [CommonModule, SharedModule, ButtonModule, TableModule],
  templateUrl: './project-information-dialog.component.html',
  styleUrls: ['./project-information-dialog.component.css'],
})
export class ProjectInformationDialogComponent implements OnInit {
  project: Project | null = null;
  projectDescription = '';
  allTasks: Task[] = [];  
  projectTasks: Task[] = [];  
  selectedTask?: Task;



  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation?.extras.state && navigation.extras.state['selectedProject']) {
      this.project = navigation.extras.state['selectedProject'];
      console.log('✅ Project received from state:', this.project);
    } else {
      const storedProject = sessionStorage.getItem('selectedProject');
      this.project = storedProject ? JSON.parse(storedProject) : null;
      
      if (this.project) {
        console.log('✅ Project loaded from sessionStorage:', this.project);
      } else {
        console.error('❌ No project found!');
        return;
      }
    }

    if (this.project?.description) {
      this.projectDescription = this.project.description;
    }

    // ✅ Erst alle Tasks laden, danach filtern
    this.loadAllTasks();
  }

  
  addTask(task?: Task) {
    if (!task) {
      console.warn('⚠️ Kein Task übergeben! Erstelle neuen Task...');
      task = {
        id: this.generateRandomId(),  // 0 oder eine temporäre ID für neue Tasks
        projectId: this.project ? this.project.id : 0,
        title: '',
        description: '',
        assignedTo: null,
        dueDate: null,
        status: TaskStatus.NotStarted
      };
    }
  
    this.selectedTask = task;
  
    sessionStorage.setItem('selectedTask', JSON.stringify(task));
    sessionStorage.setItem('selectedProject', JSON.stringify(this.project));
  
    console.log("✅ Add Task To local Cache:", JSON.stringify(task, null, 2));
    console.log("✅ Navigating with state:", { project: this.project, task: task });
  
    this.router.navigate(['/AddOrUpdateTask'], { state: { project: this.project, task: task } });
  }
  


  loadAllTasks(): void {
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        console.log('✅ All tasks loaded:', this.allTasks);
        
        this.filterTasksByProjectId();
      },
      error: (err) => console.error('❌ Error fetching all tasks:', err),
    });
  }
  

  filterTasksByProjectId(): void {
    try {
      console.log('🔄 Filtering tasks for project:', this.project);
  
      if (!this.project?.id) {
        console.error('❌ Error: No project ID found!');
        return;
      }
  
      this.projectTasks = this.allTasks.filter(task => task.projectId == this.project?.id)

      if (this.projectTasks.length === 0) {
        console.warn(`⚠️ Warning: No tasks found for project ID ${this.project.id}`);
      }
  
      console.log(`✅ Filtered ${this.projectTasks.length} tasks for project ${this.project.id}:`, this.projectTasks);
      
    } catch (error) {
      console.error('❌ Error in filterTasksByProjectId:', error);
    }
  }
  

  closeDialog() {
    this.router.navigate(['/Projects']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/Projects']);
  }

    

  getAssignedTo(task: Task): string {
    console.log(`✅ Assigned to: ${task}`);
    if (!task.assignedTo) {
      return 'Unassigned';
    }
  
    if (typeof task.assignedTo === 'string') {
      return task.assignedTo;
    }
  
    if ('name' in task.assignedTo) {
      return task.assignedTo.name;
    }
  
    return 'Unknown';
  }

  getTaskStatus(task: Task){
    if(!task.status) {
      return "no Status";
    }
    return task.status; 

  }

  generateRandomId(): number {
    return (Math.floor(1000 + Math.random() * 9000));
  }
  
  
}
