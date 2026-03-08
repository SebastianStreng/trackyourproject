import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, Task, TaskStatus } from 'src/app/core/models/project';
import { ChartModule } from 'primeng/chart';
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-show-chart-dialog',
  standalone: true,
  imports: [CommonModule, ChartModule, DialogCardComponent, CardModule],
  templateUrl: './show-chart-dialog.component.html',
  styleUrl: './show-chart-dialog.component.css',
})
export class ShowChartDialogComponent implements OnInit {
  project: Project | null = null;
  allTasks: Task[] = [];  

  data: any;
  options: any;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private router: Router) {}

  ngOnInit(): void {
    // ✅ Daten aus der Navigation oder SessionStorage holen
    const navigation = history.state;
    
    if (navigation.project) {
      this.project = navigation.project;
    } else {
      const storedProject = sessionStorage.getItem('selectedProject');
      this.project = storedProject ? JSON.parse(storedProject) : null;
    }

    if (navigation.allTasks) {
      this.allTasks = navigation.allTasks;
    } else {
      const storedTasks = sessionStorage.getItem('ProjectRelatedTasks');
      this.allTasks = storedTasks ? JSON.parse(storedTasks) : [];
    }

    console.log("✅ Projekt:", this.project);
    console.log("✅ Tasks für Chart:", this.allTasks);
    console.log("✅ Task-Status-Verteilung:", this.countTaskStatuses());
    

    this.initChart();
  }

  closeDialog() {
    this.router.navigate(['/Projects']);
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      // ✅ Task-Status zählen
      const taskStatusCounts = this.countTaskStatuses();

      this.data = {
        labels: Object.keys(taskStatusCounts), // z.B. ['Not Started', 'In Progress', 'Completed', 'Blocked']
        datasets: [
          {
            data: Object.values(taskStatusCounts), // Anzahl der Tasks pro Status
            backgroundColor: [
              documentStyle.getPropertyValue('--p-cyan-500'),
              documentStyle.getPropertyValue('--p-orange-500'),
              documentStyle.getPropertyValue('--p-green-500'),
              documentStyle.getPropertyValue('--p-red-500')
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--p-cyan-400'),
              documentStyle.getPropertyValue('--p-orange-400'),
              documentStyle.getPropertyValue('--p-green-400'),
              documentStyle.getPropertyValue('--p-red-400')
            ]
          }
        ]
      };

      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor
            }
          }
        }
      };
    }
  }


  countTaskStatuses(): Record<string, number> {
    const statusCounts: Record<string, number> = {
      "Not Started": 0,
      "In Progress": 0,
      "Completed": 0,
      "Blocked": 0
    };

    this.allTasks.forEach(task => {
      if (task.status in statusCounts) {
        statusCounts[task.status]++;
      } else {
        console.warn(`⚠️ Unbekannter Task-Status: ${task.status}`);
      }
    });

    return statusCounts;
  }


  goHome() {
    this.router.navigate(['/Selection']);
  }

  goBack() {
    this.router.navigate(['/ProjectInformation'], { state: { selectedProject: this.project } });
}
}
