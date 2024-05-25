import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditTaskDialogComponent} from './edit-task-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TestModule} from "../../../../tests/test.module";
import {TestUnitModel} from "../../../../tests/test-unit.model";
import {TestTaskModel} from "../../../../tests/test-task.model";
import {TestTagsModel} from "../../../../tests/test-tags.model";

describe('EditTaskDialogComponent', () => {
  let component: EditTaskDialogComponent;
  let fixture: ComponentFixture<EditTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTaskDialogComponent],
      imports: [TestModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA, useValue: {
            task: new TestTaskModel(1),
            unit: new TestUnitModel(),
            taskRelations: [
              new TestTagsModel(1, 1, 1),
              new TestTagsModel(2, 1, 2),
            ],
            categoryId: 1,
            subcategoryId: 1
          }
        },
        {provide: MatDialogRef<EditTaskDialogComponent>, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
