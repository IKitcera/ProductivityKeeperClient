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

  connectedDupliate: {cId:number, sId:number}[] = [];

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



    // this.taskService.getTaskRelation(this.data.categoryId, this.data.subcategoryId, this.data.task.id).then(x => {
    //   const relation = x.taskSubcategories.filter(y => y.taskId !== this.data.task.id);
    //   for (const r of relation) {
    //     this.connectedDupliate.push({cId: r.categoryId, sId: r.subcategoryId});
    //   }
    // })
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
          console.log(this.data.task.deadline);
        }
      }
    }

    //this.transformDateValues();
  }

  private transformDateValues(){
    this.trimTimezoneFromLocalDateTime(this.data.task.deadline);
    this.trimTimezoneFromLocalDateTime(this.data.task.doneDate);
  }

  /*  This manipulation is used if it's necessary to send local time as utc(with trimming offsets)
      We will subtract time*offset, so you got 2x offset but with visible for system 1x offset,
      so on the backend it'll count just once
      Normally we would add time*offset to get time in utc. */
  private  trimTimezoneFromLocalDateTime(date: Date | string | null | undefined): Date | null {
    if (!date)
      return null;
    const d = new Date(date);
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
  }

  findCtg(id: number): Category{
    const ind = this.data.unit.categories.findIndex(categ => categ.id === id);
    return this.data.unit.categories[ind];
  }

  ctgSelectionChanged (item: any, newVal: any) {
    const ctg = this.findCtg(newVal as number);
    const subCtg = ctg.subcategories[0] || null;

    item.cId = ctg?.id;
    item.sId = subCtg?.id;
  }

  getSubcategories(categoryId: number): Subcategory[] {
    const subs = this.findCtg(categoryId)?.subcategories;
    return subs;
  }

  removeConnectedLine(item: any): void {
    const index = this.connectedDupliate.indexOf(item, 0);
    if (index > -1) {
      this.connectedDupliate.splice(index, 1);
    }
  }
}
