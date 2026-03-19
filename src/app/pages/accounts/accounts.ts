import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import {
  catchError,
  combineLatest,
  finalize,
  map,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { ButtonComponent } from '../../shared/components/button/button';
import { FormError } from '../../shared/components/form-error/form-error';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { MakePaymentModal } from '../../shared/components/make-payment-modal/make-payment-modal';
import { DataTable } from '../../shared/components/data-table/data-table';
import {
  AccountsApi,
  OneTimePaymentPayload,
  StudentAccount,
} from '../../core/services/accounts-api';
import { OneTimeFeePaymentApi, StudentListItem } from '../../core/services/one-time-fee-payment-api';

type AccountRow = StudentAccount & { studentName: string };

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    PageHeader,
    ButtonComponent,
    FormError,
    LoadingSpinner,
    MakePaymentModal,
    DataTable,
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
  isLoading = true;
  errorMessage: string | null = null;
  isPaymentModalOpen = false;
  isSubmittingPayment = false;
  paymentError: string | null = null;
  selectedStudentName = '';

  private readonly accountsApi = inject(AccountsApi);
  private readonly studentsApi = inject(OneTimeFeePaymentApi);
  private readonly fb = inject(FormBuilder);
  private readonly refresh$ = new Subject<void>();

  readonly paymentForm = this.fb.group({
    studentNumber: ['', [Validators.required]],
    paymentAmount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    currency: ['XAF', [Validators.required]],
    idempotencyKey: ['', [Validators.required]],
    paymentDate: ['', [Validators.required]],
  });

  readonly accounts = toSignal(
    this.refresh$.pipe(
      startWith(void 0),
      tap(() => {
        this.isLoading = true;
        this.errorMessage = null;
      }),
      switchMap(() =>
        combineLatest([
          this.accountsApi.listAccounts(),
          this.studentsApi.listStudents(),
        ]).pipe(
          map(([accounts, students]) => this.mapAccounts(accounts, students)),
          catchError((error) => {
            console.error('Failed to load accounts', error);
            this.errorMessage = 'Unable to load accounts. Please try again.';
            return of([] as AccountRow[]);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
      )
    ),
    { initialValue: [] as AccountRow[] }
  );

  readonly hasAccounts = computed(() => this.accounts().length > 0);

  loadAccounts(): void {
    this.refresh$.next();
  }

  openPaymentModal(account: AccountRow): void {
    this.isPaymentModalOpen = true;
    this.paymentError = null;
    this.selectedStudentName = account.studentName;

    this.paymentForm.reset({
      studentNumber: account.studentNumber,
      paymentAmount: null,
      currency: 'XAF',
      idempotencyKey: `IDK${Date.now()}`,
      paymentDate: this.todayDate(),
    });
  }

  closePaymentModal(): void {
    this.isPaymentModalOpen = false;
    this.paymentError = null;
  }

  submitPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const raw = this.paymentForm.getRawValue();
    const payload: OneTimePaymentPayload = {
      studentNumber: raw.studentNumber ?? '',
      paymentAmount: Number(raw.paymentAmount ?? 0),
      currency: raw.currency ?? 'XAF',
      idempotencyKey: raw.idempotencyKey ?? '',
      paymentDate: raw.paymentDate ?? '',
    };
    this.isSubmittingPayment = true;
    this.paymentError = null;

    this.accountsApi.createOneTimePayment(payload).subscribe({
      next: () => {
        this.isSubmittingPayment = false;
        this.closePaymentModal();
        this.loadAccounts();
      },
      error: (error) => {
        console.error('Failed to submit payment', error);
        this.paymentError = 'Unable to submit payment. Please try again.';
        this.isSubmittingPayment = false;
      },
    });
  }

  trackByAccountId = (_: number, account: AccountRow): number => account.id;

  formatAmount(amount: number, currency: string): string {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency}`;
    }
  }

  formatDate(value: string): string {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }

  get paymentAmountControl() {
    return this.paymentForm.get('paymentAmount');
  }

  get currencyControl() {
    return this.paymentForm.get('currency');
  }

  get paymentDateControl() {
    return this.paymentForm.get('paymentDate');
  }

  private mapAccounts(accounts: StudentAccount[], students: StudentListItem[]): AccountRow[] {
    const studentMap = new Map(
      students.map((student) => [
        student.studentNumber,
        student.fullName || student.name || student.studentNumber,
      ])
    );

    return accounts.map((account) => ({
      ...account,
      studentName: studentMap.get(account.studentNumber) ?? account.studentNumber,
    }));
  }

  private todayDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
