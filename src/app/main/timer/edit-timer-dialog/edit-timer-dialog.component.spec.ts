import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimerDialogComponent } from './edit-timer-dialog.component';
import {TestModule} from "../../../../tests/test.module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Timer} from "../../../core/models/timer.model";
import {of} from "rxjs";

describe('EditTimerDialogComponent', () => {
  let component: EditTimerDialogComponent;
  let fixture: ComponentFixture<EditTimerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTimerDialogComponent ],
      imports: [TestModule],
      providers: [
        {
          provide: MatDialogRef<EditTimerDialogComponent>, useValue: {
            beforeClosed() { return of(null) }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: new Timer()}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTimerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
