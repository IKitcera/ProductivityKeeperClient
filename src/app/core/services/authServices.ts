import {HttpService} from "./httpService";
import {HttpParams} from "@angular/common/http";
import {AbstractUser} from "../models/abstract-user.model";
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {interval, Observable, of, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {catchError} from "rxjs/operators";

@Injectable()
export class AuthService {
  private tokenKey = '_token';
  private userNameKey = '_userName';
  private refreshTime = '_refreshTime';
  private tokenExpired = '_tokenExpiredTime';

  private refreshTokenAttempts = 0;
  private readonly maxRefreshTokenAttempts = 2;

  public get token(): string {
    return localStorage.getItem(this.tokenKey)
  }

  constructor(
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute) {

    this.startRefreshTokenTimer();
  }

  isAuthorized(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return (token && token !== '') as boolean;
  }

  async login(username: string, password: string): Promise<void> {
    await this.getToken(username, password);
  }

  register(username: string, password: string) {
    this.registrate(username, password)
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
    this.refreshTokenAttempts++;
    if (this.refreshTokenAttempts === this.maxRefreshTokenAttempts) {
      this.refreshTokenAttempts = 0;
      this.logout();
      return of(null);
    }
    return this.http.post<any>(`refresh-token`, {}).pipe(
      tap(tokenObj => {
        this.startRefreshTokenTimer();
        localStorage.setItem(this.tokenKey, tokenObj.accessToken);
        localStorage.setItem(this.refreshTime, tokenObj.lifeTime);
        localStorage.setItem(this.tokenExpired, (parseInt(tokenObj.lifeTime) * 1000 * 60 + Date.now()).toString());
        console.log(tokenObj);
        this.stopRefreshTokenTimer();
        this.startRefreshTokenTimer();
        this.refreshTokenAttempts = 0;
        requestAnimationFrame(() => {
          this.router.navigate([], {relativeTo: this.activatedRoute}).then(x => {
            if (x) {
              window.location.reload();
            }
          });
        });

      }),
      catchError(err => {
        this.toastr.error(err?.message);
        this.logout();
        throw err;
      })
    );
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

  private async getToken(username: string, password: string): Promise<void> {
    const res = await this.http.post<any>('token', null, new HttpParams()
      .set('username', username)
      .set('password', password)
    ).toPromise();
    if (res) {
      localStorage.setItem(this.tokenKey, res["accessToken"]);
      localStorage.setItem(this.userNameKey, username);
      localStorage.setItem(this.refreshTime, res["lifeTime"]);
      localStorage.setItem(this.tokenExpired, (parseInt(res["lifeTime"]) * 1000 * 60 + Date.now()).toString());

      this.stopRefreshTokenTimer();
      this.startRefreshTokenTimer();
    }
  }

  private registrate(username: string, pass: string): Observable<any> {

    const user = new AbstractUser();
    user.email = username;
    user.hashPassword = pass;

    return this.http.post<any>('registration', user);
  }

  // not working piece of code
  private startRefreshTokenTimer() {
    if (!!this.refreshTokenTimeout) {
      return;
    }

    const expiredTime = parseInt(localStorage.getItem(this.tokenExpired) as string);
    const timeLeft = this.getTimeLeft(expiredTime);

    if (timeLeft <= 0) {
      console.log(timeLeft, expiredTime);
      console.log("Token already expired or not set");
      this.logout(); // Logout user if token is expired or not set
      return;
    }

    const liveTime = timeLeft ?? parseInt(localStorage.getItem(this.refreshTime) as string) * 60 * 1000;

    const timeout = (liveTime) - 5000;
    this.refreshTokenTimeout = setTimeout(() => {
      console.log('\x1b[36m%s\x1b[0m', 'Token refresh callback called')
      this.refreshTokenAttempts = 0;
      this.refreshToken().subscribe()
    }, timeout);

    console.log(liveTime, liveTime/60000, timeout/60000, 'esimatedtimeout-');
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  private getTimeLeft(futureTimestamp: number) {
    const currentTime = Date.now(); // Get current timestamp
    const timeLeft = futureTimestamp - currentTime; // Calculate time left
    return timeLeft >= 0 ? timeLeft : 0; // Ensure time left is non-negative
  }


  private refreshTokenTimeout: any;
}
