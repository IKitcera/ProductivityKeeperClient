import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DiaryRecord} from "../diary.component";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {QuillEditorComponent} from "ngx-quill";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-write-diary-record-dialog',
  imports: [
    MatFormField,
    MatLabel,
    FormsModule,
    MatInput,
    QuillEditorComponent,
    MatButton
  ],
  templateUrl: './write-diary-record-dialog.component.html',
  styleUrl: './write-diary-record-dialog.component.css',
  standalone: true
})
export class WriteDiaryRecordDialogComponent {
  previewMode = false;

  constructor(
    public dialogRef: MatDialogRef<WriteDiaryRecordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiaryRecord) {
  }
}
