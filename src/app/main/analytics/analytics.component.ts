import {Component, OnDestroy} from '@angular/core';
import {ColorHelper, LegendPosition, ScaleType} from "@swimlane/ngx-charts";
import {StatisticService} from "../../core/services/statisticService";
import {untilDestroyed} from "../../core/services/until-destroyed";
import {BehaviorSubject, combineLatest, EMPTY, finalize, tap} from "rxjs";
import {ForecastedStatisticResult} from "../../core/models/forecasted-statistic-result.model";
import {StatisticItem} from "../../core/models/statistic-item.model";
import * as ss from 'simple-statistics';

import {curveBasis, curveNatural} from "d3";
import {AverageStatisticDto} from "../../core/models/average-statistic.dto";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnDestroy {

  ScaleType = ScaleType;

  legendPosition = LegendPosition.Right;
  // Define customColors array with your desired colors
  customColors: ColorHelper;
  statWithPredictions = [];
  areaStatWithPredictions = [];
  statWithPredictionsRefLines = [];

  usersAvgDistributionChart: any;
  usersTodayDistributionChart: any;
  betterThanToday: number;
  betterThanAvg: number;

  isLoading$ = new BehaviorSubject<boolean>(true);


  constructor(private statService: StatisticService) {
    const statWithPredictions$ = this.statService.getStatisticWithPrediction().pipe(
      tap(res => this.parseStatWithPredictions(res)),
      catchError(err => {
        this.areaStatWithPredictions = [];
        this.statWithPredictions = [];
        return EMPTY;
      })
    );
    const avgStat$ = this.statService.getAverageStatistic().pipe(
      tap(res => {
        this.calcBetterThanValues(res);
        this.usersAvgDistributionChart = this.calsUserProgressDistribution(res.averageUsersStatistic, res.activeUserAverage);
        this.usersTodayDistributionChart = this.calsUserProgressDistribution(res.todayUsersStatistic, res.activeUserToday);
      }),
    );

    combineLatest([
      statWithPredictions$,
      avgStat$
    ]).pipe(
      finalize(() => this.isLoading$.next(false)),
      untilDestroyed(this)
    ).subscribe();
  }

  ngOnDestroy() {
  }

  public curveNatural = curveNatural;
  public curveBasis = curveBasis;

  private parseStatWithPredictions(input: ForecastedStatisticResult) {
    const parseSeriesFn = (items: StatisticItem[], isPrediction: boolean) => items.map(item => ({
      name: new Date(item.date).toISOString().substring(0, 10),
      value: item.countOfDone,
      isPrediction
    }))
    input.storedItems = input.storedItems.slice(input.storedItems.length - 40, input.storedItems.length);
    console.log(input.forecastedItems)

    this.statWithPredictions = [
      {
        name: 'History',
        series: parseSeriesFn(input.storedItems, false)
      },
      {
        name: 'Prediction',
        series: parseSeriesFn([input.storedItems[input.storedItems.length - 1], ...input.forecastedItems], true)
      }
    ];

    this.statWithPredictionsRefLines = [
      {
        name: 'average',
        value: input.storedItems.map(x => x.countOfDone)
          .reduce((acc, nr) => acc + nr, 0) / input.storedItems.length
      }
    ];

    this.areaStatWithPredictions = [{
      name: '',
      series: parseSeriesFn([...input.storedItems, ...input.forecastedItems], false)
    }]
  }

  private calsUserProgressDistribution(usersData: number[], activeUserData: number): unknown[] {
    const kernel = ss.kernelDensityEstimation(usersData);

    const usersChartSeries = usersData.map(value => ({
      name: value,
      value: isNaN(kernel(value)) ? 0 : kernel(value)
    }));
    const activeUserChartSeries = usersChartSeries.map(cs => ({
      name: activeUserData,
      value: cs.value
    }))

    return [
      {
        name: 'Me',
        series: activeUserChartSeries
      },
      {
        name: 'Users',
        series: usersChartSeries
      }
    ];
  }

  private calcBetterThanValues(stat: AverageStatisticDto): void {
    const findPartial = (arr: number[], comparingNr: number) => {
      const currInd = arr.indexOf(comparingNr);
      const prepArr = [...arr.slice(0, currInd), ...arr.slice(currInd + 1, arr.length)];

      return prepArr.filter(item => item <= comparingNr).length / prepArr.length;
    }
    const preventIsNaN = (nr: number) => isNaN(nr) ? 0 : nr;

    this.betterThanToday = preventIsNaN(
      findPartial(stat.todayUsersStatistic, stat.activeUserToday)
    );
    this.betterThanAvg = preventIsNaN(
      findPartial(stat.averageUsersStatistic, stat.activeUserAverage)
    );
  }
}
