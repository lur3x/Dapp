import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { UserService } from 'src/app/services/user.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Member } from 'src/app/models/member.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.scss'],
  imports: [CommonModule, MemberCardComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListsComponent extends Destroyable(Object) implements OnInit {
  members$!: Observable<Member[]>;

  constructor(private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.members$ = this.userService.getMembers();
  }
}
