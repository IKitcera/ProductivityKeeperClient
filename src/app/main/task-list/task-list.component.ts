import {Component, OnInit, ViewChild} from '@angular/core';
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
import {Observable} from "rxjs";
import {trigger} from "@angular/animations";
import {StatisticsComponent} from "../statistics/statistics.component";
import {ConnectedToDifferentSubcategoriesTask} from "../../models/connected-to-different-subcategories-task";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  @ViewChild('stat') statistic: StatisticsComponent;
  updateStat = new Observable<void>();
  activeCategory: Category | undefined;
  // @ts-ignore
  unit: Unit = new Unit();
  loading = false;

  constructor(private taskService: TaskService, private dialog: MatDialog, private toastr: ToastrService) { }

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
      this.getCategories();
    });
  }

  taskChanged(subId: number, task: Task, value: MatCheckboxChange){
    task.isChecked = value.checked;
    this.taskService.checkTask(this.activeCategory?.id as number, subId, task.id)
      .then(x => this.getCategories());
    // this.taskService.putTask((this.activeCategory as Category).id, subId, task.id, task).then(x => {
    //   this.getCategories();
    // });
  }

  async editTask(subId: number, task: Task){
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: {
        task: task,
        categories: this.unit.categories,
        categoryId: this.activeCategory?.id,
        subcategoryId: subId
      },
      width: '60%'
    });

    await dialogRef.afterClosed().toPromise();
    const connected = task as ConnectedToDifferentSubcategoriesTask;
    if (connected && connected.categoriesId?.length > 0 && connected.subcategoriesId?.length > 0) {
      await this.taskService.putConnectedTask((this.activeCategory as Category).id, subId, task.id, connected)
        .catch(err => this.toastr.error(err.message || err, ''));
      await this.getCategories();
    } else {
      await this.taskService.putTask((this.activeCategory as Category).id, subId, task.id, task);
      await this.getSubcategory(subId);
    };
  }

  drop(event: any) {
    moveItemInArray((this.activeCategory as Category).subcategories, event.previousIndex, event.currentIndex);

    this.taskService.putCategory(this.activeCategory as Category).catch(x => {
      moveItemInArray((this.activeCategory as Category).subcategories, event.currentIndex, event.previousIndex);
    });
  }

  private async getUnit() {
    this.loading = true;
    this.unit = await this.taskService.getUnit();
    this.selectActiveCtg();
    await this.statistic.refresh();
    this.loading = false;
  }

  private async getActiveCategory() {
    this.loading = true;
    const catId = this.unit.categories.findIndex(c => c.id === (this.activeCategory as Category).id);
    this.unit.categories[catId] = await this.taskService.getCategory((this.activeCategory as Category).id);
    this.activeCategory = this.unit.categories[catId];
    await this.statistic.refresh();
    this.loading = false;
  }

  private async getSubcategory(id: number) {
    this.loading = true;
    const catId = this.unit.categories.findIndex(c => c.id === (this.activeCategory as Category).id);
    const subIndex = this.unit.categories[catId].subcategories.findIndex(s => s.id === id);
    this.unit.categories[catId].subcategories[subIndex] = await this.taskService.getSubcategory((this.activeCategory as Category).id, id);
    await this.statistic.refresh();
    this.loading = false;
  }

   private async getCategories() {
    this.loading = true;
    this.unit.categories = await this.taskService.getCategories();
    this.selectActiveCtg();
    await this.statistic.refresh();
    this.loading = false;
  }

  private selectActiveCtg() {
    if (this.unit.categories.length > 0) {
      const activeCtg = this.unit.categories.find(c => c.id === this.activeCategory?.id);
      this.activeCategory = this.activeCategory && activeCtg ? activeCtg : this.unit.categories[0];
    } else {
      this.activeCategory = undefined;
    }
  }
}

export enum ItemType{
  Category,
  Subcategory,
  Task
}
