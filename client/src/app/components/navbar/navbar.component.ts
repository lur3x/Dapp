import { Component, OnInit } from '@angular/core';
import { LoginRegister } from 'src/app/models/login-register.model';
import { AccountService } from 'src/app/services/account.service';
import { Destroyable } from '../../mixins/destroyable.mixin';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent extends Destroyable(Object) implements OnInit {
  loginData: LoginRegister = {
    username: '',
    password: '',
  };
  constructor(public accountService: AccountService) {
    super();
  }

  ngOnInit(): void {}

  login(): void {
    this.accountService
      .login(this.loginData)
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => console.log(error),
      });
  }

  logout(): void {
    this.accountService.logout();
  }
}
