import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Timer} from "../../../core/models/timer.model";
import {TimeSpan} from "../timer.component";
import {Time} from "@angular/common";

@Component({
  selector: 'app-edit-timer-dialog',
  templateUrl: './edit-timer-dialog.component.html',
  styleUrls: ['./edit-timer-dialog.component.css']
})
export class EditTimerDialogComponent implements OnInit {
  goalTS: TimeSpan = new TimeSpan();
  timer: Timer;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Timer,
              public matDialogRef: MatDialogRef<EditTimerDialogComponent>) {
    this.timer = data;
    this.goalTS.getFromSeconds(this.timer.goal);

    matDialogRef.beforeClosed().subscribe(() => {
      this.timer.goal = this.goalTS.getInSeconds();
    });
  }

  ngOnInit(): void {
  }

  close() {
    this.goalTS.eachValToNum();
    this.timer.goal = this.goalTS.getInSeconds();
    this.matDialogRef.close(this.timer);
  }
}
