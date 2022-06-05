import {TimerFormat} from "../main/timer/timer.component";

export class Timer{
  id: number;
  label: string;
  ticked: number;
  goal: number;
  format: TimerFormat;
}
