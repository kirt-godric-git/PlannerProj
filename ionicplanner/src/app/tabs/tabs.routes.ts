import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'create-todo',
        loadComponent: () =>
          import('../tasks/task-form/task-form.page').then((m) => m.TaskFormPage),
      },
      {
        path: 'edit-todo/:task_id',
        loadComponent: () =>
          import('../tasks/task-form/task-form.page').then((m) => m.TaskFormPage),
      },
      {
        path: 'create-goal',
        loadComponent: () =>
          import('../tasks/task-form/task-form.page').then((m) => m.TaskFormPage),
      },
      {
        path: 'edit-goal/:task_id',
        loadComponent: () =>
          import('../tasks/task-form/task-form.page').then((m) => m.TaskFormPage),
      },
      {
        path: 'tab4',
        loadComponent: () =>
          import('../tab4/tab4.page').then((m) => m.Tab4Page),
      },
      {
        path: 'create-note/:task_id',
        loadComponent: () =>
          import('../notes/note-form/note-form.page').then((m) => m.NoteFormPage),
      },

      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
