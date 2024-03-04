import { Component, OnInit } from '@angular/core';
import { LoginRegister } from 'src/app/models/login-register.model';
import { AccountService } from 'src/app/services/account.service';
import { Destroyable } from '../../mixins/destroyable.mixin';
import { Router } from '@angular/router';

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
  constructor(public accountService: AccountService, private router: Router) {
    super();
  }

  ngOnInit(): void {}

  login(): void {
    this.accountService
      .login(this.loginData)
      .pipe(this.takeUntilDestroyed())
      .subscribe((_) => this.router.navigateByUrl('/members'));
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
