import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TaskListComponent } from './main/task-list/task-list.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./services/auth-guard";
import {NotFoundError} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {JwtModule} from "@auth0/angular-jwt";
import {AuthService} from "./services/authServices";
import {TaskService} from "./services/taskService";
import {HttpService} from "./services/httpService";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import { SingleInputDialogComponent } from './common-components/single-input-dialog/single-input-dialog.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { StatisticsComponent } from './main/statistics/statistics.component';
import { TimerComponent } from './main/timer/timer.component';
import {ErrorInterceptor} from "./services/error-interceptor";
import { EditTimerDialogComponent } from './main/timer/edit-timer-dialog/edit-timer-dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {TimerService} from "./services/timerService";

const routes: Routes = [
  { path: '', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'tasks', redirectTo: '' },
  { path: '**', component:NotFoundError },  // Wildcard route for a 404 page
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
    EditTimerDialogComponent
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
        allowedDomains: ['localhost:65070']
      }
    }),
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatSelectModule
  ],
  providers: [AuthGuard, HttpClient, HttpService, AuthService, TaskService, TimerService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
