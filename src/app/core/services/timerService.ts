import {Timer} from "../models/timer.model";
import {HttpService} from "./httpService";
import {Injectable} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {TimerFormat} from "../../main/timer/timer.component";

@Injectable()
export class TimerService{
  constructor(private http: HttpService) { }

  async getTimer(): Promise<Timer> {
    const res = await this.http.get<Timer>('api/Timer').toPromise();
    return (res as Timer);
  }

  async postTimer(timer: Timer): Promise<boolean>{
    const res = await this.http.post('api/Timer', timer).toPromise();
    return (res as boolean);
  }

  async updateTicked(tickedSeconds: number): Promise<boolean>{
    const res = await this.http.post('update-ticked', null, new HttpParams().set('tickedSeconds', tickedSeconds)).toPromise();
    return res as boolean;
  }

  async updateFormat(newFormat: TimerFormat): Promise<any> {
    const res = await this.http.put('api/Timer/update-format', null, new HttpParams().set('newFormat', newFormat)).toPromise();
    return res;
  }
}
