import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ProjectMember } from '../../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberLinkService {
  baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) {}


  getAll(): Observable<{ projectId: number, memberId: number }[]> {
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


  create(projectId: number, memberId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestData = { project_id: projectId, member_id: memberId };

    console.log('📤 Sending project-member link:', requestData);

    return this.http.post(`${this.baseUrl}/project_member_links`, requestData, { headers }).pipe(
      tap((res: any) => console.log('✅ Project-Member Link created:', res)),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error creating project-member link:', error);

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
}
