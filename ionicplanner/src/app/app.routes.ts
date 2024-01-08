import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'task-form',
    loadComponent: () => import('./tasks/task-form/task-form.page').then( m => m.TaskFormPage)
  },
];
