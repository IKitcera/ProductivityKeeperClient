export class Task{
  id: number;
  text: string;
  isChecked: boolean;
  deadline: Date;
  doneDate: Date;
  isRepeatable: boolean;
  timesToRepeat: number;
  goalRepeatCount: number;
  habbitIntervalInHours: number;
}
