import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { RegisterComponent } from '../register/register.component';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RegisterComponent],
  standalone: true,
})
export class HomeComponent extends Destroyable(Object) implements OnInit {
  registerMode = false;
  users: Member[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {}

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }
}
