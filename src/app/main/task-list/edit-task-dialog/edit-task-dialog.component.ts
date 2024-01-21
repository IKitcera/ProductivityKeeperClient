import {Component, Inject, OnDestroy} from '@angular/core';
import {TaskItem} from "../../../core/models/task.model";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {Category} from "../../../core/models/category.model";
import {Subcategory} from "../../../core/models/subcategory.model";
import {Unit} from "../../../core/models/unit.model";
import {ToastrService} from "ngx-toastr";
import {Tag} from "../../../core/models/tag.model";
import {IConnectedDuplicate} from "../../../core/interfaces/connected-duplicate.interface";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnDestroy {

  connectedDuplicates: IConnectedDuplicate [] = [];
  previousRepeatCount: number | undefined;
  shouldResetRepeatableTask = false;

  public get categories(): Category[] {
    return this.data.unit.categories
      .filter(c => !!c.subcategories?.filter(s => s.id !== this.data.subcategoryId).length
      );
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                task: TaskItem,
                unit: Unit,
                taskRelations: Tag[],
                categoryId: number,
                subcategoryId: number
              },
              public matDialogRef: MatDialogRef<EditTaskDialogComponent>,
              private toastr: ToastrService) {
    this.data.task.deadline = this.data.task.deadline ? new Date(this.data.task.deadline) : null;
    this.data.task.doneDate = this.data.task.doneDate ? new Date(this.data.task.doneDate) : null;

    if (this.data.task.isRepeatable)
      this.previousRepeatCount = this.data.task.timesToRepeat;

    this.connectedDuplicates = this.data.taskRelations
      .map(tag => ({cId: tag.categoryId, sId: tag.subcategoryId}));
  }

  ngOnDestroy(): void {
  }

  close(data: any) {
    if (!this.connectedDuplicates?.length) {
      this.toastr.error('At least one subcategory should be selected');
      return;
    }

    this.beforeClosedAction();
    this.matDialogRef.close(data);
  }

  beforeClosedAction() {
    this.data.task.subcategories = this.connectedDuplicates
      .map(pair => new Subcategory({id: pair.sId, categoryId: pair.cId}))

    // We will set deadline to 23:59 if it's not set and is included in today sub
    const ctgWithTodaySub = this.data.unit.categories.find(c => c.subcategories.find(s => s.name.toLowerCase() === 'today'));
    if (ctgWithTodaySub) {
      const todaySub = ctgWithTodaySub.subcategories.find(x => x.name.toLowerCase() === 'today');
      if (this.connectedDuplicates.some(x => x.cId === ctgWithTodaySub.id && x.sId === todaySub?.id) &&
        !this.data.task.deadline) {
        let date = new Date();
        date.setHours(23, 59, 59);
        this.data.task.deadline = date;
      }
    }

    if (this.data.task.isRepeatable) {
      if (this.shouldResetRepeatableTask) {
        this.data.task.timesToRepeat = this.data.task.goalRepeatCount;
        this.data.task.isChecked = false;
        return;
      }

      if (!this.previousRepeatCount) {
        this.previousRepeatCount = this.data.task.goalRepeatCount;
      }
      const compl = this.data.task.goalRepeatCount - this.previousRepeatCount;

      this.data.task.timesToRepeat = this.data.task.goalRepeatCount - compl;
    }
  }

  findCtg(id: number): Category {
    return this.categories.find(categ => categ.id === id) as Category;
  }


  public getSubcategories(categoryId: number): Subcategory[] {
    return this.findCtg(categoryId)?.subcategories
      .filter(s => s.id !== this.data.subcategoryId
      );
  }

  ctgSelectionChanged(item: any, newVal: any) {
    const ctg = this.findCtg(newVal as number);
    const subCtg = this.getSubcategories(ctg.id)[0];
    item.cId = ctg?.id;
    item.sId = subCtg?.id;
  }

  addConnectedLine(): void {
    const firsDuplicate = this.getFirstDuplicateIfPossible() as IConnectedDuplicate;
    this.connectedDuplicates.push(firsDuplicate);
  }

  removeConnectedLine(item: any): void {
    const index = this.connectedDuplicates.indexOf(item, 0);
    if (index > -1) {
      this.connectedDuplicates.splice(index, 1);
    }
  }

  isAddingDuplicatesDisabled(): boolean {
    return !this.categories.length || !this.getFirstDuplicateIfPossible();
  }

  private getFirstDuplicateIfPossible(): IConnectedDuplicate | null {
    let duplicate = null;
    for (const ctg of this.categories) {
      const subs = this.getSubcategories(ctg.id);
      if (!subs.length) {
        continue;
      }

      duplicate = <IConnectedDuplicate>{cId: ctg.id, sId: subs[0].id};
      break;
    }
    return duplicate;
  }

  resetRepeatingCount(): void {
    this.shouldResetRepeatableTask = true;
  }
}
