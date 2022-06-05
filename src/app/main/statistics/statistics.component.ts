import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {StatisticService} from "../../services/statisticService";
import {UserStatistic} from "../../models/user-statistic.model";
import {GaugeComponent, LegendPosition, LineChartComponent, PieChartComponent, ScaleType} from "@swimlane/ngx-charts"
import {finalize} from "rxjs";
import {Category} from "../../models/category.model";
import {Task} from "../../models/task.model";
import {DonePerDay} from "../../models/done-per-day.model";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  @ViewChild('gChart', {read: ElementRef, static: true}) gChart: GaugeComponent;
  @ViewChild('lChart') lChart: LineChartComponent;
  @ViewChild('pChart') pChart: PieChartComponent;

  @Input() statistic : UserStatistic;
  @Input() activeCtg : Category | undefined;

  isLoading = false;
  lineChartScale = 1;
  //statistic: UserStatistic = new UserStatistic();
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
  }

  ngOnInit(): void {
    //  this.refresh(false).then(() => {
    //   this.gChart?.scaleText(true);
    // }, finalize(()=> {
    // }));

  }

  async refresh(forceReload = true): Promise<void>{
    if (forceReload || !this.statistic) {
      //this.isLoading = true;
      const x = await this.analytic.getStatistics().finally(()=> {/*this.isLoading = false*/});
      this.statistic = x;
    }
      this.single = [
        {
          "name": "Today",
          "value": this.statistic.percentOfDoneToday*100
        },
        {
          "name": "Total",
          "value": this.statistic.percentOfDoneTotal*100
        }
      ];

    if (this.gChart) {
      this.gChart.textValue = Math.round(this.statistic.percentOfDoneToday * 100) + ' % / \n' +
        Math.round(this.statistic.percentOfDoneTotal * 100) + ' %';
      this.gChart.scaleText(true);

    }

    this.scaleLinearGraphicsData(this.lineChartScale);

   // this.isLoading = false;
  }

  getGaugeText(): string {
    return this.statistic ? Math.round(this.statistic.percentOfDoneToday * 100) + ' % / \n' +
      Math.round(this.statistic.percentOfDoneTotal * 100) + ' %' :
      '-0%-/-0%-';
  }

  onSelect(data: any): void {

  }

  onActivate(data: any): void {
    this.refresh(false);
  }

  onDeactivate(data: any): void {
    this.gChart.textValue = ' -0%-/-0%- ';
  }

  public populateDonutChart() : void {
    if(!this.activeCtg) return;

    if(this.pChart)
      this.pChart.margins = [0,0,0,0];
    const tasks : Task [] = [];

    this.activeCtg?.subcategories.map(s => s.tasks.map(t => {
      if (t && (!t.relationId || !tasks.map(ta => ta.relationId).includes(t.relationId)))
      tasks.push(t);
    }));

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
        value: tasks.filter(t => (t.deadline && t.doneDate && t.doneDate >= t.deadline)
          || (!t.doneDate && t.deadline && t.deadline < new Date() && !t.isChecked)).length || 0
      },
    ];
  }

  getCustomColors () {
    return [
      {"name": "Done", "value": "#32a88b"},
      {"name": "Not done", "value": "#93a39f"},
      {"name": "Expired", "value": "#d66d4d"}
    ]
  }

  scaleLinearGraphicsData(scaleWeek: number): void {
    this.lineChartScale = scaleWeek;

    const initData = this.statistic.perDayStatistic;
    const thresholdDate = new Date();
    thresholdDate.setDate(new Date().getDate() - 7 * scaleWeek - 1);

    let filteredByDate = initData.filter(pd => new Date(pd.date) > thresholdDate);
    let resultChartData = filteredByDate;

    if (filteredByDate.length > 10) {
      resultChartData = [];

      let min = new Date(filteredByDate[0].date);
      let max = new Date(filteredByDate[filteredByDate.length-1].date);

      const differenceInDays = (max.getTime() - min.getTime())/(1000*3600*24);
      let step = Math.round((differenceInDays < 7*scaleWeek ? differenceInDays : (7*scaleWeek - differenceInDays))/10);

      let lastDonePerDay = new DonePerDay();
      lastDonePerDay.date = new Date(filteredByDate[0].date);
      lastDonePerDay.date.setDate(lastDonePerDay.date.getDate() + step);

      let minDate = new Date(min);

      for(let i = 0; i < 10; i ++) {
        const upRangeDate = new Date(minDate);
        upRangeDate.setDate(upRangeDate.getDate() + step);

        const filteredByDateRange = filteredByDate.filter(dpd =>
          (new Date(dpd.date) >= minDate && new Date(dpd.date) <= upRangeDate));

        const resultItem = new DonePerDay();
        resultItem.date = upRangeDate;
        resultItem.countOfDone = filteredByDateRange
          .map(ite => ite.countOfDone)
          .reduce((x,y) => {
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
          tomorrowDate.toLocaleDateString().slice(0,2) === '01' ||
          date.toLocaleDateString().slice(0,2) === '01' ? 5 : 2;
          return {
            "name": date.toLocaleDateString().slice(0,sliceVal),
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


