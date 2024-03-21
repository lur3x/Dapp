import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Member } from '../models/member.model';
import { environment } from 'src/environments/environment';
import { PaginatedResults } from '../models/pagination.model';
import { UserParams } from '../models/user-params.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) {}

  getMembers(userParams: UserParams): Observable<PaginatedResults<Member[]>> {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);

    return this.getPaginatedResults<Member[]>(`${this.url}/users`, params);
  }

  private getPaginatedResults<T>(url: string, params: HttpParams): Observable<PaginatedResults<T>> {
    const paginatedResult: PaginatedResults<T> = new PaginatedResults<T>();

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => {
        if (response.body) {
          paginatedResult.result = response.body;
        }

        const pagination = response.headers.get('Pagination');

        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }

        return paginatedResult;
      }),
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number): HttpParams {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return params;
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
