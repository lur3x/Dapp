import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../models/member.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.url}/users`);
  }

  getMember(username: string): Observable<Member> {
    return this.http.get<Member>(`${this.url}/users/${username}`);
  }
}
