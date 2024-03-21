import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { Member } from 'src/app/models/member.model';
import { User } from 'src/app/models/user.model';
import { AccountService } from '../../../services/account.service';
import { UserService } from 'src/app/services/user.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, TabsModule, FormsModule, PhotoEditorComponent, TimeagoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberEditComponent extends Destroyable(Object) implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any): void {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member | undefined;
  user: User | null = null;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef,
  ) {
    super();
    this.accountService.currentUser$
      .pipe(this.takeUntilDestroyed())
      .subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(): void {
    if (!this.user) return;

    this.userService
      .getMember(this.user.username)
      .pipe(this.takeUntilDestroyed())
      .subscribe((member) => {
        this.member = member;
        this.cd.markForCheck();
      });
  }

  updateMember(): void {
    this.userService
      .updateMember(this.editForm?.value)
      .pipe(this.takeUntilDestroyed())
      .subscribe((_) => {
        this.toastrService.success('Profile updated successfully!');
        this.editForm?.reset(this.member);
        this.cd.markForCheck();
      });
  }
}
