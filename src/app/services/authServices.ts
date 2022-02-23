import {HttpService} from "./httpService";
import {HttpHeaders} from "@angular/common/http";
import {AbstractUser} from "../models/abstract-user.model";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthService{
  private tokenKey = '_token';
  private userNameKey = '_userName';

  constructor(private http: HttpService) {
  }
  isAuthorized(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return  (token && token !== null && token !== '') as boolean;
  }

  async login(username: string, password: string): Promise<boolean>{
    const res = await this.getToken(username, password);
    if(res && res !== null && res !== '') {
      localStorage.setItem(this.tokenKey, res);
      localStorage.setItem(this.userNameKey, username);
      return true;
    }
    return false;
  }

  async register(username: string, password: string){
    const res = await this.registrate(username,password);
    if(res && res !== null && res !== '') {
      localStorage.setItem(this.tokenKey, res);
      localStorage.setItem(this.userNameKey, username);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.clear();
  }

  private async getToken(username: string, password: string): Promise<string>{
    return await this.http.post<string>('Account/token', null, new HttpHeaders()
      .set('username',username)
      .set('password',password)
    ).toPromise() as string;
  }

  private async registrate(username: string, pass: string): Promise<string>{
    const user =  new AbstractUser();
    user.email = username;
    user.hashPassword = pass;
    return await this.http.post<string>('Account/registration', user).toPromise() as string;
  }
}
