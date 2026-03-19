import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, input, signal } from '@angular/core';
import { SideNav, SideNavItem } from '../side-nav/side-nav';
import { TopNav, HeaderUser, LanguageOption, Notification } from '../top-nav/top-nav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, TopNav, SideNav],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout implements OnInit {
  navTitle = input<string>('Main');
  navItems = input<SideNavItem[]>([]);
  isMobile = input<boolean>(false);

  notifications = input<Notification[]>([]);
  user = input<HeaderUser | null>(null);
  readonly isCollapsed = signal<boolean>(false);

  readonly resolvedUser = computed<HeaderUser>(() => {
    return (
      this.user() ?? {
    id: '1',
    name: 'Mr. Sarah Johnson',
    email: 'sarah.johnson@leedtech.com',
    initials: 'DSJ',
    title: 'Secretary',
    role: 'Admin',
    department: "",
    institutionName: "LeedTech"
  }
    );
  });

  ngOnInit(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    this.isCollapsed.set(!isDesktop);
  }

  toggleSideNav(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }
}
