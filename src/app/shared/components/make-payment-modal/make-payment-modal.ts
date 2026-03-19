import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button';
import { FormError } from '../form-error/form-error';
import { TextField } from '../text-field/text-field';

@Component({
  selector: 'app-make-payment-modal',
  standalone: true,
  imports: [ButtonComponent, FormError, TextField, ReactiveFormsModule],
  templateUrl: './make-payment-modal.html',
  styleUrl: './make-payment-modal.css',
})
export class MakePaymentModal {
  @Input() open = false;
  @Input() submitting = false;
  @Input() errorMessage: string | null = null;
  @Input() formGroup!: FormGroup;
  @Input() studentName = '';
  @Input() paymentAmountInvalid: boolean | null = null;
  @Input() paymentAmountError: string | null = null;
  @Input() currencyInvalid: boolean | null = null;
  @Input() currencyError: string | null = null;
  @Input() paymentDateInvalid: boolean | null = null;
  @Input() paymentDateError: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submit.emit();
  }
}
