import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  busy(): void {
    this.busyRequestCount += 1;
    this.spinnerService.show(undefined, {
      type: 'cube-transition',
      bdColor: 'rgba(255, 255, 255, 0)',
      color: '#32fbe2',
    });
  }

  idle(): void {
    this.busyRequestCount -= 1;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
