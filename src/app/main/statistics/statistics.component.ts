import { Component, OnInit } from '@angular/core';
import {StatisticService} from "../../services/statisticService";
import {UserStatistic} from "../../models/user-statistic.model";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  statistic: UserStatistic;

  constructor(private analytic: StatisticService) { }

  ngOnInit(): void {
    this.analytic.getStatistics().then(x => {
      this.statistic = x;
    })
  }

}
