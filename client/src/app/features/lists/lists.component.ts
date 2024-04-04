import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from 'src/app/models/member.model';
import { Pagination } from 'src/app/models/pagination.model';
import { UserService } from 'src/app/services/user.service';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
  imports: [CommonModule, FormsModule, MemberCardComponent, PaginationModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListsComponent {
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination!: Pagination | undefined;

  constructor(private userService: UserService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(value: string): void {
    this.predicate = value;
    this.loadLikes();
  }

  loadLikes(): void {
    this.userService
      .getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.members = response.result;
        this.pagination = response.pagination;
        this.cd.markForCheck();
      });
  }

  pageChanged(event: any): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
