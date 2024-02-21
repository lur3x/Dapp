import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'https://localhost:5001/api';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.url}/users`);
  }

  getUserById(id: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.url}/users/${id}`);
  }
}
