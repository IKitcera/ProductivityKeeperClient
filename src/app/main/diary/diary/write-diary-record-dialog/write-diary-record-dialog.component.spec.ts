import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteDiaryRecordDialogComponent } from './write-diary-record-dialog.component';

describe('WriteDiaryRecordDialogComponent', () => {
  let component: WriteDiaryRecordDialogComponent;
  let fixture: ComponentFixture<WriteDiaryRecordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteDiaryRecordDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WriteDiaryRecordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
