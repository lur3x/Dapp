import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Member } from '../models/member.model';
import { environment } from 'src/environments/environment';
import { PaginatedResults } from '../models/pagination.model';
import { UserParams } from '../models/user-params.model';
import { AccountService } from './account.service';
import { Destroyable } from '../mixins/destroyable.mixin';

@Injectable({
  providedIn: 'root',
})
export class UserService extends Destroyable(Object) {
  private url = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user!: User;
  userParams!: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    super();
    this.accountService.currentUser$.pipe(this.takeUntilDestroyed()).subscribe((user) => {
      if (user) {
        this.userParams = new UserParams(user);
        this.user = user;
      }
    });
  }

  getUserParams(): UserParams {
    return this.userParams;
  }

  setUserParams(params: UserParams): void {
    this.userParams = params;
  }

  resetUserParams(): UserParams | undefined {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  getMembers(userParams: UserParams): Observable<PaginatedResults<Member[]>> {
    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);

    return this.getPaginatedResults<Member[]>(`${this.url}/users`, params).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }),
    );
  }

  getMember(username: string): Observable<Member> {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);

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

  addLike(username: string): Observable<null> {
    return this.http.post<null>(`${this.url}/likes/${username}`, {});
  }

  getLikes(
    predicate: string,
    pageNumber: number,
    pageSize: number,
  ): Observable<PaginatedResults<Member[]>> {
    let params = this.getPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return this.getPaginatedResults<Member[]>(`${this.url}/likes/`, params);
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
}
