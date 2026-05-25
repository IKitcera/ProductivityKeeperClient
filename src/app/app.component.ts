import {Component, Inject, isDevMode, ViewChild, DOCUMENT, OnDestroy} from '@angular/core';
import {AuthService} from "./core/services/authServices";
import {TaskListComponent} from "./main/task-list/task-list.component";
import {BehaviorSubject, debounceTime, tap} from "rxjs";
import {StorageConstants} from "./core/constants/storage-constants";

import {StorageService} from "./core/services/storageService";
import {Theme} from "./core/enums/theme.enum";
import {findEnumByValueFn} from "./core/functions/find-enum-by-value.fuction";
import {toSignal} from "@angular/core/rxjs-interop";
import {untilDestroyed} from "./core/services/until-destroyed";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnDestroy {
  @ViewChild('router') router: any;
  title = 'ProductivityKeeperClient';
  isLoading$ = new BehaviorSubject(false);
  isLoading = toSignal(
    this.isLoading$.pipe(
      untilDestroyed(this),
      debounceTime(1000)
    )
  );

  constructor(
    public authService: AuthService,
    storageService: StorageService,
    @Inject(DOCUMENT) document: Document
  ) {
    console.log(isDevMode())
    const existingTheme = storageService.retrieveProp<Theme>(
      StorageConstants.selectedTheme,
      Theme.Dark,
      (key, value) => findEnumByValueFn(Theme, value)
    );
    document.documentElement.classList.add(`${existingTheme}-theme`);
  }

  ngOnDestroy() {
  }

  routeChanged(component: any) {
    const cast = component as TaskListComponent;
    if (cast && cast.loaderStateChanged) {
      cast.loaderStateChanged.pipe(
        tap(x => this.isLoading$.next(x)),
        untilDestroyed(this),
      ).subscribe();
    } else {
      this.isLoading$.next(false);
    }
  }
}
