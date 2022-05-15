import {Category} from "./category.model";
import {Timer} from "./timer.model";
import {UserStatistic} from "./user-statistic.model";
import {TaskToManySubcategories} from "./task-to-many-subcategories";

export class Unit{
  id: number;
  categories: Category[];
  timer: Timer;
  statistic: UserStatistic;
  taskToManySubcategories: TaskToManySubcategories[];
}
