import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinner {
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input<string>('Loading');
  showLabel = input<boolean>(true);
}
