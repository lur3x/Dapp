import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from 'src/app/models/member.model';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import { Photo } from 'src/app/models/photo.model';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoEditorComponent extends Destroyable(Object) implements OnInit {
  @Input() member!: Member;
  uploader: FileUploader | undefined;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
  ) {
    super();
    this.accountService.currentUser$.pipe(this.takeUntilDestroyed()).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.userService
      .setMainPhoto(photo.id)
      .pipe(this.takeUntilDestroyed())
      .subscribe((_) => {
        if (this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach((p) => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          });
        }
        this.cd.markForCheck();
      });
  }

  deletePhoto(photoId: number) {
    this.userService
      .deletePhoto(photoId)
      .pipe(this.takeUntilDestroyed())
      .subscribe((_) => {
        if (this.member) {
          this.member.photos = this.member?.photos.filter((x) => x.id !== photoId);
          this.cd.markForCheck();
        }
      });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/users/add-photo`,
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
      }
      this.cd.markForCheck();
    };
  }
}
