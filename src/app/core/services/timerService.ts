import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Timer } from '../models/timer.model';
import { TimerFormat } from '../../main/timer/timer.component';
import {HttpService} from "./httpService";

@Injectable()
export class TimerService {
  private apiUrl = 'api/Timer';

  constructor(private http: HttpService) {}

  getTimer(): Observable<Timer> {
    return this.http.get<Timer>(this.apiUrl);
  }

  setTimer(timer: Timer): Observable<Timer> {
    return this.http.post<Timer>(this.apiUrl, timer);
  }

  updateTicked(tickedSeconds: number): Observable<boolean> {
    const params = new HttpParams().set('tickedSeconds', tickedSeconds.toString());
    return this.http.post<boolean>(`${this.apiUrl}/update-ticked`, null, params);
  }

  updateFormat(newFormat: TimerFormat): Observable<any> {
    const params = new HttpParams().set('newFormat', newFormat.toString());
    return this.http.put<any>(`${this.apiUrl}/update-format`, null, params);
  }
}
