import {Component, forwardRef, Inject, OnInit} from '@angular/core';
import {Task} from "../../../models/task.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Timer} from "../../../models/timer.model";
import {Category} from "../../../models/category.model";
import {ConnectedToDifferentSubcategoriesTask} from "../../../models/connected-to-different-subcategories-task";
import {Subcategory} from "../../../models/subcategory.model";
import {TaskService} from "../../../services/taskService";
import {combineLatest} from "rxjs";
import {Unit} from "../../../models/unit.model";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {

  connectedDupliate: IConnectedDuplicate [] = [];
  previousRepeatCount: number | undefined;

  public get categories(): Category[] {
    return this.data.unit.categories
      .filter(c => !!c.subcategories?.filter(s => s.id !== this.data.subcategoryId).length
      );
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                task: Task,
                unit: Unit,
                categoryId: number,
                subcategoryId: number
              },
              public matDialogRef: MatDialogRef<EditTaskDialogComponent>,
              private taskService: TaskService) {
    this.data.task.deadline = this.data.task.deadline ? new Date(this.data.task.deadline) : null;
    this.data.task.doneDate = this.data.task.doneDate ? new Date(this.data.task.doneDate) : null;

    if (this.data.task.isRepeatable)
      this.previousRepeatCount = this.data.task.timesToRepeat;

    matDialogRef.beforeClosed().subscribe(() => this.close());
  }

  ngOnInit(): void {
    const relation = this.data.unit.taskToManySubcategories.find(x => x.id === this.data.task.relationId);

    if (relation) {
      const taskSubcategories = relation.taskSubcategories.filter(y => y.taskId !== this.data.task.id);
      for (const r of taskSubcategories) {
        this.connectedDupliate.push({cId: r.categoryId, sId: r.subcategoryId});
      }
    }
  }

  close() {
    this.beforeClosedAction();
    this.matDialogRef.close(this.data);
  }

  beforeClosedAction(){
    if (this.connectedDupliate.length > 0){
      const connected = this.data.task as ConnectedToDifferentSubcategoriesTask;
      if(!connected) {
        this.data.task = new ConnectedToDifferentSubcategoriesTask().copyFromBase(this.data.task);
      }
      (this.data.task as ConnectedToDifferentSubcategoriesTask).categoriesId = this.connectedDupliate.map(x => x.cId);
      (this.data.task as ConnectedToDifferentSubcategoriesTask).subcategoriesId = this.connectedDupliate.map(x => x.sId);

      // We will set deadline to 23:59 if it's not set and is included in today sub
      const ctgWithTodaySub = this.data.unit.categories.find(c => c.subcategories.find(s => s.name.toLowerCase() === 'today' ));
      if (ctgWithTodaySub) {
        const todaySub = ctgWithTodaySub.subcategories.find(x => x.name.toLowerCase() === 'today');
        if (this.connectedDupliate.some(x => x.cId === ctgWithTodaySub.id && x.sId === todaySub?.id) &&
            !this.data.task.deadline) {
          let ddate = new Date();
          ddate.setHours(23,59,59);
          this.data.task.deadline = ddate;
        }
      }
    }

    if (this.data.task.isRepeatable) {

      const compl = this.previousRepeatCount as number || 0 - this.data.task.timesToRepeat;

      this.data.task.timesToRepeat = compl > 0 ?
        this.data.task.goalRepeatCount - compl :
        this.data.task.goalRepeatCount;
    }
  }

  findCtg(id: number): Category{
    return this.categories.find(categ => categ.id === id) as Category;
  }


  public getSubcategories(categoryId: number): Subcategory[] {
    const subs = this.findCtg(categoryId)?.subcategories
      .filter(s => s.id !== this.data.subcategoryId
      );
    return subs;
  }

  ctgSelectionChanged (item: any, newVal: any) {
    const ctg = this.findCtg(newVal as number);
    const subCtg = this.getSubcategories(ctg.id)[0];

    item.cId = ctg?.id;
    item.sId = subCtg?.id;
  }

  addConnectedLine():void {
    const firsDuplicate = this.getFirstDuplicateIfPossible() as IConnectedDuplicate;
    this.connectedDupliate.push(firsDuplicate);
  }

  removeConnectedLine(item: any): void {
    const index = this.connectedDupliate.indexOf(item, 0);
    if (index > -1) {
      this.connectedDupliate.splice(index, 1);
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
}

interface IConnectedDuplicate {
  cId:  number;
  sId:  number;
}
