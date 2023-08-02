import {Injectable} from "@angular/core";
import {SignalRService} from "./signalr.service";
import {BehaviorSubject, skip, tap} from "rxjs";
import {UserStatistic} from "../../models/user-statistic.model";
import {AuthService} from "../authServices";

@Injectable()
export class ChartHubService extends SignalRService {
  public statistic$ = new BehaviorSubject<UserStatistic>(null);
  protected hubUrl = 'https://localhost:44398/chart-hub';
  constructor(protected override auth: AuthService) {
    super(auth);

    this.buildClient();

    this.client.on(
      'StatisticUpdated',
        newState => this.statistic$.next(newState)
    );

    this.statistic$.pipe(skip(1)).subscribe();
  }
}
