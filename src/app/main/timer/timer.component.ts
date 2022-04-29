import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Time} from "@angular/common";
import { timer } from 'rxjs';
import {Timer} from "../../models/timer.model";
import {MatDialog} from "@angular/material/dialog";
import {EditTimerDialogComponent} from "./edit-timer-dialog/edit-timer-dialog.component";
import {TimerService} from "../../services/timerService";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  @Input() timer: Timer;
  @Output() refreshedTimer: EventEmitter<Timer>;

  currentValue: TimeSpan = new TimeSpan();
  goalValue: TimeSpan = new TimeSpan();
  isTicking = false;
  noTimer: boolean;

  format: TimerFormat = TimerFormat.FullDateTime;
  timerId: number;
  private autosaveId: number;

  constructor(private dialog: MatDialog, private timerService: TimerService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.noTimer = !this.timer || this.timer.goal === 0 && this.timer.ticked === 0 &&
      (!this.timer.label || this.timer.label === '');

    if(!this.noTimer){
      this.currentValue = new TimeSpan();
      this.currentValue.getFromSeconds(this.timer.ticked);

      this.goalValue = new TimeSpan();
      this.goalValue.getFromSeconds(this.timer.goal);
    }

    this.currentValue.timeFormat = TimerFormat.FullDateTime;
    this.goalValue.timeFormat = TimerFormat.FullDateTime;
  }

  start(){
    this.timerId = setInterval(()=>this.currentValue.addSecond() , 1000); // Will alert every second.
    this.autosaveId = setInterval(() => {
      this.timerService.updateTicked(this.currentValue.getInSeconds());
    }, 60000);// autosave

    this.isTicking = true;
  }

  pause(){
    clearInterval(this.timerId);
    clearInterval(this.autosaveId);
    this.isTicking = false;
    this.timerService.updateTicked(this.currentValue.getInSeconds());
  }

  stop(){
    clearInterval(this.timerId);
    clearInterval(this.autosaveId);
    this.currentValue.reset();
    this.isTicking = false;
    this.timerService.updateTicked(this.currentValue.getInSeconds());
  }

  async editTimer(){
    const matDialogRef = this.dialog.open(EditTimerDialogComponent, {
      data: this.timer
    });
    const modifiedTimer = await matDialogRef.afterClosed().toPromise();

   await this.updateTimer(modifiedTimer);
  }

    async deleteTimer() {
      if (this.currentValue.getInSeconds() === 0 || this.currentValue.getInSeconds() > 0
        && window.confirm("Are you sure about deleting timer? Progress will be lost")) {
        await this.updateTimer(new Timer());
      }
    }

    private async updateTimer(modifiedTimer: Timer) {
      await this.timerService.postTimer(modifiedTimer);
      this.timer = await this.timerService.getTimer();
      this.refresh();
    }
}

export class TimeSpan{
  timeFormat: TimerFormat;

  years: number = 0;
  month: number = 0;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  miliseconds: number = 0;

  constructor(years: number = 0, month: number = 0, days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0) {
    this.years = years;
    this.month = month;
    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  getFromMiliseconds(ms: number){
    this.miliseconds = ms % 1000;
    this.seconds = Math.trunc( ms /1000);
    this.getFromSeconds(this.seconds);
  }

  getFromSeconds(s: number){
    this.seconds = s;
    this.minutes = Math.trunc(this.seconds / 60);
    this.seconds = this.seconds % 60;
    this.hours = Math.trunc(this.minutes / 60);
    this.minutes = this.minutes % 60;
    this.days = Math.trunc(this.hours / 24);
    this.hours = this.hours % 24;

    this.month = Math.trunc(this.days / 30);
    this.days = this.days % 30;
    this.years = Math.trunc(this.month / 12);
    this.month = this.month % 12;
  }

  addSecond(){
    this.seconds += 1;
    if(this.seconds === 60) {
      this.seconds = 0;
      this.addMinute();
    }
  }

  addMinute(){
    this.minutes += 1;
    if(this.minutes === 60){
      this.minutes = 0;
      this.addHour();
    }
  }

  addHour(){
    this.hours += 1;
    if(this.hours === 24){
      this.hours = 0;
      this.addDay();
    }
  }

  addDay(){
    this.days += 1;
    if (this.days >= 30){
      this.days = 0;
      this.addMonth();
    }
  }

  addMonth(){
    this.month += 1;
    if (this.month === 12){
      this.month = 0;
      this.addYear();
    }
  }

  addYear(){
    this.years += 1;
  }

  getInDays(){
    return this.days +
      this.month*30 +
      this.years*12*30;
  }

  getInHours(){
    return this.hours +
      this.days*24 +
      this.month*30*24 +
      this.years*12*30*24;
  }

  getInMinutes(){
    return this.minutes +
      this.hours*60 +
      this.days*24*60 +
      this.month*30*24*60 +
      this.years*12*30*24*60;
  }

  getInSeconds(){
    return this.seconds +
      this.minutes*60 +
      this.hours*3600 +
      this.days*24*3600 +
      this.month*30*24*3600+
      this.years*12*30*24*3600;
  }

  getInMiliseconds(){
    return this.getInSeconds() * 1000;
  }

  private numToStr(n:number, nextChar='', digitsCount: number | 'unlimited' = "unlimited"):string {
    return (digitsCount !== 'unlimited' ? ('0' + n).slice(-1 * digitsCount) : n) + nextChar;
  }

  public toString = () : string => {
    switch(this.timeFormat){
     case TimerFormat.FullDateTime:
       return this.numToStr(this.years, '-') +
         this.numToStr(this.month,'-',2) +
         this.numToStr(this.days, ' ',2) +
         this.numToStr(this.hours, ':',2) +
         this.numToStr(this.minutes, ':',2) +
         this.numToStr(this.seconds, '', 2);
     case TimerFormat.FullTime:
       return this.numToStr(this.hours, ':',2) +
         this.numToStr(this.minutes, ':',2) +
         this.numToStr(this.seconds,'',2);
     case TimerFormat.FullDayTime:
       return this.numToStr(this.days, ' ') +
         this.numToStr(this.hours, ':', 2) +
         this.numToStr(this.minutes, ':', 2) +
         this.numToStr(this.seconds, '',2);
     case TimerFormat.Days:
       return this.numToStr(this.getInDays());
     case TimerFormat.Hours:
      return this.numToStr(this.getInHours());
     case TimerFormat.Minutes:
       return this.numToStr(this.getInMinutes())
     case TimerFormat.Seconds:
       return this.numToStr(this.getInSeconds());
     default:
       return '';
   }
  }

  reset(){
    this.years = 0;
    this.days = 0;
    this.month = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.miliseconds = 0;
  }

}

export enum TimerFormat{
   FullDateTime,
  FullTime,
  FullDayTime,
  Days,
  Hours,
  Minutes,
  Seconds
}
