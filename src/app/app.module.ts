import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {TaskListComponent} from './main/task-list/task-list.component';
import {LoginComponent} from './main/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./core/services/auth-guard";
import {NotFoundError} from "rxjs";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {JwtModule} from "@auth0/angular-jwt";
import {AuthService} from "./core/services/authServices";
import {TaskService} from "./core/services/taskService";
import {HttpService} from "./core/services/httpService";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {FormsModule} from "@angular/forms";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {SingleInputDialogComponent} from './common-components/single-input-dialog/single-input-dialog.component';
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {StatisticsComponent} from './main/statistics/statistics.component';
import {TimerComponent} from './main/timer/timer.component';
import {ErrorInterceptor} from "./core/services/error-interceptor";
import {EditTimerDialogComponent} from './main/timer/edit-timer-dialog/edit-timer-dialog.component';
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {TimerService} from "./core/services/timerService";
import {StatisticService} from "./core/services/statisticService";
import {EditTaskDialogComponent} from './main/task-list/edit-task-dialog/edit-task-dialog.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {ToastrModule} from "ngx-toastr";
import {MatLegacySliderModule as MatSliderModule} from "@angular/material/legacy-slider";
import {MatDividerModule} from "@angular/material/divider";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {SettingsComponent} from './main/settings/settings.component';
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {StorageService} from "./core/services/storageService";
import {
  SimpleConfirmationDialogComponent
} from './common-components/simple-confirmation-dialog/simple-confirmation-dialog.component';
import {ColorPickerModule} from "ngx-color-picker";
import {MatLegacyRadioModule as MatRadioModule} from "@angular/material/legacy-radio";
import {FilterByPipe} from "./core/pipes/filterBy.pipe";
import {DialogService} from "./core/services/dialog.service";
import {FindByPipe} from "./core/pipes/findBy.pipe";
import {AnalyticsComponent} from './main/analytics/analytics.component';
import {Config} from '../configs/config';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker'
import {NotificationsService} from "./core/services/notifications.service";
import {MinsToDisplayPipe} from "./core/pipes/minsToDisplay.pipe";

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
    MatRadioModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: true}),
    MinsToDisplayPipe
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
    NotificationsService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    { provide: 'API_URL', useValue: Config.apiUrl },
    {provide: LOCALE_ID, useValue: 'en-CA' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
