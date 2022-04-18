import {HttpService} from "./httpService";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {AbstractUser} from "../models/abstract-user.model";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {map, Observable} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class AuthService{
  private tokenKey = '_token';
  private userNameKey = '_userName';

  private refreshTime = 60;
  constructor(private http: HttpService, private router: Router, private toastr: ToastrService) {
  }
  isAuthorized(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return  (token && token !== '') as boolean;
  }

  async login(username: string, password: string): Promise<boolean>{
    const res = await this.getToken(username, password);
    if(res && res !== '') {
      localStorage.setItem(this.tokenKey, res);
      localStorage.setItem(this.userNameKey, username);
      this.router.navigate([''], {replaceUrl: true});
      return true;
    }
    return false;
  }

  register(username: string, password: string) {
    this.registrate(username,password)
      .subscribe(x => {
         this.login(username, password);
      }, err => this.toastr.error(err.message));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  private async getToken(username: string, password: string): Promise<string>{
    const res = await this.http.post<any>('token', null, new HttpParams()
      .set('username',username)
      .set('password',password)
    ).toPromise();
    if (res) {
      return res["accessToken"];
    }
    return '';
  }

  private registrate(username: string, pass: string): Observable<void> {

    const user =  new AbstractUser();
    user.email = username;
    user.hashPassword = pass;

    return this.http.post('registration', user);
  }

  private startRefreshTokenTimer() {
    const timeout = (this.refreshTime-1) * 1000;
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  refreshToken() {
    return this.http.post<any>(`refresh-token`, {}, )
      .pipe(map(t => {
        this.startRefreshTokenTimer();
        localStorage.setItem(this.tokenKey, t);
      }));
  }

  // helper methods

  private refreshTokenTimeout: any;
}
