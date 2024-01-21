import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {TaskItem} from "../../core/models/task.model";
import {Unit} from "../../core/models/unit.model";
import {text} from "d3";

@Component({
  selector: 'app-single-input-dialog',
  templateUrl: './single-input-dialog.component.html',
  styleUrls: ['./single-input-dialog.component.css']
})
export class SingleInputDialogComponent implements OnInit {

  input: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                label: string,
                text: string,
              },
              public matDialogRef: MatDialogRef<SingleInputDialogComponent>) {
    this.input = this.data.text || '';
  }

  ngOnInit(): void {
  }

  close() {
    this.matDialogRef.close(this.input);
  }

}
