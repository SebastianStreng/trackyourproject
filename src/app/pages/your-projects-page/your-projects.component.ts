import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesModule } from "../pages.module";
import { SmartphoneCardComponent } from "../../shared/shared/smartphone-card/smartphone-card.component";

@Component({
  selector: 'app-your-project-page',
  imports: [CommonModule, PagesModule],
  templateUrl: './your-projects.component.html',
  styleUrls: ['./your-projects.component.css'], 
})
export class YourProjectsComponent {

  getProjectMembers(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project?.members.map(member => member.name).join(', ') || 'No members';
  }

  getProjectTasks(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project?.tasks.map(task => task.title).join(', ') || 'No tasks';
  }

  projects = [
    {
      id: '1',
      name: 'Website Redesign',
      members: [
        { id: 'm1', name: 'Alice', role: 'Designer' },
        { id: 'm2', name: 'Bob', role: 'Developer' },
      ],
      tasks: [
        { id: 't1', title: 'Create Wireframes', status: 'Completed' },
        { id: 't2', title: 'Develop Homepage', status: 'In Progress' },
      ],
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-01'),
    },
    {
      id: '2',
      name: 'Mobile App Development',
      members: [
        { id: 'm3', name: 'Charlie', role: 'Manager' },
        { id: 'm4', name: 'Diana', role: 'Tester' },
      ],
      tasks: [
        { id: 't3', title: 'Design UI', status: 'Not Started' },
        { id: 't4', title: 'Build API', status: 'In Progress' },
      ],
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-12-31'),
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      members: [
        { id: 'm5', name: 'Eve', role: 'Marketer' },
        { id: 'm6', name: 'Frank', role: 'Analyst' },
      ],
      tasks: [
        { id: 't5', title: 'Social Media Strategy', status: 'Completed' },
        { id: 't6', title: 'Email Campaign', status: 'Not Started' },
      ],
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-07-01'),
    },
    {
      id: '4',
      name: 'Customer Portal Development',
      members: [
        { id: 'm7', name: 'Grace', role: 'Product Owner' },
        { id: 'm8', name: 'Hank', role: 'Developer' },
      ],
      tasks: [
        { id: 't7', title: 'Define Requirements', status: 'Completed' },
        { id: 't8', title: 'Develop Portal', status: 'In Progress' },
      ],
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-10-01'),
    },
    {
      id: '5',
      name: 'Data Migration',
      members: [
        { id: 'm9', name: 'Ivy', role: 'Database Administrator' },
        { id: 'm10', name: 'Jake', role: 'IT Specialist' },
      ],
      tasks: [
        { id: 't9', title: 'Backup Data', status: 'Completed' },
        { id: 't10', title: 'Migrate to Cloud', status: 'Not Started' },
      ],
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-09-01'),
    },
    {
      id: '6',
      name: 'E-Commerce Platform',
      members: [
        { id: 'm11', name: 'Karen', role: 'Product Manager' },
        { id: 'm12', name: 'Leo', role: 'Developer' },
      ],
      tasks: [
        { id: 't11', title: 'Setup Product Listings', status: 'In Progress' },
        { id: 't12', title: 'Implement Payment Gateway', status: 'Not Started' },
      ],
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-01'),
    },
    {
      id: '7',
      name: 'Corporate Website Upgrade',
      members: [
        { id: 'm13', name: 'Mia', role: 'Designer' },
        { id: 'm14', name: 'Noah', role: 'Developer' },
      ],
      tasks: [
        { id: 't13', title: 'Redesign Homepage', status: 'Completed' },
        { id: 't14', title: 'Optimize SEO', status: 'In Progress' },
      ],
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-11-01'),
    },
    {
      id: '8',
      name: 'New Product Launch',
      members: [
        { id: 'm15', name: 'Olivia', role: 'Marketer' },
        { id: 'm16', name: 'Paul', role: 'Sales Lead' },
      ],
      tasks: [
        { id: 't15', title: 'Create Marketing Plan', status: 'Completed' },
        { id: 't16', title: 'Host Launch Event', status: 'Not Started' },
      ],
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-12-01'),
    },
    {
      id: '9',
      name: 'Cybersecurity Initiative',
      members: [
        { id: 'm17', name: 'Quinn', role: 'Security Analyst' },
        { id: 'm18', name: 'Rachel', role: 'IT Manager' },
      ],
      tasks: [
        { id: 't17', title: 'Conduct Risk Assessment', status: 'In Progress' },
        { id: 't18', title: 'Implement Security Measures', status: 'Not Started' },
      ],
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-11-30'),
    },
    {
      id: '10',
      name: 'AI Integration',
      members: [
        { id: 'm19', name: 'Steve', role: 'Data Scientist' },
        { id: 'm20', name: 'Tina', role: 'AI Specialist' },
      ],
      tasks: [
        { id: 't19', title: 'Develop AI Model', status: 'In Progress' },
        { id: 't20', title: 'Integrate with Platform', status: 'Not Started' },
      ],
      startDate: new Date('2025-10-01'),
      endDate: new Date('2026-03-01'),
    }
  ];
  
}
