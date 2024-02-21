import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { Destroyable } from './mixins/destroyable.mixin';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends Destroyable(Object) implements OnInit {
  constructor(private accountService: AccountService) {
    super();
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
