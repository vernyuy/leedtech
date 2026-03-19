import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface SideNavItem {
  label: string;
  route: string;
  nzIcon?: string;
  badge?: string | number;
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, NzMenuModule, NzIconModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  title = input<string>('Navigation');
  items = input<SideNavItem[]>([]);
  collapsed = input<boolean>(false);
  collapseToggle = output<void>();

  toggleCollapsed(): void {
    this.collapseToggle.emit();
  }
}
