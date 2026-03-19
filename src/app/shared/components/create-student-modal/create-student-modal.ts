import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button';
import { FormError } from '../form-error/form-error';
import { TextField } from '../text-field/text-field';

@Component({
  selector: 'app-create-student-modal',
  standalone: true,
  imports: [ButtonComponent, FormError, TextField, ReactiveFormsModule],
  templateUrl: './create-student-modal.html',
  styleUrl: './create-student-modal.css',
})
export class CreateStudentModal {
  @Input() open = false;
  @Input() submitting = false;
  @Input() errorMessage: string | null = null;
  @Input() formGroup!: FormGroup;
  @Input() nameInvalid: boolean | null = null;
  @Input() nameError: string | null = null;
  @Input() emailInvalid: boolean | null = null;
  @Input() emailError: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submit.emit();
  }
}
