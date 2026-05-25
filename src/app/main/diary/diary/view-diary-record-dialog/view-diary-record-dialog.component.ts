import { Component, Inject, computed } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import { Store } from '@ngrx/store';
import { selectDiaryViewConfig } from '../store/diary-view-config.selectors';
import {DiaryService} from "../../../../core/services/diary.service";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-view-diary-record-dialog',
  templateUrl: './view-diary-record-dialog.component.html',
  imports: [
    MatFormField,
    MatLabel,
    MatInput
  ],
  styleUrls: ['./view-diary-record-dialog.component.scss']
})
export class ViewDiaryRecordDialogComponent {
  public diaryViewConfig = this.store.selectSignal(selectDiaryViewConfig);

  public item = toSignal(this.diaryService.getById(this.data))
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private store: Store,
    private diaryService: DiaryService
  ) {}
}
