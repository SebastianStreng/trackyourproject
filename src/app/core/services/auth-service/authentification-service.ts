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

  // ✅ Observables für Komponenten bereitstellen
  public loggedIn = this.loggedInSubject.asObservable();
  public currentProjectMember = this.currentProjectMemberSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadProjectMemberFromToken(); // Falls Token existiert, Nutzer laden
  }

  /** 🔐 Login-Methode */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login.php`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedInSubject.next(true);
          this.loadProjectMemberFromToken(); // Nach Login User-Infos setzen
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  /** 🔍 Prüft und lädt den ProjectMember aus dem Token */
  private loadProjectMemberFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const projectMember: ProjectMember = this.mapDecodedTokenToProjectMember(decodedToken);
        this.currentProjectMemberSubject.next(projectMember);
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.logout(); // Falls Token fehlerhaft, automatisch ausloggen
      }
    }
  }

  /** 📌 Gibt den aktuellen ProjectMember zurück */
  getCurrentProjectMember(): Observable<ProjectMember | null> {
    return this.currentProjectMember; // Observable zurückgeben
  }

  /** 🛠️ Dekodiert den Token und erstellt ein ProjectMember-Objekt */
  private mapDecodedTokenToProjectMember(decodedToken: any): ProjectMember {
    return {
      id: parseInt(decodedToken.id, 10), // ID als Zahl speichern
      name: decodedToken.name,
      email: decodedToken.email,
      password: '', // Passwort bleibt leer, da es nicht im Token gespeichert wird
    };
  }

  /** 🚪 Logout: Entfernt Token und leitet zur Login-Seite */
  logout(): void {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
    this.currentProjectMemberSubject.next(null);
    this.router.navigate(['/Login']);
  }

  /** 🔄 Prüft, ob der User eingeloggt ist */
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  /** ✅ Prüft, ob ein Token vorhanden ist */
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
