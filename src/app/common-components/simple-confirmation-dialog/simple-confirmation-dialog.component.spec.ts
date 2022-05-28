import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleConfirmationDialogComponent } from './simple-confirmation-dialog.component';

describe('SimpleConfirmationDialogComponent', () => {
  let component: SimpleConfirmationDialogComponent;
  let fixture: ComponentFixture<SimpleConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleConfirmationDialogComponent ]
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
