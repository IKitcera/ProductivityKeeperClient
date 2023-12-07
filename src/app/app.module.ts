import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {TaskListComponent} from './main/task-list/task-list.component';
import {LoginComponent} from './main/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./core/services/auth-guard";
import {NotFoundError} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {JwtModule} from "@auth0/angular-jwt";
import {AuthService} from "./core/services/authServices";
import {TaskService} from "./core/services/taskService";
import {HttpService} from "./core/services/httpService";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {SingleInputDialogComponent} from './common-components/single-input-dialog/single-input-dialog.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {StatisticsComponent} from './main/statistics/statistics.component';
import {TimerComponent} from './main/timer/timer.component';
import {ErrorInterceptor} from "./core/services/error-interceptor";
import {EditTimerDialogComponent} from './main/timer/edit-timer-dialog/edit-timer-dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {TimerService} from "./core/services/timerService";
import {StatisticService} from "./core/services/statisticService";
import {EditTaskDialogComponent} from './main/task-list/edit-task-dialog/edit-task-dialog.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {ToastrModule} from "ngx-toastr";
import {MatSliderModule} from "@angular/material/slider";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SettingsComponent} from './main/settings/settings.component';
import {MatCardModule} from "@angular/material/card";
import {StorageService} from "./core/services/storageService";
import {
  SimpleConfirmationDialogComponent
} from './common-components/simple-confirmation-dialog/simple-confirmation-dialog.component';
import {ColorPickerModule} from "ngx-color-picker";
import {MatRadioModule} from "@angular/material/radio";
import {FilterByPipe} from "./core/pipes/filterBy.pipe";
import {DialogService} from "./core/services/dialog.service";
import {FindByPipe} from "./core/pipes/findBy.pipe";
import {AnalyticsComponent} from './main/analytics/analytics.component';

const routes: Routes = [
  {path: '', component: TaskListComponent, canActivate: [AuthGuard]},
  {path: 'tasks', redirectTo: ''},
  {path: 'login', component: LoginComponent},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard]},
  {path: '**', component: NotFoundError},  // Wildcard route for a 404 page
];

export function tokenGetter() {
  return localStorage.getItem('_token');
}

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    LoginComponent,
    SingleInputDialogComponent,
    StatisticsComponent,
    TimerComponent,
    EditTimerDialogComponent,
    EditTaskDialogComponent,
    SettingsComponent,
    SimpleConfirmationDialogComponent,
    FilterByPipe,
    FindByPipe,
    AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    FlexLayoutModule,
    HttpClientModule,
    MatDialogModule,
    RouterModule.forRoot(routes, {useHash: true}),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:65070', 'localhost:44398']
      }
    }),
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    NgxChartsModule,
    ToastrModule.forRoot(),
    MatSliderModule,
    MatDividerModule,
    MatTableModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    ColorPickerModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatRadioModule
  ],
  exports: [
    FilterByPipe,
    FindByPipe
  ],
  providers: [
    AuthGuard,
    HttpClient,
    HttpService,
    AuthService,
    TaskService,
    TimerService,
    StatisticService,
    StorageService,
    DialogService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
