import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/authServices";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

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

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  public Login(){
    this.authService.login(this.userName, this.password).then(res => {
      if(res) {
        this.userName = '';
        this.password = '';

        this.router.navigate([''], {replaceUrl: true});
      }
    }).catch(err => this.toastr.error(err.message ?? 'Login failed'));
  }

  public Registration(){
    if (this.password !== this.passwordConfirmation) {
      this.toastr.error("Password confirmation failed");
      return;
    }

    this.authService.register(this.userName, this.password);
    /*.then(res => {
      debugger;
      if(res) {
        this.router.navigate([''],{replaceUrl: true});

        this.userName = '';
        this.password = '';
        this.passwordConfirmation = '';
      }
    }).catch(err => this.toastr.error(err.message));

     */
  }
}
