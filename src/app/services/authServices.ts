import {HttpService} from "./httpService";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {AbstractUser} from "../models/abstract-user.model";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {map, Observable, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class AuthService{
  private tokenKey = '_token';
  private userNameKey = '_userName';
  private refreshTime = '_refreshTime';

  constructor(private http: HttpService, private router: Router, private toastr: ToastrService) {
  }
  isAuthorized(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return  (token && token !== '') as boolean;
  }

  async login(username: string, password: string): Promise<void>{
     await this.getToken(username, password);
  }

  register(username: string, password: string) {
    this.registrate(username,password)
      .subscribe(x => {
        console.log('x', x);
        localStorage.setItem(this.tokenKey, x["accessToken"]);
        localStorage.setItem(this.userNameKey, username);
        localStorage.setItem(this.refreshTime, x["lifeTime"]);
        this.stopRefreshTokenTimer();
        this.startRefreshTokenTimer();
        this.router.navigate([''], {replaceUrl: true});
      });
  }

  logout() {
    localStorage.clear();
    this.stopRefreshTokenTimer();
    this.router.navigate(['login']);
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`refresh-token`, {} )
      .pipe(tap(tokenObj => {
        this.startRefreshTokenTimer();
        localStorage.setItem(this.tokenKey, tokenObj.accessToken);
        localStorage.setItem(this.refreshTime, tokenObj.lifeTime);
        this.stopRefreshTokenTimer();
        this.startRefreshTokenTimer();
      }));
  }

  async checkIfPasswordMatches(pass: string): Promise<boolean> {
    if (!this.isAuthorized()) {
      return false;
    }

    return await this.http.post<boolean>('api/Account/checkPasswordIfMatch',
      null,
      new HttpParams().set('password', pass)
    ).toPromise() as any as boolean;
  }

  async changePassword(newPassword: string): Promise<any> {
    if (!this.isAuthorized()) {
      return;
    }

    return this.http.post<any>('api/Account/changePassword',
      null,
      new HttpParams().set('newPassword', newPassword)
    ).toPromise();

  }

  private async getToken(username: string, password: string): Promise<void>{
    const res = await this.http.post<any>('token', null, new HttpParams()
      .set('username',username)
      .set('password',password)
    ).toPromise();
    if (res) {
      localStorage.setItem(this.tokenKey, res["accessToken"]);
      localStorage.setItem(this.userNameKey, username);
      localStorage.setItem(this.refreshTime, res["lifeTime"]);
      this.stopRefreshTokenTimer();
      this.startRefreshTokenTimer();
    }
  }

  private registrate(username: string, pass: string): Observable<any> {

    const user =  new AbstractUser();
    user.email = username;
    user.hashPassword = pass;

    return this.http.post<any>('registration', user);
  }

  private startRefreshTokenTimer() {
    const liveTime = parseInt(localStorage.getItem(this.refreshTime) as string);
    const timeout = (liveTime*60-1) * 1000;
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  private refreshTokenTimeout: any;
}
