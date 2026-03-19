import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { OneTimeFeePaymentApi, StudentListItem } from './one-time-fee-payment-api';
import { environment } from '../../../environments/environment.generated';

describe('OneTimeFeePaymentApi', () => {
  let service: OneTimeFeePaymentApi;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OneTimeFeePaymentApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('lists students from the API when response is an array', () => {
    const response: StudentListItem[] = [
      { studentNumber: 'STU-001', fullName: 'Ada Lovelace' },
      { studentNumber: 'STU-002', fullName: 'Alan Turing' },
    ];

    service.listStudents().subscribe((students) => {
      expect(students).toEqual(response);
    });

    const baseUrl = environment.baseUrl || '/api';
    const request = httpTestingController.expectOne(`${baseUrl}/students`);
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });

  it('normalizes students when response is wrapped', () => {
    const response: StudentListItem[] = [
      { studentNumber: 'STU-003', fullName: 'Grace Hopper' },
    ];

    service.listStudents().subscribe((students) => {
      expect(students).toEqual(response);
    });

    const baseUrl = environment.baseUrl || '/api';
    const request = httpTestingController.expectOne(`${baseUrl}/students`);
    request.flush({ data: response });
  });
});
