import { Component, OnInit } from '@angular/core';
import {Category} from "../models/category.model";
import {Subcategory} from "../models/subcategory.model";
import {Unit} from "../models/unit.model";
import {TaskService} from "../services/taskService";
import {MatDialog} from "@angular/material/dialog";
import {SingleInputDialogComponent} from "../common-components/single-input-dialog/single-input-dialog.component";
import {Task} from "../models/task.model";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  newCategoryName: string;
  activeCategory: Category;
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
      this.newCategoryName = "";
    });
  }

  deleteCategory(id?: number){
    const identifier = id ?? this.activeCategory.id;
    this.taskService.deleteCategory(identifier).then(x => {
      this.getUnit();
    });
  }

  async addSubcategory(){
    let subcategory = new Subcategory();
    subcategory.name = await this.openSimpleDialog("New subcategory name");

    this.taskService.postSubcategory(this.activeCategory.id, subcategory).then(sub => {
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
    this.taskService.postTask(this.activeCategory.id, subId, task).then(task => {
      this.getSubcategory(subId);
    });
  }

  deleteTask(subId: number, taskId: number){
    this.taskService.deleteTask(this.activeCategory.id, subId, taskId).then(x => {
      this.getSubcategory(subId);
    });
  }

  taskChanged(subId: number, task: Task, value: MatCheckboxChange){
    task.isChecked = value.checked;
    this.taskService.putTask(this.activeCategory.id, subId, task.id, task).then(x => {
      this.getSubcategory(subId);
    });
  }

  private async getUnit() {
    this.unit = await this.taskService.getUnit();

    if (this.unit.categories.length > 0) {
      this.activeCategory = this.unit.categories.find(c => c.id === this.activeCategory?.id) ?? this.unit.categories[0];
    }
  }

  private async getActiveCategory() {
    const catId = this.unit.categories.findIndex(c => c.id === this.activeCategory.id);
    this.unit.categories[catId] = await this.taskService.getCategory(this.activeCategory.id);
    this.activeCategory = this.unit.categories[catId];
  }

  private async getSubcategory(id: number) {
    const catId = this.unit.categories.findIndex(c => c.id === this.activeCategory.id);
    const subIndex = this.unit.categories[catId].subcategories.findIndex(s => s.id === id);
    this.unit.categories[catId].subcategories[subIndex] = await this.taskService.getSubcategory(this.activeCategory.id, id);
  }
}

export enum ItemType{
  Category,
  Subcategory,
  Task
}
