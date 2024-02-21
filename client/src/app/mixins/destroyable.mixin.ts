import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Injectable, OnDestroy } from '@angular/core';

import { GenericConstructor } from './generic-constructor.type';

export interface TakeUntilDestroyed {
  takeUntilDestroyed<T>(): MonoTypeOperatorFunction<T>;
}

export function Destroyable<TBase extends GenericConstructor>(
  Base: TBase
): TBase & GenericConstructor<TakeUntilDestroyed & OnDestroy> {
  @Injectable()
  abstract class DestroyableClass
    extends Base
    implements TakeUntilDestroyed, OnDestroy
  {
    private subject = new Subject();

    takeUntilDestroyed = <T>(): MonoTypeOperatorFunction<T> =>
      takeUntil(this.subject);

    ngOnDestroy(): void {
      this.subject.next(null);
      this.subject.complete();
    }
  }

  return DestroyableClass;
}
