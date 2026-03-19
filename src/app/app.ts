import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayout } from './shared/components/app-layout/app-layout';
import { SideNavItem } from './shared/components/side-nav/side-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppLayout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly navItems: SideNavItem[] = [
    { label: 'Dashboard', route: '/home', nzIcon: 'dashboard' },
    { label: 'Accounts', route: '/accounts', nzIcon: 'wallet' },
    { label: 'Payments', route: '/payments', nzIcon: 'credit-card', badge: 3 },
    { label: 'Statements', route: '/statements', nzIcon: 'file-text' },
    { label: 'Activity', route: '/activity', nzIcon: 'fund' },
  ];
}
