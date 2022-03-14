import {Component, forwardRef, Inject, OnInit} from '@angular/core';
import {Task} from "../../../models/task.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Timer} from "../../../models/timer.model";
import {Category} from "../../../models/category.model";
import {ConnectedToDifferentSubcategoriesTask} from "../../../models/connected-to-different-subcategories-task";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {

  connectedDupliate: {cId:number, sId:number}[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { task: Task, categories: Category[] },
              public matDialogRef: MatDialogRef<EditTaskDialogComponent>) {
    const connected = data.task as ConnectedToDifferentSubcategoriesTask;
    if (connected && connected !== null && connected.categoriesId && connected.subcategoriesId){
      console.log(connected);
      for (let i = 0; i < connected.categoriesId.length; i++){
        this.connectedDupliate.push({cId: connected.categoriesId[i], sId: connected.subcategoriesId[i]});
      }
    }
    matDialogRef.beforeClosed().subscribe(() => this.close());
  }

  ngOnInit(): void {
  }

  close() {
    this.beforeClosedAction();
    this.matDialogRef.close(this.data);
  }

  beforeClosedAction(){
    if (this.connectedDupliate.length > 0){
      const connected = this.data.task as ConnectedToDifferentSubcategoriesTask;
      if(!connected || connected === null){
        this.data.task = new ConnectedToDifferentSubcategoriesTask().copyFromBase(this.data.task);
        (this.data.task as ConnectedToDifferentSubcategoriesTask).categoriesId = this.connectedDupliate.map(x => x.cId);
        (this.data.task as ConnectedToDifferentSubcategoriesTask).subcategoriesId = this.connectedDupliate.map(x => x.sId);
      }
    }
  }

  findCtg(id: number): Category{
    const ind = this.data.categories.findIndex(categ => categ.id === id);
    return this.data.categories[ind];
  }
}
