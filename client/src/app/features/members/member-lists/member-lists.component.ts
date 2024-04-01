import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { UserService } from 'src/app/services/user.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Member } from 'src/app/models/member.model';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/models/pagination.model';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { UserParams } from 'src/app/models/user-params.model';
import { User } from 'src/app/models/user.model';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.scss'],
  imports: [CommonModule, MemberCardComponent, PaginationModule, FormsModule, ButtonsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListsComponent extends Destroyable(Object) implements OnInit {
  members: Member[] = [];
  pagination: Pagination | null = null;
  userParams!: UserParams;
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  constructor(private userService: UserService, private cd: ChangeDetectorRef) {
    super();
    this.userParams = this.userService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    if (this.userParams) {
      this.userService.setUserParams(this.userParams);
      this.userService
        .getMembers(this.userParams)
        .pipe(this.takeUntilDestroyed())
        .subscribe((response) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
            this.cd.detectChanges();
          }
        });
    }
  }

  resetFilters(): void {
    this.userParams = this.userService.resetUserParams()!;
    this.loadMembers();
  }

  pageChanged(event: any): void {
    if (this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.userService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
}
