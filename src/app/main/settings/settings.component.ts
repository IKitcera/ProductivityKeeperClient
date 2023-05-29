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

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public unit: Unit;
  public categories: Category[];
  public timerFormat: TimerFormat;
  public timerFormatEnum = TimerFormat;
  public oldPassword: string;
  public newPassword: string;
  public passwordConfirmation: string;
//  public colorConverter = ColorConverter;
  public shouldEnableChangingPassword = false;

  get hasUnitAnyCategory(): boolean {
    return this.unit && this.unit.categories?.length > 0;
  }

  constructor(private taskService: TaskService,
              private timerService: TimerService,
              private storageService: StorageService,
              private authService: AuthService,
              private toastr: ToastrService,
              private dialog: MatDialog,
              private colorPicker: ColorPickerService) {
  }

  ngOnInit(): void {
    this.unit = this.storageService.getUnit() as Unit;
    if (!this.unit) {
      this.taskService.getUnit().pipe(
        tap(unit => this.unit = unit),
        untilDestroyed(this)
      ).subscribe();
    }
    this.categories = [];
    this.unit.categories.map(c => {
      this.categories.push(Object.assign(new Category(), c));
    });
    this.timerFormat = this.unit.timer.format;
  }

  ngOnDestroy(): void {

  }

  drop(event: any) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }

  async saveChanges() {
    // this.taskService.changeCategoriesOrder(this.categories).then(() => {
    //   this.unit.categories = this.categories;
    //   this.storageService.saveUnit(this.unit);
    //   this.toastr.success("Changes has been saved");
    // }).catch(err => this.toastr.error(err.message ?? "Unknown error"));
  }

  async clearArchive() {
    const confirmationDialog = this.dialog.open(SimpleConfirmationDialogComponent, {data: {label: Constants.sureAboutDelete + Constants.progressWillBeLost}});
    const res = await confirmationDialog.afterClosed().toPromise();

    // if(res) {
    //   this.taskService.clearTasksArchive()
    //     .then(x => this.toastr.info('Archive was cleared'))
    //     .catch(err => this.toastr.error(err.message ?? 'Unknown error'));
    // }
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
      tap(_ => this.timerFormat = value.value),
      untilDestroyed(this)
    ).subscribe();
  }
}
