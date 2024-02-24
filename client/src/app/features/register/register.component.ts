import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginRegister } from 'src/app/models/login-register.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerData: LoginRegister = {
    username: '',
    password: '',
  };

  constructor(
    private accountService: AccountService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  register(): void {
    this.accountService.register(this.registerData).subscribe({
      next: () => {
        this.cancel();
      },
      error: (error) => {
        this.toastrService.error(error.error);
        console.log(error);
      },
    });
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }
}
