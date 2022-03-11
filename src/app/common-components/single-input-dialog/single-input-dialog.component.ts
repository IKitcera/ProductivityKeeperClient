import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-single-input-dialog',
  templateUrl: './single-input-dialog.component.html',
  styleUrls: ['./single-input-dialog.component.css']
})
export class SingleInputDialogComponent implements OnInit {

  input: string;

  constructor(@Inject(MAT_DIALOG_DATA) public labelToShow: string,
              public matDialogRef: MatDialogRef<SingleInputDialogComponent>) {
    matDialogRef.beforeClosed().subscribe(() => matDialogRef.close(this.input));
  }

  ngOnInit(): void {
  }

  close() {
    this.matDialogRef.close(this.input);
  }

}
