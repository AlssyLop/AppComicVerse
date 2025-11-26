import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'explore',
        loadComponent: () =>
          import('../explore/explore.page').then((m) => m.ExplorePage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('../favorites/favorites.page').then((m) => m.FavoritesPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/explore',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/explore',
    pathMatch: 'full',
  },

];
