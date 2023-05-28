import {Observable, tap} from "rxjs";
import {filter} from "rxjs/operators";
import {untilDestroyed} from "../services/until-destroyed";

export const observableWrap$ = (obs$: Observable<any>) => obs$.pipe(
  untilDestroyed(this)
);

export function dialogObservableWrap$<T>(obs$: Observable<T>, compInstance: any): Observable<T> {
  return obs$.pipe(
    filter(res => !!res),
    untilDestroyed(compInstance)
  )
};
