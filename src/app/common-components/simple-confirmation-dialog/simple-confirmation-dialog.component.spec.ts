import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleConfirmationDialogComponent} from './simple-confirmation-dialog.component';
import {TestModule} from "../../../tests/test.module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

describe('SimpleConfirmationDialogComponent', () => {
  let component: SimpleConfirmationDialogComponent;
  let fixture: ComponentFixture<SimpleConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleConfirmationDialogComponent],
      imports: [TestModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {label: 'lbl'}},
        {provide: MatDialogRef<SimpleConfirmationDialogComponent>, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
