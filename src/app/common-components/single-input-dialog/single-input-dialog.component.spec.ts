import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleInputDialogComponent} from './single-input-dialog.component';
import {TestModule} from "../../../tests/test.module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

describe('SingleInputDialogComponent', () => {
  let component: SingleInputDialogComponent;
  let fixture: ComponentFixture<SingleInputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleInputDialogComponent],
      imports: [TestModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {label: 'lbl', text: 'txt'}},
        {provide: MatDialogRef<SingleInputDialogComponent>, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
