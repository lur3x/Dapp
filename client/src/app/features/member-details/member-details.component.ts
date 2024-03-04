import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { Member } from 'src/app/models/member.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-details',
  standalone: true,
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
  imports: [CommonModule, TabsModule, GalleryModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailsComponent
  extends Destroyable(Object)
  implements OnInit
{
  member: Member | undefined;
  images: GalleryItem[] = [];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    console.log(username);
    this.userService
      .getMember(username)
      .pipe(this.takeUntilDestroyed())
      .subscribe((member) => {
        (this.member = member), this.getImages(), this.cd.markForCheck();
      });
  }

  getImages(): void {
    if (!this.member) return;
    for (const photo of this.member?.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }
}
