import {Category} from "./category.model";
import {Timer} from "./timer.model";

export class Unit{
  id: number;
  categories: Category[];
  timer: Timer;
}
