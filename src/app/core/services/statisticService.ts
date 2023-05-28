import {Injectable} from "@angular/core";
import {UserStatistic} from "../models/user-statistic.model";
import {HttpService} from "./httpService";

@Injectable()
export class StatisticService{
  constructor(private http: HttpService) {
  }
  async getStatistics(): Promise<UserStatistic>{
    const res = await this.http.get<UserStatistic>('api/Analytics').toPromise();
    return (res as UserStatistic);
  }
}
