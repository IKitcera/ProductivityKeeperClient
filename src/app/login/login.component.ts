import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/authServices";
import {Router} from "@angular/router";

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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  public Login(){
    this.authService.login(this.userName, this.password).then(res => {
      if(res) {
        this.userName = '';
        this.password = '';

        this.router.navigate([''], {replaceUrl: true});
      }
    }).catch(err => console.error(err.message));
  }

  public Registration(){
    if (this.password !== this.passwordConfirmation) {
      return;
    }

    this.authService.register(this.userName, this.password).then(res => {
      if(res) {
        this.authService.login(this.userName, this.password);

        this.userName = '';
        this.password = '';
        this.passwordConfirmation = '';
      }
    }).catch(err => console.error(err.message));
  }
}
