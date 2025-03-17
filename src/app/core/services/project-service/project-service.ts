import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Project } from '../../models/project';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) {}


  getAll() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http
      .get<{ data: Project[] }>(`${this.baseUrl}/projects`, { headers }) 
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
    // Konvertiere Date-Objekte in das richtige Format
    const formattedProject = {
      ...project,
      start_date: project.startDate 
        ? new Date(project.startDate).toISOString().split('T')[0] 
        : null,
      end_date: project.endDate 
        ? new Date(project.endDate).toISOString().split('T')[0] 
        : null
    };
  
    console.log('📤 Sending formatted project data:', formattedProject);
  
    return this.http.post(`${this.baseUrl}/projects`, formattedProject, {
      headers: { 'Content-Type': 'application/json' }, 
    }).pipe(
      tap((res: any) => {
        console.log('✅ Project created successfully:', res);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ HTTP Request failed:', error);
  
        if (error.status === 0) {
          console.error('🌍 Network error – backend might be down or CORS issue');
        } else if (error.status === 400) {
          console.error('⚠️ Bad Request – possible validation issue:', error.error);
        } else if (error.status === 500) {
          console.error('🔥 Server Error – check backend logs for more details');
        }
  
        return throwError(() => new Error(error.error?.error || 'Unknown error'));
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

  delete(projectId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http
      .request('DELETE', `${this.baseUrl}/projects`, {
        headers,
        body: { id: projectId }, 
      })
      .pipe(
        tap(() => console.log(`🗑️ Deleted project: ${projectId}`)),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Error deleting project:', error);
          return throwError(() => new Error(error.error?.error || 'Unknown error'));
        })
      );
  }
  
}
