import {Category} from "./category.model";
import {Timer} from "./timer.model";
import {UserStatistic} from "./user-statistic.model";

export class Unit{
  id: number;
  categories: Category[];
  timer: Timer;
  statistic: UserStatistic;
  statisticId: number;

  constructor(obj?: any) {
    if (!obj) {
      return;
    }
    this.id = obj.id;
    this.categories = obj.categories.map(c => Object.assign(new Category(), c));
    this.timer = obj.timer;
    this.statistic = obj.statistic;
    this.statisticId = obj.statisticId;
  }
}
