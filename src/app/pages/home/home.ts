import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { ButtonComponent } from '../../shared/components/button/button';
import { FormError } from '../../shared/components/form-error/form-error';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { CreateStudentModal } from '../../shared/components/create-student-modal/create-student-modal';
import { DataTable } from '../../shared/components/data-table/data-table';
import {
  CreateStudentPayload,
  OneTimeFeePaymentApi,
  StudentListItem,
} from '../../core/services/one-time-fee-payment-api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PageHeader,
    ButtonComponent,
    FormError,
    LoadingSpinner,
    ReactiveFormsModule,
    CreateStudentModal,
    DataTable,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  isLoading = true;
  errorMessage: string | null = null;
  isCreateModalOpen = false;
  isSubmitting = false;
  submitError: string | null = null;

  private readonly api = inject(OneTimeFeePaymentApi);
  private readonly fb = inject(FormBuilder);
  private readonly refresh$ = new Subject<void>();

  readonly createStudentForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly students = toSignal(
    this.refresh$.pipe(
      startWith(void 0),
      tap(() => {
        this.isLoading = true;
        this.errorMessage = null;
      }),
      switchMap(() =>
        this.api.listStudents().pipe(
          catchError((error) => {
            console.error('Failed to load students', error);
            this.errorMessage = 'Unable to load students. Please try again.';
            return of([] as StudentListItem[]);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
      )
    ),
    { initialValue: [] as StudentListItem[] }
  );

  readonly hasStudents = computed(() => this.students().length > 0);

  loadStudents(): void {
    this.refresh$.next();
  }

  openCreateStudentModal(): void {
    this.isCreateModalOpen = true;
    this.submitError = null;
    this.createStudentForm.reset({ name: '', email: '' });
  }

  closeCreateStudentModal(): void {
    this.isCreateModalOpen = false;
    this.submitError = null;
  }

  submitCreateStudent(): void {
    if (this.createStudentForm.invalid) {
      this.createStudentForm.markAllAsTouched();
      return;
    }

    const payload = this.createStudentForm.getRawValue() as CreateStudentPayload;
    this.isSubmitting = true;
    this.submitError = null;

    this.api.createStudent(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeCreateStudentModal();
        this.loadStudents();
      },
      error: (error) => {
        console.error('Failed to create student', error);
        this.submitError = 'Unable to create student. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  get nameControl() {
    return this.createStudentForm.get('name');
  }

  get emailControl() {
    return this.createStudentForm.get('email');
  }

  trackByStudentNumber = (_: number, student: StudentListItem): string =>
    student.studentNumber;
}
