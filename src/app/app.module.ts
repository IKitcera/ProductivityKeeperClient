import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TaskListComponent } from './task-list/task-list.component';
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
import {HttpClient, HttpClientModule} from "@angular/common/http";

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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    FlexLayoutModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash: true}),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:65070']
    }}),
    MatButtonModule
  ],
  providers: [AuthGuard, HttpClient, HttpService, AuthService,TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
