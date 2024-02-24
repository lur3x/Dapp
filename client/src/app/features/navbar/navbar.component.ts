import { Component, OnInit } from '@angular/core';
import { LoginRegister } from 'src/app/models/login-register.model';
import { AccountService } from 'src/app/services/account.service';
import { Destroyable } from '../../mixins/destroyable.mixin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';

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
  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {}

  login(): void {
    this.accountService
      .login(this.loginData)
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (_) => this.router.navigateByUrl('/members'),
        error: (error) => this.toastrService.error(error.error),
      });
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
