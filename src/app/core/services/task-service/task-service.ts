import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Task, TaskStatus } from '../../models/project';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // baseUrl = 'http://trackyourproject.lovestoblog.com/api'; //does not work due CORS issues
  baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) {}

  /**
   * ✅ Holt alle Tasks aus der API
   */
  getAll(): Observable<Task[]> {
    return this.http.get<{ data: Task[] }>(`${this.baseUrl}/tasks`).pipe(
      tap((response) => console.log('Tasks fetched:', response)),
      map((response) => response.data),
      map((tasks) =>
        tasks.map((task) => ({
          id: task.id,
          projectId: task.projectId ?? null,  
          title: task.title,
          description: task.description || '',
          assignedTo: task.assignedTo ?? null,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          status: task.status as TaskStatus,
        }))
      ),
      tap((tasks) => console.log('🔄 Mapped Tasks with ProjectID:', tasks)),
      catchError((error: any) => {
        console.error('Error fetching tasks:', error);
        return throwError(() => new Error('Error fetching tasks'));
      })
    );
  }
  

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.getAll().pipe(
      map((tasks) => tasks.filter((task) => task.projectId === projectId)),
      tap((filteredTasks) => console.log(`Tasks for project ${projectId} filtered:`, filteredTasks)),
      catchError((error: any) => {
        console.error(`Error fetching tasks for project ${projectId}:`, error);
        return throwError(() => new Error(`Error fetching tasks for project ${projectId}`));
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
