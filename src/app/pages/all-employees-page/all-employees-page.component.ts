import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProjectMember } from 'src/app/core/models/project';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-employees-page',
  imports: [CommonModule, SharedModule, SmartphoneCardComponent, TableModule, ButtonModule],
  templateUrl: './all-employees-page.component.html',
  styleUrl: './all-employees-page.component.css',
})
export class AllEmployeesPageComponent implements OnInit {
  
  projectMembers: ProjectMember[] = [];

  constructor(private projectMemberService: ProjectMemberService, private router: Router) {}

  ngOnInit(): void {
    this.loadProjectMembers();
  }

  // ✅ Fetch all users from the database
  loadProjectMembers(): void {
    this.projectMemberService.getAll().subscribe({
      next: (members) => {
        this.projectMembers = members;
        console.log("✅ Project members loaded:", this.projectMembers);
      },
      error: (err) => {
        console.error("❌ Error fetching project members:", err);
      }
    });
  }

  goHome() {
    console.log("🏠 Navigating to home...");
    this.router.navigate(['/Selection']);
  }

  goBack() {
    console.log("⬅️ Navigating back...");
    this.router.navigate(['/Selection']);
  }

  deleteUser(memberId: number) {
    if (!confirm(`❗ Are you sure you want to delete this user (ID: ${memberId})?`)) {
      return;
    }

    console.log(`🗑️ Deleting user with ID: ${memberId}`);

    this.projectMemberService.delete(memberId).subscribe({
      next: () => {
        console.log(`✅ User with ID ${memberId} deleted successfully.`);
        this.projectMembers = this.projectMembers.filter(member => member.id !== memberId);
      },
      error: (err) => {
        console.error(`❌ Error deleting user with ID ${memberId}:`, err);
      }
    });
  }
}
