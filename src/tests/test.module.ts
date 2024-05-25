import {LOCALE_ID, NgModule} from "@angular/core";
import {AuthGuard} from "../app/core/services/auth-guard";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {HttpService} from "../app/core/services/httpService";
import {AuthService} from "../app/core/services/authServices";
import {TaskService} from "../app/core/services/taskService";
import {TimerService} from "../app/core/services/timerService";
import {StatisticService} from "../app/core/services/statisticService";
import {StorageService} from "../app/core/services/storageService";
import {DialogService} from "../app/core/services/dialog.service";
import {NotificationsService} from "../app/core/services/notifications.service";
import {ErrorInterceptor} from "../app/core/services/error-interceptor";
import {Config} from "../configs/config";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatDialogModule} from "@angular/material/dialog";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {JwtModule} from "@auth0/angular-jwt";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MtxNativeDatetimeModule} from "@ng-matero/extensions/core";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {ToastrModule} from "ngx-toastr";
import {MatSliderModule} from "@angular/material/slider";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {ColorPickerModule} from "ngx-color-picker";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {ServiceWorkerModule} from "@angular/service-worker";
import {MinsToDisplayPipe} from "../app/core/pipes/minsToDisplay.pipe";
import {MtxDatetimepickerModule} from "@ng-matero/extensions/datetimepicker";
import {tokenGetter} from "../app/app.module";
import {FilterByPipe} from "../app/core/pipes/filterBy.pipe";
import {FindByPipe} from "../app/core/pipes/findBy.pipe";
import {RouterTestingModule} from "@angular/router/testing";

@NgModule({
  declarations: [
    FilterByPipe,
    FindByPipe,
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
    RouterTestingModule.withRoutes([]),
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     allowedDomains: ['localhost:65070', 'localhost:44398']
    //   }
    // }),
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MtxNativeDatetimeModule,
    DragDropModule,
    NgxChartsModule,
    ToastrModule.forRoot(),
    MatSliderModule,
    MatDividerModule,
    MatTableModule,
    ColorPickerModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatRadioModule,
    MinsToDisplayPipe,
    MtxDatetimepickerModule
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
    {provide: 'API_URL', useValue: Config.apiUrl},
    {provide: LOCALE_ID, useValue: 'en-CA'},
  ],
  exports: [
    FilterByPipe,
    FindByPipe,
    MinsToDisplayPipe,
  ]
})
export class TestModule {}
