import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Member } from '../models/member.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.url}/users`).pipe(
      map((members) => {
        this.members = members;
        return members;
      }),
    );
  }

  getMember(username: string): Observable<Member> {
    const member = this.members.find((member) => member.userName === username);

    if (member) return of(member);
    return this.http.get<Member>(`${this.url}/users/${username}`);
  }

  updateMember(member: Member): Observable<void> {
    return this.http.put(`${this.url}/users`, member).pipe(
      map((_) => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      }),
    );
  }

  setMainPhoto(photoId: number): Observable<ArrayBuffer> {
    return this.http.put<ArrayBuffer>(`${this.url}/users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.url}/users/delete-photo/${photoId}`);
  }
}
