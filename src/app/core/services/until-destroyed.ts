import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function untilDestroyed<T>(component: { ngOnDestroy(): void }): (source: any) => any {
  const destroyed$ = new Subject<void>();

  const oldNgOnDestroy = component.ngOnDestroy;

  component.ngOnDestroy = () => {
    oldNgOnDestroy && oldNgOnDestroy.apply(component);
    destroyed$.next();
    destroyed$.complete();
  };

  return (source: any) => source.pipe(takeUntil(destroyed$));
}

