import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { CircleAlert, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './form-error.html',
  styleUrl: './form-error.css',
})
export class FormError {
  message = input<string | null>(null);
  show = input<boolean>(true);
  id = input<string | null>(null);

  readonly icon = CircleAlert;
}
