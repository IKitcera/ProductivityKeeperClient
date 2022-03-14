export class UserStatistic{
  id: number;
  donePerDay: {date: Date, done: number};
  percentOfDoneToday: number;
  percentOfDoneTotal: number;
  countOfDoneToday: number;
  countOfDoneTotal: number;
  countOfExpiredTotal: number;
}
