import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoginRegister } from 'src/app/models/login-register.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerData: LoginRegister = {
    username: '',
    password: '',
  };

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {}

  register(): void {
    this.accountService.register(this.registerData).subscribe({
      next: () => {
        this.cancel();
      },
      error: (error) => console.log(error),
    });
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }
}
