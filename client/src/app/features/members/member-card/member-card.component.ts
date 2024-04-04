import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from 'src/app/models/member.model';
import { RouterModule } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent extends Destroyable(Object) {
  @Input() member: Member | undefined;

  constructor(private userService: UserService, private toastrService: ToastrService) {
    super();
  }

  addLike(member: Member): void {
    this.userService
      .addLike(member.userName)
      .pipe(this.takeUntilDestroyed())
      .subscribe(() => this.toastrService.success('Liked'));
  }
}
