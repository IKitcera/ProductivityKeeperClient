import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {QuillEditorComponent} from "ngx-quill";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {DiaryService} from "../../../../core/services/diary.service";
import {take, tap} from "rxjs";
import {Store} from "@ngrx/store";
import {selectDiaryViewConfig} from "../store/diary-view-config.selectors";

@Component({
  selector: 'app-write-diary-record-dialog',
  templateUrl: './write-diary-record-dialog.component.html',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    QuillEditorComponent,
    MatButton,
    MatIcon
  ],
  styleUrls: ['./write-diary-record-dialog.component.scss']
})
export class WriteDiaryRecordDialogComponent {
  public item = { title: '', content: '' };
  public diaryViewConfig = this.store.selectSignal(selectDiaryViewConfig);
  constructor(@Inject(MAT_DIALOG_DATA) public data: number | null,
              protected dialogRef: MatDialogRef<WriteDiaryRecordDialogComponent>,
              private diaryService: DiaryService,
              private store: Store) {
    if (this.data) {
      this.diaryService.getById(this.data).pipe(
        take(1),
        tap(item => this.item = item),
      ).subscribe();
    }
  }
}
