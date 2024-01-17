import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Itask } from '../interfaces/itask';
import { Inote } from '../interfaces/inote';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks() {
    return this.http.get<Itask[]>('http://localhost:3000/tasks');
  }

  getWeeklyTasks() {
    return this.http.get<Itask[]>('http://localhost:3000/weeklytasks');
  }

  getMonthlyTasks() {
    return this.http.get<Itask[]>('http://localhost:3000/monthlytasks');
  }

  getAchievedTasks() {
    return this.http.get<Itask[]>('http://localhost:3000/achievedtasks');
  }

  createTask(formData: any) {
    return this.http.post<Itask>('http://localhost:3000/tasks', formData);
  }

  getTask(taskId: number) {
    return this.http.get<Itask>(`http://localhost:3000/tasks/${taskId}`);
  }

  updateTask(taskId: number, formData: any) {
    //return this.http.patch<Itask>(`http://localhost:3000/tasks/${taskId}`, formData);
    return this.http.put<Itask>(`http://localhost:3000/tasks/${taskId}`, formData);
  }

  updateTaskStatus(taskId: number, formData: any) {
    console.log(`Call API PUT http://localhost:3000/taskstatus/${taskId}`);
    let apiResponse = this.http.patch<Itask>(`http://localhost:3000/taskstatus/${taskId}`, formData);
    console.log(apiResponse);
    return apiResponse;
    // return this.http.patch<Itask>(`http://localhost:3000/taskstatus/${taskId}`, formData);
  }

  deleteTask(taskId: number) {
    return this.http.delete<Itask>(`http://localhost:3000/tasks/${taskId}`);
  }

  createNote(formData: any) {
    return this.http.post<Inote>('http://localhost:3000/notes', formData);
  }

}
