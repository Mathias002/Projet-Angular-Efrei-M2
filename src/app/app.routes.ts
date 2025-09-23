// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  // Routes publiques (accessibles seulement quand NON connecté)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component').then((c) => c.LoginComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component').then(
        (c) => c.RegisterComponent,
      ),
    canActivate: [NoAuthGuard],
  },

  // Routes protégées (accessibles seulement quand connecté)
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/dashboard/components/dashboard.component').then(
        (c) => c.DashboardComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/components/admin.component').then((c) => c.AdminComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'collections',
    loadComponent: () =>
      import('./features/collections/components/collection.component').then(
        (c) => c.CollectionsComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'mangas',
    loadComponent: () =>
      import('./features/mangas/components/manga.component').then((c) => c.MangaListComponent),
    canActivate: [AuthGuard],
  },
  //   {
  //     path: 'profile',
  //     loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent),
  //     canActivate: [AuthGuard]
  //   },
  //   {
  //     path: 'settings',
  //     loadComponent: () => import('./settings/settings.component').then(c => c.SettingsComponent),
  //     canActivate: [AuthGuard]
  //   },

  // Redirections
  {
    path: '',
    redirectTo: '/profile',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/profile',
  },
];
