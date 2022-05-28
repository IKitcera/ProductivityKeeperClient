import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {StatisticService} from "../../services/statisticService";
import {UserStatistic} from "../../models/user-statistic.model";
import {GaugeComponent, LegendPosition, LineChartComponent, PieChartComponent, ScaleType} from "@swimlane/ngx-charts"
import {finalize} from "rxjs";
import {Category} from "../../models/category.model";
import {Task} from "../../models/task.model";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  @ViewChild('gChart') gChart: GaugeComponent;
  @ViewChild('lChart') lChart: LineChartComponent;
  @ViewChild('pChart') pChart: PieChartComponent;

  @Input() statistic : UserStatistic;
  @Input() activeCtg : Category | undefined;

  isLoading = false;

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

    this.refresh(true).then(() => {
      this.gChart?.scaleText(true);
    }, finalize(()=> {
    }));

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

      this.multi = [
        {
          'name': 'Tasks/Day',
          'series': this.statistic.perDayStatistic.map(pd => {
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

      this.populateDonutChart();

      if (this.gChart) {
        this.gChart.textValue = Math.round(this.statistic.percentOfDoneToday * 100) + ' % / \n' +
          Math.round(this.statistic.percentOfDoneTotal * 100) + ' %';
        this.gChart.scaleText(true);
      }

   // this.isLoading = false;
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
}



export enum SelectedChart {
  Gauge,
  Line,
  Donut
}


