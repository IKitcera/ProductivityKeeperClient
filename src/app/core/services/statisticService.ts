import {Injectable} from "@angular/core";
import {UserStatistic} from "../models/user-statistic.model";
import {HttpService} from "./httpService";
import {Observable} from "rxjs";
import {ForecastedStatisticResult} from "../models/forecasted-statistic-result.model";
import {AverageStatisticDto} from "../models/average-statistic.dto";

@Injectable()
export class StatisticService{
  constructor(private http: HttpService) {
  }
  getStatistics(): Observable<UserStatistic>{
    return this.http.get<UserStatistic>('api/Analytics');
  }

  getStatisticWithPrediction(): Observable<ForecastedStatisticResult>{
    return this.http.get<ForecastedStatisticResult>('api/Analytics/statistic-and-predictions');
  }

  getAverageStatistic(): Observable<AverageStatisticDto>{
    return this.http.get<AverageStatisticDto>('api/Analytics/average-users-statistic');
  }
}
