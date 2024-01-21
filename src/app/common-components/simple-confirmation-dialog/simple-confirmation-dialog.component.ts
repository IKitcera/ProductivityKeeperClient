import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-simple-confirmation-dialog',
  templateUrl: './simple-confirmation-dialog.component.html',
  styleUrls: ['./simple-confirmation-dialog.component.css']
})
export class SimpleConfirmationDialogComponent {

  public result = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                label: string
              },
              public matDialogRef: MatDialogRef<SimpleConfirmationDialogComponent>) {
  }

  close(){
    this.matDialogRef.close(this.result);
  }

  confirm() {
    this.result = true;
    this.close();
  }

}
