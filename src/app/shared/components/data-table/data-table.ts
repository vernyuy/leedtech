import { Component, input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {
  title = input<string>('Table');
  subtitle = input<string | null>(null);
}
