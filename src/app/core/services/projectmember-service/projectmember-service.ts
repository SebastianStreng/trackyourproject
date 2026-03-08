import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ProjectMember } from '../../models/project';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectMember[]> {
    return this.http.get<{ data: any[] }>(`${this.baseUrl}/project_members`).pipe(
      tap((r) => console.log('📥 Fetched project members:', r)),
      map((response) => response.data),
      map((members) =>
        members.map(
          (member) =>
            ({
              id: member.id,
              name: member.name,
              email: member.email,
              password: member.password,
            } as ProjectMember)
        )
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error fetching data:', error);
        return throwError(() => new Error('Error fetching project members'));
      })
    );
  }

  store(member: ProjectMember): Observable<ProjectMember> {
    return this.http.post<ProjectMember>(`${this.baseUrl}/project_members`, { data: member }).pipe(
      tap((res: any) => console.log('✅ User registered successfully:', res)),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error while registering:', error);
        return throwError(() => new Error(error.error?.message || 'Unknown error'));
      })
    );
  }

  update(member: ProjectMember): Observable<ProjectMember> {
    return this.http.put<ProjectMember>(`${this.baseUrl}/project_members`, { data: member }).pipe(
      tap((res) => console.log('✅ User updated successfully:', res)),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error updating user:', error);
        return throwError(() => new Error(error.error?.message || 'Unknown error'));
      })
    );
  }


  delete(memberId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .request('DELETE', `${this.baseUrl}/project_members`, {
        headers,
        body: { id: memberId },
      })
      .pipe(
        tap(() => console.log(`🗑️ Deleted project member: ${memberId}`)),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Error deleting project member:', error);
          return throwError(() => new Error(error.error?.message || 'Unknown error'));
        })
      );
  }
}
