import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Destroyable } from 'src/app/mixins/destroyable.mixin';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestErrorComponent extends Destroyable(Object) {
  validationErrors: string[] = [];
  constructor(
    private errorService: ErrorService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  getNotFound(): void {
    this.errorService
      .getNotFound()
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => console.log(response),
        error: (err) => console.log(err),
      });
  }

  getBadRequest(): void {
    this.errorService
      .getBadRequest()
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => console.log(response),
        error: (err) => console.log(err),
      });
  }

  getServerError(): void {
    this.errorService
      .getServerError()
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => console.log(response),
        error: (err) => console.log(err),
      });
  }

  getAuthError(): void {
    this.errorService
      .getAuthError()
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => console.log(response),
        error: (err) => console.log(err),
      });
  }

  getValidationError(): void {
    this.errorService
      .getValidationError()
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => {
          console.log(error);
          this.validationErrors = error;
          this.cd.detectChanges();
        },
      });
  }
}
