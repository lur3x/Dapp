import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastrService = inject(ToastrService);

  return accountService.currentUser$.pipe(
    map((user) => {
      if (user) return true;
      else {
        toastrService.error('You are not logged in');
        return false;
      }
    })
  );
};
