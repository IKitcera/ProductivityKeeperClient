import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import {moveItemInArray} from "@angular/cdk/drag-drop";
import {StorageService} from "../../core/services/storageService";
import {TaskService} from "../../core/services/taskService";
import {Category} from "../../core/models/category.model";
import {ToastrService} from "ngx-toastr";
import {Constants} from "../../core/models/constants";
import {AuthService} from "../../core/services/authServices";
import {ColorPickerService} from "ngx-color-picker";

import {TimerFormat} from "../timer/timer.component";
import {TimerService} from "../../core/services/timerService";
import {untilDestroyed} from "../../core/services/until-destroyed";
import {tap} from "rxjs";
import {DialogService} from "../../core/services/dialog.service";
import {DOCUMENT} from "@angular/common";
import {StorageConstants} from "../../core/constants/storage-constants";
import {Theme} from "../../core/enums/theme.enum";
import {findEnumByValueFn} from "../../core/functions/find-enum-by-value.fuction";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  public categories: Category[];
  public timerFormat: TimerFormat;
  public timerFormatEnum = TimerFormat;
  public oldPassword: string;
  public newPassword: string;
  public passwordConfirmation: string;
//  public colorConverter = ColorConverter;
  public shouldEnableChangingPassword = false;

  constructor(private taskService: TaskService,
              private timerService: TimerService,
              private storageService: StorageService,
              private authService: AuthService,
              private toastr: ToastrService,
              private dialog: DialogService,
              private colorPicker: ColorPickerService,
              private cdr: ChangeDetectorRef,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.taskService.getJustCategories().pipe(
      tap(ctgArr => this.categories = ctgArr),
      untilDestroyed(this)
    ).subscribe();

    this.timerService.getTimer().pipe(
      tap(timer => this.timerFormat = timer.format),
      untilDestroyed(this)
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {

  }

  drop(event: any) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }

  saveChanges() {
    this.taskService.reorderCategories(this.categories).pipe(
      tap(_ => this.toastr.success("Changes has been saved"))
    ).subscribe();
  }

  clearArchive() {
    this.dialog.openSimpleConfirmationDialog(Constants.sureAboutDelete + Constants.progressWillBeLost).pipe(
      tap(_ => this.toastr.info('Archive was cleared'))
    ).subscribe();
  }

  async checkIfPasswordMatches() {
    const res = await this.authService.checkIfPasswordMatches(this.oldPassword);
    this.shouldEnableChangingPassword = res;
    this.oldPassword = '';
    if (!res) {
      this.toastr.error('You\'ve entered a wrong password');
    }
  }

  changePassword() {
    this.authService.changePassword(this.newPassword).then(() => {

      this.toastr.success('Password was successfully changed.');
      this.newPassword = '';
      this.shouldEnableChangingPassword = false;

      this.passwordConfirmation = '';
    }).catch(err => this.passwordConfirmation = '')
  }

  updateTimerFormat(value: any) {
    // maybe revert
    this.timerService.updateFormat(value).pipe(
      tap(_ => this.timerFormat = value),
      untilDestroyed(this)
    ).subscribe();
  }

  public changedNotificationReminder(value: number): void {
    this.storageService.setProp(StorageConstants.minBeforeDeadline, JSON.stringify(value ?? 10));
  }

  public getNotificationReminder(): number {
    return this.storageService.retrieveProp<number>(StorageConstants.minBeforeDeadline, 10,
      (key, value) => +value);
  }

  public changedEstimatedCapacity(value: number): void {
    this.storageService.setProp(StorageConstants.estimatedCapacityHrs, JSON.stringify(value ?? 14));
  }

  public getEstimatedCapacity(): number {
    return this.storageService.retrieveProp<number>(StorageConstants.estimatedCapacityHrs, 14,
      (key, value) => +value);
  }

  public selectedThemeChanged(theme: Theme): void {
    console.log(theme)
    const existingTheme= this.storageService.retrieveProp<Theme>(
      StorageConstants.selectedTheme,
      Theme.Dark,
      (key, value) => findEnumByValueFn(Theme, value)
    );

    if (existingTheme) {
      console.log('e t', this.getThemeName(existingTheme));
      this.document.documentElement.classList.remove(this.getThemeName(existingTheme));
    }

    this.storageService.setProp(StorageConstants.selectedTheme, JSON.stringify(theme));
    this.document.documentElement.classList.add(this.getThemeName(theme));
    console.log(this.document.documentElement.classList)
  }

  public getSelectedTheme(): Theme {
    return this.storageService.retrieveProp<Theme>(
      StorageConstants.selectedTheme,
      Theme.Dark,
      (key, value) => findEnumByValueFn(Theme, value));
  }

  private getThemeName(theme: Theme): string {
    return `${theme}-theme`;
  }

  protected readonly Theme = Theme;
}
