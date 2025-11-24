import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'character-details/:id',
    loadComponent: () => import('./pages/character-details/character-details.page').then( m => m.CharacterDetailsPage)
  },
];
