import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimerDialogComponent } from './edit-timer-dialog.component';

describe('EditTimerDialogComponent', () => {
  let component: EditTimerDialogComponent;
  let fixture: ComponentFixture<EditTimerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTimerDialogComponent ]
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
