import {DonePerDay} from "./done-per-day.model";

export class UserStatistic{
  id: number;
  perDayStatistic: DonePerDay[];
  percentOfDoneToday: number;
  percentOfDoneTotal: number;
  countOfDoneToday: number;
  countOfDoneTotal: number;
  countOfExpiredTotal: number;
}

