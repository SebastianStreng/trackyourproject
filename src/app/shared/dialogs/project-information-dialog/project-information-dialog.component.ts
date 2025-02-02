import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { Project, ProjectMember, Task, TaskStatus } from 'src/app/core/models/project';

@Component({
  selector: 'app-project-information-dialog',
  imports: [CommonModule, SharedModule],
  templateUrl: './project-information-dialog.component.html',
  styleUrls: ['./project-information-dialog.component.css'],
})
export class ProjectInformationDialogComponent {
  project: Project = {
    id: 1,
    name: 'Website Redesign',
    description: 'A project to revamp the corporate website.',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-06-30'),
    members: [
      { id: 1, name: 'Alice', email: "mail", password: "password"},
      { id: 2, name: 'Bob' ,email: "mail", password: "password"},
    ],
    tasks: [
      {
        id: 1,
        title: 'Design mockups',
        description: 'Create initial design mockups for the homepage.',
        assignedTo: 'Alice',
        dueDate: new Date('2023-02-15'),
        status: TaskStatus.InProgress,
      },
      {
        id: 2,
        title: 'Implement homepage',
        description: 'Develop the homepage using the approved design.',
        assignedTo: 'Bob',
        dueDate: new Date('2023-03-30'),
        status: TaskStatus.NotStarted,
      },
      {
        id: 3,
        title: 'Implement homepage',
        description: 'Develop the homepage using the approved design.',
        assignedTo: 'Bob',
        dueDate: new Date('2023-03-30'),
        status: TaskStatus.NotStarted,
      },
      {
        id: 4,
        title: 'Implement homepage',
        description: 'Develop the homepage using the approved design.',
        assignedTo: 'Bob',
        dueDate: new Date('2023-03-30'),
        status: TaskStatus.NotStarted,
      },
    ],
  };

  goHome (){

  }

  goBack(){

  }

  closeDialog(){
    
  }

}
