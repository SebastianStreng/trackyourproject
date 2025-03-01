import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProjectMember } from '../../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  // baseUrl = 'http://trackyourproject.lovestoblog.com/api';
  baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<{ data: any[] }>(`${this.baseUrl}/project_members`).pipe(
      tap((r) => console.log(r)),
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
      catchError((error: any) => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Error fetching data'));
      })
    );
  }

  store(member: ProjectMember) {
    return this.http.post(`${this.baseUrl}/store_project_member`, { data: member }).pipe(
      tap((res: any) => {
        console.log('Response from store:', res);
        return res['data'];
      }),
      catchError((error) => {
        console.error('Error in store:', error);
        return throwError(error);
      })
    );
  }

  update(member: ProjectMember) {
    return this.http.put(`${this.baseUrl}/update_project_member`, { data: member });
  }
}
