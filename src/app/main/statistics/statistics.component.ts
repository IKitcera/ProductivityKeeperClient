import {Component, OnInit, ViewChild} from '@angular/core';
import {StatisticService} from "../../services/statisticService";
import {UserStatistic} from "../../models/user-statistic.model";
import {GaugeComponent, LegendPosition, LineChartComponent, ScaleType} from "@swimlane/ngx-charts"

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  @ViewChild('gChart') gChart: GaugeComponent;
  @ViewChild('lChart') lChart: LineChartComponent;

  statistic: UserStatistic = new UserStatistic();
  single = [{'name':'', 'value':0}];
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
  legend = true;
  legendPosition = LegendPosition.Below;

  SelectedChart = SelectedChart;
  selectedChart = SelectedChart.Gauge;

  constructor(private analytic: StatisticService) {
  }

  ngOnInit(): void {
    this.refresh().then(() => {
      this.gChart.scaleText(true);
    });

  }

  refresh(): Promise<void>{
    return this.analytic.getStatistics().then(x => {
      this.statistic = x;
      this.single = [
        {
          "name": "Today",
          "value": x.percentOfDoneToday*100
        },
        {
          "name": "Total",
          "value": x.percentOfDoneTotal*100
        }
      ];

      this.multi = [
        {
          'name': 'Tasks/Day',
          'series': x.perDayStatistic.map(pd => {
            const date = new Date(pd.date);
            const tomorrowDate = new Date(pd.date);
            tomorrowDate.setDate(date.getDate() + 1);
            const sliceVal = tomorrowDate.toLocaleDateString().slice(0,2) === '01' ||
              date.toLocaleDateString().slice(0,2) === '01' ? 5 : 2;
            return {
              "name": date.toLocaleDateString().slice(0,sliceVal),
              "value": pd.countOfDone
            }
          })
        }
      ];

      this.gChart.textValue = Math.round(x.percentOfDoneToday*100) + ' % / \n' +
        Math.round(x.percentOfDoneTotal*100) + ' %';
      this.gChart.scaleText(true);
    });
  }

  onSelect(data: any): void {
  }

  onActivate(data: any): void {
    this.gChart.textValue = Math.round(this.statistic.percentOfDoneToday*100) + ' % / \n' +
      Math.round(this.statistic.percentOfDoneTotal*100) + ' %';
    this.gChart.scaleText(true);
  }

  onDeactivate(data: any): void {
    this.gChart.textValue = ' -0%-/-0%- ';
  }

}


export enum SelectedChart {
  Gauge,
  Line
}


