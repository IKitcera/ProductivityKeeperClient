import {Component, ViewChild} from '@angular/core';
import {AuthService} from "./core/services/authServices";
import {TaskListComponent} from "./main/task-list/task-list.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('router') router: any;
  title = 'ProductivityKeeperClient';
  isLoading = new BehaviorSubject(false);

  constructor(public authService: AuthService) {
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
