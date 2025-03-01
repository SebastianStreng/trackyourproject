import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Project } from '../../models/project';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // baseUrl = 'http://trackyourproject.lovestoblog.com/api';
baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) {}


  getAll() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http
      .get<{ data: Project[] }>(`${this.baseUrl}/projects`, { headers }) // Header hinzugefügt
      .pipe(
        tap((r) => console.log('Projects fetched:', r)),
        map((response) => response.data),
        map((projects) =>
          projects.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            startDate: new Date(project.startDate),
            endDate: project.endDate ? new Date(project.endDate) : null,
          }))
        ),
        catchError((error: any) => {
          console.error('Error fetching projects:', error);
          return throwError(() => new Error('Error fetching projects'));
        })
      );
  }
  

  // getAll() {
  //   return this.http
  //     .get<any>(`${this.baseUrl}/projects.php`)
      
  // }

  getById(id: number) {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`).pipe(
      tap((r) => console.log(`Project ${id} fetched:`, r)),
      catchError((error) => {
        console.error(`Error fetching project ${id}:`, error);
        return throwError(() => new Error(`Error fetching project ${id}`));
      })
    );
  }

  create(project: Project) {
    return this.http.post(`${this.baseUrl}/projects`, project).pipe(
      tap((res: any) => console.log('Project created:', res)),
      catchError((error) => {
        console.error('Error creating project:', error);
        return throwError(() => new Error('Error creating project'));
      })
    );
  }

  update(project: Project) {
    return this.http.put(`${this.baseUrl}/projects/${project.id}`, project).pipe(
      tap((res: any) => console.log('Project updated:', res)),
      catchError((error) => {
        console.error('Error updating project:', error);
        return throwError(() => new Error('Error updating project'));
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/projects/${id}`).pipe(
      tap(() => console.log(`Project ${id} deleted`)),
      catchError((error) => {
        console.error(`Error deleting project ${id}:`, error);
        return throwError(() => new Error(`Error deleting project ${id}`));
      })
    );
  }
}
