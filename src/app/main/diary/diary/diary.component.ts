import {Component, computed, OnDestroy} from '@angular/core';
import {DatePipe} from "@angular/common";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {WriteDiaryRecordDialogComponent} from "./write-diary-record-dialog/write-diary-record-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject, filter, map, ReplaySubject, Subject, switchMap, take, tap} from "rxjs";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {ViewDiaryRecordDialogComponent} from "./view-diary-record-dialog/view-diary-record-dialog.component";
import {DiaryItemDto, DiaryService} from "../../../core/services/diary.service";
import {
  SimpleConfirmationDialogComponent
} from "../../../common-components/simple-confirmation-dialog/simple-confirmation-dialog.component";
import {ToastrService} from "ngx-toastr";
import {toSignal} from "@angular/core/rxjs-interop";
import {untilDestroyed} from "../../../core/services/until-destroyed";
import {Store} from '@ngrx/store';
import {selectDiaryViewConfig} from './store/diary-view-config.selectors';
import {setDiaryViewConfig} from './store/diary-view-config.actions';
import {DiaryViewConfigState} from './store/diary-view-config.state';
import {gradients} from "./diary-gradient-config";
import {DiaryPreviewItem} from "../../../core/models/diary-preview-item";

@Component({
  selector: 'app-diary',
  imports: [
    DatePipe,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatIconButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
  ],
  providers: [Store],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent implements OnDestroy {
  private diaryViewConfigSignal = this.store.selectSignal(selectDiaryViewConfig);
  public diaryViewConfig = computed(() => this.diaryViewConfigSignal() || gradients[5]);

  private listReloadingSubject$ = new BehaviorSubject<void>(null);
  public items = toSignal<DiaryPreviewItem[]>(this.listReloadingSubject$.pipe(
    switchMap(_ => this.diaryService.getAll()),
    untilDestroyed(this)
  ));

  constructor(private dialog: MatDialog,
              private diaryService: DiaryService,
              private toastr: ToastrService,
              private store: Store<{diaryConfig: DiaryViewConfigState}>) {

  }

  public ngOnDestroy() {

  }

  public onGradientChange(config: DiaryViewConfig) {
    this.store.dispatch(setDiaryViewConfig({config}));
  }

  protected viewDiaryRecord(item: DiaryPreviewItem) {
    this.dialog.open<ViewDiaryRecordDialogComponent, number>(ViewDiaryRecordDialogComponent, {
      minWidth: '80%',
      maxHeight: '70%',
      data: item.id,
    }).afterClosed().pipe(
      take(1)
    ).subscribe();
  }

  protected editDiaryRecord(item?: DiaryPreviewItem) {
    this.dialog.open<WriteDiaryRecordDialogComponent, number>(WriteDiaryRecordDialogComponent, {
      minWidth: '80%',
      maxHeight: '70%',
      data: item.id,
    }).afterClosed().pipe(
      take(1),
      filter(x => !!x),
      switchMap(diaryRecord => diaryRecord?.id
        ? this.diaryService.update(diaryRecord.id, diaryRecord)
        : this.diaryService.create(diaryRecord)
      ),
      tap(_ => {
        this.toastr.success(`Diary record was ${item ? 'updated' : 'deleted'} successfully`);
        this.listReloadingSubject$.next();
      })
    ).subscribe();
  }

  protected deleteDiaryRecord(item: DiaryPreviewItem) {
    return this.dialog.open<SimpleConfirmationDialogComponent>(SimpleConfirmationDialogComponent, {
      data: {
        label: 'Are u sure you want to delete this diary record? This action cannot be undone.',
      }
    }).afterClosed().pipe(
      take(1),
      filter(Boolean),
      switchMap(_ => this.diaryService.delete(item.id)),
      tap(_ => {
        this.toastr.success('Diary record deleted successfully');
        this.listReloadingSubject$.next();
      })
    ).subscribe();
  }

  protected readonly gradients = gradients;
}

export interface DiaryViewConfig {
  name: string;
  backgroundImage: string;
  textColor?: string;
  mutedTextColor?: string;
  maxMutedTextColor?: string;
}

export interface DiaryRecord {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  imageUrl?: string;
}

