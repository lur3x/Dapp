import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { UserData } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends Destroyable(Object) implements OnInit {
  registerMode = false;
  users: UserData[] = [];

  constructor(private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  getUsers(): void {
    this.userService
      .getUsers()
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => (this.users = response),
        error: (error) => console.log(error),
        complete: () => console.log('Request has been completed'),
      });
  }

  cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }
}
