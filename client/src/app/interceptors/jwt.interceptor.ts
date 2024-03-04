import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { Destroyable } from '../mixins/destroyable.mixin';

@Injectable()
export class JwtInterceptor
  extends Destroyable(Object)
  implements HttpInterceptor
{
  constructor(private accountService: AccountService) {
    super();
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.accountService.currentUser$
      .pipe(this.takeUntilDestroyed())
      .subscribe((user) => {
        if (user) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`,
            },
          });
        }
      });
    return next.handle(request);
  }
}
