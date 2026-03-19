import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentAccount {
  id: number;
  studentNumber: string;
  balance: number;
  currency: string;
  nextDueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OneTimePaymentPayload {
  studentNumber: string;
  paymentAmount: number;
  currency: string;
  idempotencyKey: string;
  paymentDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountsApi {
  private readonly accountsUrl = 'http://localhost:8080/api/v1/accounts';
  private readonly oneTimePaymentUrl = 'http://localhost:8080/api/v1/payments/one-time';

  constructor(private readonly http: HttpClient) {}

  listAccounts(): Observable<StudentAccount[]> {
    return this.http.get<StudentAccount[]>(this.accountsUrl);
  }

  createOneTimePayment(payload: OneTimePaymentPayload): Observable<unknown> {
    return this.http.post(this.oneTimePaymentUrl, payload);
  }
}
