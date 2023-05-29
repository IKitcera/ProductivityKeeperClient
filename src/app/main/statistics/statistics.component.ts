import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {StatisticService} from "../../core/services/statisticService";
import {UserStatistic} from "../../core/models/user-statistic.model";
import {GaugeComponent, LegendPosition, LineChartComponent, PieChartComponent} from "@swimlane/ngx-charts"
import {BehaviorSubject, tap} from "rxjs";
import {Category} from "../../core/models/category.model";
import {DonePerDay} from "../../core/models/done-per-day.model";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnDestroy, AfterViewInit {

  @ViewChild('gChart', {read: ElementRef, static: true}) gChart: GaugeComponent;
  @ViewChild('lChart') lChart: LineChartComponent;
  @ViewChild('pChart') pChart: PieChartComponent;

 // @Input() statistic: UserStatistic;

  @Input() set activeCtg(category: Category) {
    this.activeCategory = category;
    this.populateDonutChart();
  }

  private activeCategory: Category;
  public statisticSource$ = this.analytic.getStatistics();
  public statistic$ = new BehaviorSubject<UserStatistic>(null);

  // TODO: Replace with behaviour subj
  isLoading = false;
  lineChartScale = 1;
  single = [{'name': '', 'value': 0}];
  multi = [
    {
      'name': '',
      'series': [
        {
          "name": '',
          "value": 0
        }
      ]
    }
  ];

  donutChartData = [
    {
      "name": 'Done',
      value: 0
    },
    {
      "name": 'Not done',
      value: 0
    },
    {
      "name": 'Expired',
      value: 0
    },
  ];

  legend = true;
  legendPosition = LegendPosition.Below;

  SelectedChart = SelectedChart;
  selectedChart = SelectedChart.Gauge;

  constructor(private analytic: StatisticService) {
    this.statisticSource$.pipe(
      tap(stat => this.statistic$.next(stat))
    ).subscribe();
  }


  ngAfterViewInit() {
    this.statistic$.pipe(
      filter(x => !!x),
      tap(statistic => {
        this.single = [
          {
            "name": "Today",
            "value": statistic.percentOfDoneToday * 100
          },
          {
            "name": "Total",
            "value": statistic.percentOfDoneTotal * 100
          }
        ];

        if (this.gChart) {
          this.gChart.textValue = Math.round(statistic.percentOfDoneToday * 100) + ' % / \n' +
            Math.round(statistic.percentOfDoneTotal * 100) + ' %';
          this.gChart.scaleText(true);

        }

        this.scaleLinearGraphicsData(this.lineChartScale);
      })
    ).subscribe();
  }


  ngOnDestroy() {

  }

  getGaugeText(): string {
    return this.statistic$.value ? Math.round(this.statistic$.value.percentOfDoneToday * 100) + ' % / \n' +
      Math.round(this.statistic$.value.percentOfDoneTotal * 100) + ' %' :
      '-0%-/-0%-';
  }

  public populateDonutChart(): void {
    if (!this.activeCategory) return;

    if (this.pChart)
      this.pChart.margins = [0, 0, 0, 0];
    const tasks = (this.activeCategory.subcategories || []).map(s => s.tasks || []).flat();

    this.donutChartData = [
      {
        "name": 'Done',
        value: tasks.filter(t => t.isChecked).length || 0
      },
      {
        "name": 'Not done',
        value: tasks.filter(t => !t.isChecked).length || 0
      },
      {
        "name": 'Expired',
        value: tasks.filter(t => (t.deadline && t.doneDate && new Date(t.doneDate) >= new Date(t.deadline))
          || (!t.doneDate && t.deadline && new Date(t.deadline) < new Date() && !t.isChecked)).length || 0
      },
    ];
  }

  getCustomColors() {
    return [
      {"name": "Done", "value": "#32a88b"},
      {"name": "Not done", "value": "#93a39f"},
      {"name": "Expired", "value": "#d66d4d"}
    ]
  }

  scaleLinearGraphicsData(scaleWeek: number): void {
    this.lineChartScale = scaleWeek;

    const initData = this.statistic$.value.perDayStatistic;
    const thresholdDate = new Date();
    thresholdDate.setDate(new Date().getDate() - 7 * scaleWeek - 1);

    let filteredByDate = initData.filter(pd => new Date(pd.date) > thresholdDate);
    let resultChartData = filteredByDate;

    if (filteredByDate.length > 10) {
      resultChartData = [];

      let min = new Date(filteredByDate[0].date);
      let max = new Date(filteredByDate[filteredByDate.length - 1].date);

      const differenceInDays = (max.getTime() - min.getTime()) / (1000 * 3600 * 24);
      let step = Math.round((differenceInDays < 7 * scaleWeek ? differenceInDays : (7 * scaleWeek - differenceInDays)) / 10);

      let lastDonePerDay = new DonePerDay();
      lastDonePerDay.date = new Date(filteredByDate[0].date);
      lastDonePerDay.date.setDate(lastDonePerDay.date.getDate() + step);

      let minDate = new Date(min);

      for (let i = 0; i < 10; i++) {
        const upRangeDate = new Date(minDate);
        upRangeDate.setDate(upRangeDate.getDate() + step);

        const filteredByDateRange = filteredByDate.filter(dpd =>
          (new Date(dpd.date) >= minDate && new Date(dpd.date) <= upRangeDate));

        const resultItem = new DonePerDay();
        resultItem.date = upRangeDate;
        resultItem.countOfDone = filteredByDateRange
          .map(ite => ite.countOfDone)
          .reduce((x, y) => {
            const value = x + y;
            return value && !isNaN(value) ? value : 0;
          }, 0);
        if (resultItem.countOfDone > 0) {
          resultItem.countOfDone /= filteredByDateRange.length;
        }
        resultChartData.push(resultItem);
        minDate = upRangeDate;

      }
    }

    this.setLinearChart(resultChartData, scaleWeek);
  }

  private setLinearChart(data: DonePerDay[], scaleWeek: number) {
    this.multi = [
      {
        'name': 'Tasks/Day',
        'series': data.map(pd => {
          const date = new Date(pd.date);
          const tomorrowDate = new Date(pd.date);
          tomorrowDate.setDate(date.getDate() + 1);
          const sliceVal = scaleWeek > 4 ||
          tomorrowDate.toLocaleDateString().slice(0, 2) === '01' ||
          date.toLocaleDateString().slice(0, 2) === '01' ? 5 : 2;
          return {
            "name": date.toLocaleDateString().slice(0, sliceVal),
            "value": pd.countOfDone
          }
        })
      }
    ];
  }
}


export enum SelectedChart {
  Gauge,
  Line,
  Donut
}


