import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment.generated';

export interface StudentListItem {
  studentNumber: string;
  fullName?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class OneTimeFeePaymentApi {
  private readonly baseUrl = environment.baseUrl || '/api';

  constructor(private readonly http: HttpClient) {}

  listStudents(): Observable<StudentListItem[]> {
    return this.http
      .get<unknown>(`${this.baseUrl}/students`)
      .pipe(map((response) => this.normalizeStudentList(response)));
  }

  createStudent(payload: CreateStudentPayload): Observable<StudentListItem> {
    return this.http.post<StudentListItem>(`${this.baseUrl}/students`, payload);
  }

  private normalizeStudentList(response: unknown): StudentListItem[] {
    if (Array.isArray(response)) {
      return response as StudentListItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const record = response as Record<string, unknown>;
    const candidates = [
      record['students'],
      record['data'],
      record['items'],
      record['results'],
      record['records'],
      record['content'],
    ];

    for (const candidate of candidates) {
      const found = this.extractStudentArray(candidate);
      if (found) {
        return found;
      }
    }

    const deepFound = this.findStudentArray(record, 3);
    return deepFound ?? [];
  }

  private extractStudentArray(candidate: unknown): StudentListItem[] | null {
    if (Array.isArray(candidate)) {
      return candidate as StudentListItem[];
    }

    if (candidate && typeof candidate === 'object') {
      const nested = candidate as Record<string, unknown>;
      const nestedCandidates = [
        nested['items'],
        nested['results'],
        nested['records'],
        nested['content'],
      ];
      for (const nestedCandidate of nestedCandidates) {
        if (Array.isArray(nestedCandidate)) {
          return nestedCandidate as StudentListItem[];
        }
      }
    }

    return null;
  }

  private findStudentArray(value: unknown, depth: number): StudentListItem[] | null {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return value as StudentListItem[];
      }
      const looksLikeStudent = value.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          ('studentNumber' in item || 'name' in item || 'fullName' in item)
      );
      return looksLikeStudent ? (value as StudentListItem[]) : null;
    }

    if (!value || typeof value !== 'object' || depth <= 0) {
      return null;
    }

    for (const key of Object.keys(value as Record<string, unknown>)) {
      const found = this.findStudentArray(
        (value as Record<string, unknown>)[key],
        depth - 1
      );
      if (found) {
        return found;
      }
    }

    return null;
  }
}
