import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private baseUrl = 'https://localhost:5001/api';
  private errorUrl = `${this.baseUrl}/errorHandling`;

  constructor(private http: HttpClient) {}

  getNotFound(): Observable<void> {
    return this.http.get<void>(`${this.errorUrl}/notFound`);
  }

  getBadRequest(): Observable<void> {
    return this.http.get<void>(`${this.errorUrl}/badRequest`);
  }

  getServerError(): Observable<void> {
    return this.http.get<void>(`${this.errorUrl}/serverError`);
  }

  getAuthError(): Observable<void> {
    return this.http.get<void>(`${this.errorUrl}/auth`);
  }

  getValidationError(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/account/register`, {});
  }
}
