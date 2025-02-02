import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProjectMember } from '../../models/project';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = 'http://localhost/api';
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private currentProjectMemberSubject = new BehaviorSubject<any>(null);

  public loggedIn = this.loggedInSubject.asObservable();
  public loggedInProjectMember!: ProjectMember;

  constructor(private http: HttpClient, private router: Router) {}

  login(ProjectMembername: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { ProjectMembername, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedInProjectMember = response.ProjectMember;
          this.loggedInSubject.next(true);
          this.updateCurrentProjectMember();
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);

        console.log('Server response:', error.error);

        throw error;
      })
    );
  }

  getCurrentProjectMember(): ProjectMember {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const decodedToken: any = jwtDecode(token);
        return this.mapDecodedTokenToProjectMember(decodedToken);
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
    return this.getDefaultProjectMember();
  }

  private mapDecodedTokenToProjectMember(decodedToken: any): ProjectMember {
    if (decodedToken) {
      return {
        id: +decodedToken.ProjectMember_id,
        name: decodedToken.ProjectMembername,
        email: decodedToken.ProjectMember_mail,
        password: '', // Passwort wird nicht im Token gespeichert
      };
    }
    return this.getDefaultProjectMember();
  }

  private getDefaultProjectMember(): ProjectMember {
    return {
      id: 0,
      name: 'Guest',
      password: '',
      email: '',
    };
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
    this.currentProjectMemberSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private updateCurrentProjectMember(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.http
        .get(`${this.baseUrl}/ProjectMember`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .subscribe(
          (ProjectMember: any) => this.currentProjectMemberSubject.next(ProjectMember),
          (error) => console.error('Failed to get current ProjectMember:', error)
        );
    }
  }
}
