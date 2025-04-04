import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Task, TaskStatus } from '../../models/project';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

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
          assignedTo: task.assignedTo ?? null, // ✅ FIXED: Now should correctly hold just the ID
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
  

/**
 * ✅ Creates a new Task
 */
createTask(task: Partial<Task>): Observable<Task> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  console.log('📤 Sending request to create task:', task);

  return this.http.post<Task>(`${this.baseUrl}/tasks`, {
    project_id: task.projectId,  // ✅ muss exakt so heißen wie in der Datenbank!
    title: task.title,
    description: task.description,
    assigned_to: task.assignedTo,
    due_date: task.dueDate,
    status: task.status,
  }, { headers }).pipe(
    tap((newTask) => console.log('✅ Task Created:', newTask)),
    catchError((error) => {
      console.error('❌ Error creating task:', error);
      console.error('🔍 Response:', error.error);
      return throwError(() => new Error('Error creating task'));
    })
  );
  
}

/**
 * ✅ Updates an existing Task
 */
updateTask(task: Task): Observable<Task> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  console.log('📤 Sending request to update task:', task);

  return this.http.put<Task>(`${this.baseUrl}/tasks`, task, { headers }).pipe(
    tap((updatedTask) => {
      console.log('✅ Task successfully updated:', updatedTask);
    }),
    catchError((error) => {
      console.error('❌ Error updating task:', error);
      console.error('🔍 HTTP Status:', error.status);
      console.error('🔍 Error Message:', error.message);
      console.error('🔍 API Response:', error.error);
      return throwError(() => new Error('Error updating task'));
    })
  );
}


  /**
   * ✅ Löscht eine Task
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks?id=${id}`).pipe(
      tap(() => console.log(`✅ Task ${id} deleted successfully`)),
      catchError((error) => {
        console.error(`❌ Error deleting task ${id}:`, error);
        return throwError(() => new Error(`Error deleting task ${id}`));
      })
    );
  }
  
  
  
}
