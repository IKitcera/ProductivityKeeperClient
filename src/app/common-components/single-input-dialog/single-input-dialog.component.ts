import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-single-input-dialog',
  templateUrl: './single-input-dialog.component.html',
  styleUrls: ['./single-input-dialog.component.css'],
  standalone: false
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
