import {HttpService} from "./httpService";
import {HttpHeaders} from "@angular/common/http";

export class AuthService{
  private tokenKey = '_token';
  private userNameKey = '_userName';

  constructor(private http: HttpService) {
  }
  isAuthorized(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return  (token && token !== null && token !== '') as boolean;
  }

  async login(username: string, password: string): boolean{
    const res = await this.getToken(username, password);
    if(res && res !== null && res !== '') {
      localStorage.setItem(this.tokenKey, res);
      localStorage.setItem(this.userNameKey, username);
      return true;
    }
    return false;
  }

  register(username: string, password: string){

  }

  logout() {

  }

  private async getToken(username: string, password: string): Promise<string>{
    return await this.http.post<string>('Account/token', null, new HttpHeaders()
      .set('username',username)
      .set('password',password)
    ).toPromise() as string;
  }
}
