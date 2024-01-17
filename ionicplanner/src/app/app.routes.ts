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
  {
    path: 'tab4',
    loadComponent: () => import('./tab4/tab4.page').then( m => m.Tab4Page)
  },
  {
    path: 'note-form',
    loadComponent: () => import('./notes/note-form/note-form.page').then( m => m.NoteFormPage)
  },
];
