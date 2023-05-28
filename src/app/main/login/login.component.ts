import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../core/services/authServices";
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
      this.userName = '';
      this.password = '';
      this.router.navigate([''], {replaceUrl: true});
    });
  }

  public Registration(){
    if (this.password !== this.passwordConfirmation) {
      this.toastr.error("Password confirmation failed");
      return;
    }

    this.authService.register(this.userName, this.password);
  }
}
