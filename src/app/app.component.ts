import {Component, ViewChild} from '@angular/core';
import {AuthService} from "./services/authServices";
import {TaskListComponent} from "./main/task-list/task-list.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('router') router: any;
  title = 'ProductivityKeeperClient';
  isLoading = false;

  constructor(public authService: AuthService) {
  }


  routeChanged(component: any) {

    const cast = component as TaskListComponent;
    if (cast && cast.loaderStateChanged) {
      cast.loaderStateChanged.subscribe(x => {
        this.isLoading = x;
      })
    }
  }
}
