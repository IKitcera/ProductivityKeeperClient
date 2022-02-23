import { Component } from '@angular/core';
import {AuthService} from "./services/authServices";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProductivityKeeperClient';

  constructor(private authService: AuthService) {
  }

}
