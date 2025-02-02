import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { ProjectMember } from 'src/app/core/models/project';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [DialogService],
})
export class RegisterComponent implements OnInit {
  id!: number;
  name!: string;
  email!: string;
  password!: string;

  members: ProjectMember[] = [];
  member!: ProjectMember;

  error = '';
  success = '';

  constructor(
    public dialogService: DialogService,
    private projectMemberService: ProjectMemberService,
    private authService: AuthenticationService,
    public ref: DynamicDialogRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProjectMembers();
  }

  register() {
    const newMember: ProjectMember = {
      id: 0,
      name: this.name,
      email: this.email,
      password: this.password,
    };
    this.addProjectMember(newMember);
  }

  getProjectMembers(): void {
    this.projectMemberService.getAll().subscribe({
      next: (data: ProjectMember[]) => {
        this.members = data;
        this.success = 'Successful retrieval of the project members';
      },
      error: (err) => {
        console.error(err);
        this.error = 'An error occurred while fetching data';
      },
      complete: () => console.log('Project members fetch complete'),
    });
  }

  addProjectMember(memberToAdd: ProjectMember) {
    this.resetAlerts();

    if (this.isProjectMemberAlreadyExists(memberToAdd)) {
      this.error = 'Project Member with the same email already exists.';
      console.log(this.error);
      return;
    }

    this.projectMemberService.store(memberToAdd).subscribe(
      (res: ProjectMember) => {
        this.members.push(res);
        this.success = 'Created Project Member successfully';
        this.ref.close();
      },
      (err) => (this.error = err.message)
    );
  }

  private isProjectMemberAlreadyExists(newMember: ProjectMember): boolean {
    return this.members.some(
      (member) =>
        member.email === newMember.email
    );
  }

  updateProjectMember() {
    this.resetAlerts();

    this.projectMemberService
      .update({
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (res) => {
          this.success = 'Updated successfully';
        },
        (err) => (this.error = err)
      );
  }

  resetAlerts() {
    this.error = '';
    this.success = '';
  }
}
