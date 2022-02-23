import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/authServices";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string;
  password: string;
  passwordConfirmation: string;
  isRegistration = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  public Login(){
    this.authService.login(this.userName, this.password).then(res => {
      if(res) {
        this.userName = '';
        this.password = '';
      }
    }).catch(err => console.error(err.message));
  }

  public Registration(){
    if (this.password !== this.passwordConfirmation) {
      return;
    }

    this.authService.register(this.userName, this.password).then(res => {
      if(res) {
        this.userName = '';
        this.password = '';
        this.passwordConfirmation = '';
      }
    }).catch(err => console.error(err.message));
  }
}
