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
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentProjectMemberSubject = new BehaviorSubject<ProjectMember | null>(null);

  public loggedIn = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken(); // Falls schon ein Token existiert, Nutzer laden
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login.php`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedInSubject.next(true);
          this.loadUserFromToken();
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  private loadUserFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const user: ProjectMember = this.mapDecodedTokenToProjectMember(decodedToken);
        this.currentProjectMemberSubject.next(user);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }

  getCurrentProjectMember(): ProjectMember | null {
    return this.currentProjectMemberSubject.value;
  }

  private mapDecodedTokenToProjectMember(decodedToken: any): ProjectMember {
    return {
      id: +decodedToken.id,
      name: decodedToken.name,
      email: decodedToken.email,
      password: '', // Das Passwort wird nicht im Token gespeichert
    };
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
    this.currentProjectMemberSubject.next(null);
    this.router.navigate(['/Login']);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
