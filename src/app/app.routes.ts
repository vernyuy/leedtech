import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Accounts } from './pages/accounts/accounts';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: Home },
  { path: 'accounts', component: Accounts },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
  },
];
