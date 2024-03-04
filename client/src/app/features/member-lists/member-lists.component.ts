import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { UserService } from 'src/app/services/user.service';
import { Member } from '../../models/member.model';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.scss'],
  imports: [CommonModule, MemberCardComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListsComponent
  extends Destroyable(Object)
  implements OnInit
{
  members: Member[] = [];

  constructor(private userService: UserService, private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.userService
      .getMembers()
      .pipe(this.takeUntilDestroyed())
      .subscribe(
        (members) => ((this.members = members), this.cd.markForCheck())
      );
  }
}
