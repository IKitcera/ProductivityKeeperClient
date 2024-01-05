import {Component, OnDestroy} from '@angular/core';
import {BehaviorSubject, first, of, switchMap, tap} from 'rxjs';
import {Timer} from "../../core/models/timer.model";
import {EditTimerDialogComponent} from "./edit-timer-dialog/edit-timer-dialog.component";
import {TimerService} from "../../core/services/timerService";
import {ToastrService} from "ngx-toastr";
import {Constants} from "../../core/models/constants";
import {untilDestroyed} from "../../core/services/until-destroyed";
import {DialogService} from "../../core/services/dialog.service";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnDestroy {

//  @Input() timer: Timer;
  // @Output() refreshedTimer: EventEmitter<Timer>;

  public timerSource$ = this.timerService.getTimer()
  public timer$ = new BehaviorSubject<Timer>(null);
  public isLoading$ = new BehaviorSubject<boolean>(true);
  currentValue: TimeSpan = new TimeSpan();
  goalValue: TimeSpan = new TimeSpan();
  isTicking = false;
  noTimer: boolean;

  format: TimerFormat = TimerFormat.FullDateTime;
  timerId: number;

  private autosaveId: number;

  constructor(private dialog: DialogService,
              private timerService: TimerService,
              private toastr: ToastrService) {

    this.timerSource$.pipe(
      tap(timer => this.timer$.next(timer)),
      untilDestroyed(this)
    ).subscribe();


    this.timer$.pipe(
      tap(timer => {
        this.noTimer = !timer || timer.goal === 0 && timer.ticked === 0 &&
          (!timer.label || timer.label === '');

        if (!this.noTimer) {
          this.currentValue = new TimeSpan();
          this.currentValue.getFromSeconds(timer.ticked);

          this.goalValue = new TimeSpan();
          this.goalValue.getFromSeconds(timer.goal);

          this.currentValue.timeFormat = timer.format;
          this.goalValue.timeFormat = timer.format;
        }
        this.isLoading$.next(false)
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  ngOnDestroy() {
  }

  public start(): void {
    this.timerId = setInterval(() =>
      this.addSecond(), 1000); // Will alert every second.
    this.isTicking = true;
    this.autosaveId = setInterval(() => {
      this.timerService.updateTicked(this.currentValue.getInSeconds()).pipe(
        untilDestroyed(this)
      ).subscribe();
    }, 60000);// autosave
  }

  public pause(): void {
    clearInterval(this.timerId);
    clearInterval(this.autosaveId);
    this.isTicking = false;
    this.timerService.updateTicked(this.currentValue.getInSeconds()).pipe(
      untilDestroyed(this)
    ).subscribe();
  }

  public stop(): void {
    clearInterval(this.timerId);
    clearInterval(this.autosaveId);

    const timer = this.timer$.value;
    timer.goal -= this.currentValue.getInSeconds();
    timer.ticked = 0;

    this.currentValue.reset();
    this.isTicking = false;
    this.timerService.setTimer(timer).pipe(
      first(),
      tap(updatedTimer => this.timer$.next(updatedTimer))
    ).subscribe();
  }

  public editTimer(): void {
    this.dialog.openDialog(EditTimerDialogComponent, {
      data: this.timer$.value
    }).pipe(
      tap(modifiedTimer =>
        modifiedTimer.ticked = this.currentValue.getInSeconds()),
      switchMap(timer => this.timerService.setTimer(timer)),
      tap(updateTimer => this.timer$.next(updateTimer)),
      untilDestroyed(this)
    ).subscribe();
  }

  public deleteTimer(): void {
    if (this.noTimer) {
      return;
    }
    const confirmationIfTimerFulfilled$ = this.currentValue.getInSeconds() > 0 ?
      this.dialog.openSimpleConfirmationDialog(Constants.sureAboutDelete + Constants.progressWillBeLost) :
      of(true);

    confirmationIfTimerFulfilled$.pipe(
      filter(x => !!x),
      switchMap(_ => this.timerService.setTimer(new Timer())),
      tap(updateTimer => this.timer$.next(updateTimer)),
      untilDestroyed(this)
    ).subscribe();
  }

  public getFormatString(): string {
    switch (this.timer$.value.format) {
      case TimerFormat.FullDateTime:
        return 'Y-MM-DD  hh:mm:ss';
      case TimerFormat.FullTime:
        return 'hh : mm : ss';
      case TimerFormat.FullDayTime:
        return 'DD  hh : mm : ss';
      case TimerFormat.Days:
        return 'Days';
      case TimerFormat.Hours:
        return 'Hours';
      case TimerFormat.Minutes:
        return 'Minutes';
      case TimerFormat.Seconds:
        return 'Seconds';
      default:
        return '';
    }
  }

  private addSecond(): void {
    this.currentValue.addSecond();
    if (this.currentValue.getInSeconds() === this.goalValue.getInSeconds()) {
      this.toastr.success('Your timer goal is completed', 'Congratulation! 🎉🎉🎉');
    }
  }
}

export class TimeSpan {
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

  getFromMiliseconds(ms: number) {
    this.miliseconds = ms % 1000;
    this.seconds = Math.trunc(ms / 1000);
    this.getFromSeconds(this.seconds);
  }

  getFromSeconds(s: number) {
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

  addSecond() {
    this.seconds += 1;
    if (this.seconds === 60) {
      this.seconds = 0;
      this.addMinute();
    }
  }

  addMinute() {
    this.minutes += 1;
    if (this.minutes === 60) {
      this.minutes = 0;
      this.addHour();
    }
  }

  addHour() {
    this.hours += 1;
    if (this.hours === 24) {
      this.hours = 0;
      this.addDay();
    }
  }

  addDay() {
    this.days += 1;
    if (this.days >= 30) {
      this.days = 0;
      this.addMonth();
    }
  }

  addMonth() {
    this.month += 1;
    if (this.month === 12) {
      this.month = 0;
      this.addYear();
    }
  }

  addYear() {
    this.years += 1;
  }

  getInDays() {
    return this.days +
      this.month * 30 +
      this.years * 12 * 30;
  }

  getInHours() {
    return this.hours +
      this.days * 24 +
      this.month * 30 * 24 +
      this.years * 12 * 30 * 24;
  }

  getInMinutes() {
    return this.minutes +
      this.hours * 60 +
      this.days * 24 * 60 +
      this.month * 30 * 24 * 60 +
      this.years * 12 * 30 * 24 * 60;
  }

  getInSeconds() {
    return this.seconds +
      this.minutes * 60 +
      this.hours * 3600 +
      this.days * 24 * 3600 +
      this.month * 30 * 24 * 3600 +
      this.years * 12 * 30 * 24 * 3600;
  }

  getInMiliseconds() {
    return this.getInSeconds() * 1000;
  }

  private numToStr(n: number, nextChar = '', digitsCount: number | 'unlimited' = "unlimited"): string {
    return (digitsCount !== 'unlimited' ? ('0' + n).slice(-1 * digitsCount) : n) + nextChar;
  }

  public toString = (): string => {
    switch (this.timeFormat) {
      case TimerFormat.FullDateTime:
        return this.numToStr(this.years, '-') +
          this.numToStr(this.month, '-', 2) +
          this.numToStr(this.days, ' ', 2) +
          this.numToStr(this.hours, ':', 2) +
          this.numToStr(this.minutes, ':', 2) +
          this.numToStr(this.seconds, ' ', 2);
      case TimerFormat.FullTime:
        return this.numToStr(this.hours, ' : ', 2) +
          this.numToStr(this.minutes, ' : ', 2) +
          this.numToStr(this.seconds, '  ', 2);
      case TimerFormat.FullDayTime:
        return this.numToStr(this.days, '  ') +
          this.numToStr(this.hours, ' : ', 2) +
          this.numToStr(this.minutes, ' : ', 2) +
          this.numToStr(this.seconds, '  ', 2);
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

  reset() {
    this.years = 0;
    this.days = 0;
    this.month = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.miliseconds = 0;
  }

  eachValToNum() {
    this.years = <number>this.years | 0;
    this.month = <number>this.month | 0;
    this.days = <number>this.days | 0;

    this.hours = <number>this.hours | 0;
    this.minutes = <number>this.minutes | 0;
    this.seconds = <number>this.seconds | 0;
    this.miliseconds = <number>this.miliseconds | 0;
  }
}

export enum TimerFormat {
  FullDateTime,
  FullTime,
  FullDayTime,
  Days,
  Hours,
  Minutes,
  Seconds
}
