import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePickerComponent } from 'src/app/forms/date-picker/date-picker.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { LoginRegister } from 'src/app/models/login-register.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TextInputComponent,
    DatePickerComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class RegisterComponent extends Destroyable(Object) implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      birthDate: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value ? null : { notMatching: true };
    };
  }

  register() {
    const dob = this.GetDateOnly(this.registerForm.controls['birthDate'].value);
    const values = { ...this.registerForm.value, birthDate: this.GetDateOnly(dob) };
    this.accountService.register(values).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        this.validationErrors = error;
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private GetDateOnly(bd: string | undefined) {
    if (!bd) return;
    let theBd = new Date(bd);
    return new Date(theBd.setMinutes(theBd.getMinutes() - theBd.getTimezoneOffset()))
      .toISOString()
      .slice(0, 10);
  }
}
