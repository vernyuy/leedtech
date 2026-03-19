import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  title = input<string>('Page title');
  subtitle = input<string | null>(null);
  align = input<'start' | 'center' | 'end'>('start');
}
