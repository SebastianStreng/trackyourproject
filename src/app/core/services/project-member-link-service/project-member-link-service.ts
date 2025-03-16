import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberLinkService {
  baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) {}

  // ✅ Retrieve all project-member links
  getAll(): Observable<{ projectId: number; memberId: number }[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<{ data: any[] }>(`${this.baseUrl}/project_member_links`, { headers }).pipe(
      tap((r) => console.log('Project-Member Links fetched:', r)),
      map((response) => response.data),
      map((links) =>
        links.map((link) => ({
          projectId: link.project_id,
          memberId: link.member_id,
        }))
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching project-member links:', error);
        return throwError(() => new Error('Error fetching project-member links'));
      })
    );
  }

  // ✅ Create a new project-member link
  create(projectId: number, memberId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestData = { project_id: projectId, member_id: memberId };

    console.log('📤 Sending project-member link:', requestData);

    return this.http.post(`${this.baseUrl}/project_member_links`, requestData, { headers }).pipe(
      tap((res: any) => console.log('✅ Project-Member Link created:', res)),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error creating project-member link:', error);
        return throwError(() => new Error(error.error?.error || 'Unknown error'));
      })
    );
  }

  // ✅ Update project-member links for a project
  update(projectId: number, memberIds: number[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestData = { project_id: projectId, member_ids: memberIds };

    console.log('📤 Sending update request:', requestData);

    return this.http.put(`${this.baseUrl}/project_member_links`, requestData, { headers }).pipe(
      tap((res: any) => console.log('✅ Project-Member Links updated:', res)),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error updating project-member links:', error);
        return throwError(() => new Error(error.error?.error || 'Unknown error'));
      })
    );
  }

  delete(projectId: number, memberId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .request('DELETE', `${this.baseUrl}/project_member_links`, {
        headers,
        body: { project_id: projectId, member_id: memberId },
      })
      .pipe(
        tap(() => console.log(`🗑️ Deleted project-member link: ${projectId} - ${memberId}`)),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Error deleting project-member link:', error);
          return throwError(() => new Error(error.error?.error || 'Unknown error'));
        })
      );
  }
  
}
