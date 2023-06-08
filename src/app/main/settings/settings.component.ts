import {Component, OnDestroy, OnInit} from '@angular/core';
import {moveItemInArray} from "@angular/cdk/drag-drop";
import {StorageService} from "../../core/services/storageService";
import {Unit} from "../../core/models/unit.model";
import {TaskService} from "../../core/services/taskService";
import {Category} from "../../core/models/category.model";
import {ToastrService} from "ngx-toastr";
import {
  SimpleConfirmationDialogComponent
} from "../../common-components/simple-confirmation-dialog/simple-confirmation-dialog.component";
import {Constants} from "../../core/models/constants";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../core/services/authServices";
import {ColorPickerService} from "ngx-color-picker";

import {TimerFormat} from "../timer/timer.component";
import {TimerService} from "../../core/services/timerService";
import {untilDestroyed} from "../../core/services/until-destroyed";
import {tap} from "rxjs";
import {DialogService} from "../../core/services/dialog.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
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
              private colorPicker: ColorPickerService) {
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
}
