import {Injectable} from "@angular/core";
import {UserStatistic} from "../models/user-statistic.model";
import {HttpService} from "./httpService";
import {Observable} from "rxjs";

@Injectable()
export class StatisticService{
  constructor(private http: HttpService) {
  }
  getStatistics(): Observable<UserStatistic>{
    return this.http.get<UserStatistic>('api/Analytics');
  }
}
