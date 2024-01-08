import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Itask } from '../interfaces/itask';

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

}
