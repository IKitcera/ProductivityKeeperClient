import { Component, OnInit } from '@angular/core';
import {Category} from "../../models/category.model";
import {Subcategory} from "../../models/subcategory.model";
import {Unit} from "../../models/unit.model";
import {TaskService} from "../../services/taskService";
import {MatDialog} from "@angular/material/dialog";
import {SingleInputDialogComponent} from "../../common-components/single-input-dialog/single-input-dialog.component";
import {Task} from "../../models/task.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {EditTaskDialogComponent} from "./edit-task-dialog/edit-task-dialog.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  activeCategory: Category | undefined;
  unit: Unit;

  constructor(private taskService: TaskService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUnit();
  }

  async addCategory(){
    let category = new Category();
    category.name = await this.openSimpleDialog("New category name");
    this.taskService.postCategory(category).then(x => {
      this.getUnit();
    });
  }

  deleteCategory(id?: number){
    const identifier = id ?? (this.activeCategory as Category).id;
    this.taskService.deleteCategory(identifier).then(x => {
      this.getUnit();
    });
  }

  async addSubcategory(){
    let subcategory = new Subcategory();
    subcategory.name = await this.openSimpleDialog("New subcategory name");

    this.taskService.postSubcategory((this.activeCategory as Category).id, subcategory).then(sub => {
      this.getActiveCategory();
    });
  }

  deleteSubcategory(subId: number){
    this.taskService.deleteSubcategory((this.activeCategory as Category).id, subId).then(x => {
      this.getActiveCategory();
    });
  }

  async openSimpleDialog(label: string): Promise<string> {
    const dialogRef = this.dialog.open(SingleInputDialogComponent, {
      data: label,
      width: '60%'
    });
    return await dialogRef.afterClosed().toPromise() as string || '';
  }

  async addTask(subId: number) {
    let task = new Task();
    task.text = await this.openSimpleDialog("What need to do?");
    this.taskService.postTask((this.activeCategory as Category).id, subId, task).then(task => {
      this.getSubcategory(subId);
    });
  }

  deleteTask(subId: number, taskId: number){
    this.taskService.deleteTask((this.activeCategory as Category).id, subId, taskId).then(x => {
      this.getSubcategory(subId);
    });
  }

  taskChanged(subId: number, task: Task, value: MatCheckboxChange){
    task.isChecked = value.checked;
    this.taskService.putTask((this.activeCategory as Category).id, subId, task.id, task).then(x => {
      this.getSubcategory(subId);
    });
  }

  editTask(subId: number, task: Task){
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: {task: task, categories: this.unit.categories},
      width: '60%'
    });

    dialogRef.afterClosed().toPromise().then(t => {
      this.taskService.putTask((this.activeCategory as Category).id, subId, task.id, task).then(tt => {
        this.getSubcategory(subId);
      })
    });
  }

  drop(event: any) {
    moveItemInArray((this.activeCategory as Category).subcategories, event.previousIndex, event.currentIndex);

    this.taskService.putCategory(this.activeCategory as Category).catch(x => {
      moveItemInArray((this.activeCategory as Category).subcategories, event.currentIndex, event.previousIndex);
    });
  }

  private async getUnit() {
    this.unit = await this.taskService.getUnit();

    if (this.unit.categories.length > 0) {
      const activeCtg = this.unit.categories.find(c => c.id === this.activeCategory?.id);
      this.activeCategory = this.activeCategory && activeCtg ? activeCtg : this.unit.categories[0];
    } else {
      this.activeCategory = undefined;
    }
  }

  private async getActiveCategory() {
    const catId = this.unit.categories.findIndex(c => c.id === (this.activeCategory as Category).id);
    this.unit.categories[catId] = await this.taskService.getCategory((this.activeCategory as Category).id);
    this.activeCategory = this.unit.categories[catId];
  }

  private async getSubcategory(id: number) {
    const catId = this.unit.categories.findIndex(c => c.id === (this.activeCategory as Category).id);
    const subIndex = this.unit.categories[catId].subcategories.findIndex(s => s.id === id);
    this.unit.categories[catId].subcategories[subIndex] = await this.taskService.getSubcategory((this.activeCategory as Category).id, id);
  }
}

export enum ItemType{
  Category,
  Subcategory,
  Task
}
