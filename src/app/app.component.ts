import {Component, Inject, ViewChild} from '@angular/core';
import {AuthService} from "./core/services/authServices";
import {TaskListComponent} from "./main/task-list/task-list.component";
import {BehaviorSubject} from "rxjs";
import {StorageConstants} from "./core/constants/storage-constants";
import {DOCUMENT} from "@angular/common";
import {StorageService} from "./core/services/storageService";
import {Theme} from "./core/enums/theme.enum";
import {findEnumByValueFn} from "./core/functions/find-enum-by-value.fuction";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('router') router: any;
  title = 'ProductivityKeeperClient';
  isLoading = new BehaviorSubject(false);

  constructor(
    public authService: AuthService,
    storageService: StorageService,
    @Inject(DOCUMENT) document: Document
  ) {
    const existingTheme= storageService.retrieveProp<Theme>(
      StorageConstants.selectedTheme,
      Theme.Dark,
      (key, value) =>  findEnumByValueFn(Theme, value)
    );
    document.documentElement.classList.add(`${existingTheme}-theme`);
  }

  routeChanged(component: any) {
    const cast = component as TaskListComponent;
    if (cast && cast.loaderStateChanged) {
      cast.loaderStateChanged.subscribe(x => {
        this.isLoading.next(x);
      })
    }
    else {
      this.isLoading.next(false);
    }
  }
}
