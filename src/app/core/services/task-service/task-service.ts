import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Task } from '../../models/project';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Task[]> {
    return this.http.get<{ data: Task[] }>(`${this.baseUrl}/tasks`).pipe(
      tap((response) => console.log('Tasks fetched:', response)),
      map((response) => response.data),
      map((tasks) =>
        tasks.map((task) => ({
          id: task.id,
          projectId: task.projectId,
          title: task.title,
          description: task.description || '',
          assignedTo: task.assignedTo ?? null,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,  
          status: task.status,
        }))
      ),
      catchError((error: any) => {
        console.error('Error fetching tasks:', error);
        return throwError(() => new Error('Error fetching tasks'));
      })
    );
  }


  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`).pipe(
      tap((response) => console.log(`Task ${id} fetched:`, response)),
      catchError((error) => {
        console.error(`Error fetching task ${id}:`, error);
        return throwError(() => new Error(`Error fetching task ${id}`));
      })
    );
  }


  create(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task).pipe(
      tap((res) => console.log('Task created:', res)),
      catchError((error) => {
        console.error('Error creating task:', error);
        return throwError(() => new Error('Error creating task'));
      })
    );
  }


  update(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${task.id}`, task).pipe(
      tap((res) => console.log('Task updated:', res)),
      catchError((error) => {
        console.error('Error updating task:', error);
        return throwError(() => new Error('Error updating task'));
      })
    );
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`).pipe(
      tap(() => console.log(`Task ${id} deleted`)),
      catchError((error) => {
        console.error(`Error deleting task ${id}:`, error);
        return throwError(() => new Error(`Error deleting task ${id}`));
      })
    );
  }
}
