import { Task } from "../models/project";
import { TaskStatus } from '../models/project';

export class TaskData {
  static getTasks(): Task[] {
    return [
      { id: 1, projectId: 1, title: 'Analyse', description: 'Erste Anforderungsanalyse', assignedTo: 1, status: TaskStatus.InProgress},
      { id: 2, projectId: 1, title: 'Implementierung', status: TaskStatus.NotStarted },
      { id: 3, projectId: 2, title: 'Datenanalyse', status: TaskStatus.Completed },
      { id: 4, projectId: 4, title: 'Planung', status: TaskStatus.InProgress }
    ];
  }
}