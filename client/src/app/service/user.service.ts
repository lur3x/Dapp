import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'https://localhost:5000/api';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/users/${id}`);
  }
}
