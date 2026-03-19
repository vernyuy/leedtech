import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Bell,
  ChevronDown,
  LucideAngularModule,
  Menu,
  Search,
  User,
} from 'lucide-angular';
import { ButtonComponent } from '../button/button';
import { TextField } from '../text-field/text-field';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  read?: boolean;
}

export interface LanguageOption {
  code: string;
  label: string;
  region?: string;
  flag?: string;
}

export interface HeaderUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  title?: string;
  profile?: string;
  role?: string;
  institutionName?: string | null;
  department?: string | null;
}

@Component({
  selector: 'lib-top-nav',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ButtonComponent,
    TextField,
  ],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav {
  isMobile = input<boolean>(false);
  headerClass = input<string>('');
  iconButtonClass = input<string>('');
  inputClass = input<string>('');
  notifications = input<Notification[]>([]);
  user = input<HeaderUser>({
    id: '1',
    name: 'Mr. Sarah Johnson',
    email: 'sarah.johnson@leedtech.com',
    initials: 'DSJ',
    title: 'Secretary',
    role: 'Admin',
    department: "",
    institutionName: "LeedTech"
  });
  searchPlaceholder = input<string>('Search anything...');

  menuClick = output<void>();
  logoutClick = output<void>();
  searchChange = output<string>();

    showProfileDropdown = false;
  searchValue = '';
  
  readonly icons = {
    bell: Bell,
    menu: Menu,
    search: Search,
    user: User,
    chevron: ChevronDown,
  };


  private readonly router = inject(Router);
  readonly unreadCount = computed(
    () => this.notifications().filter((item) => !item.read).length,
  );


  onLogout(): void {
    this.logoutClick.emit();
  }

  onMenuClick(): void {
    this.menuClick.emit();
  }

  onSearchInput(value: string): void {
    this.searchValue = value ?? '';
    this.searchChange.emit(this.searchValue);
  }

  toggleProfile(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
    this.showProfileDropdown = false;
  }
}
