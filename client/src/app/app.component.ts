import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UserService } from './service/user.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  users: User[] = [];
  title = 'DAPP';

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserList();
  }

  private getUserList(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
        console.log(this.users);
        this.cd.detectChanges();
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }
}
