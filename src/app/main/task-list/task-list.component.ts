import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
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
import {find, Observable} from "rxjs";
import {trigger} from "@angular/animations";
import {StatisticsComponent} from "../statistics/statistics.component";
import {ConnectedToDifferentSubcategoriesTask} from "../../models/connected-to-different-subcategories-task";
import {ToastrService} from "ngx-toastr";
import {TimerComponent} from "../timer/timer.component";
import {TaskToManySubcategories} from "../../models/task-to-many-subcategories";
import {TaskSubcategory} from "../../models/task-subcategory";
import {id} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  @ViewChild('stat') statistic: StatisticsComponent;
  @ViewChild('timer') timer: TimerComponent;
  @Output() loaderStateChanged = new EventEmitter<boolean>();

  updateStat = new Observable<void>();
  activeCategory: Category | undefined;
  // @ts-ignore
  unit: Unit = new Unit();
  areTasksLoading = false;

  constructor(private taskService: TaskService, private dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUnit();
  }

  async addCategory(){
    let category = new Category();
    category.name = await this.openSimpleDialog("New category name");
    this.unit.categories.push(category);
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
    this.activeCategory?.subcategories.push(subcategory);

    this.taskService.postSubcategory((this.activeCategory as Category).id, subcategory).then(sub => {
      this.getActiveCategory();
    });
  }

  deleteSubcategory(subId: number){
    const subInd = this.activeCategory?.subcategories.findIndex(sub => sub.id === subId);
    if (subInd === null || subInd === undefined || subInd === -1)
      return;

    const subSave = this.activeCategory?.subcategories as Subcategory[];
    this.activeCategory?.subcategories.splice(subInd,1);

    this.taskService.deleteSubcategory((this.activeCategory as Category).id, subId).catch(x => {
      let subs = this.activeCategory?.subcategories as Subcategory[];
      subs = subSave;
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

    const sub = this.activeCategory?.subcategories.find(s => s.id === subId);
    sub?.tasks.push(task);

    this.taskService.postTask((this.activeCategory as Category).id, subId, task).then(task => {
      this.getSubcategory(subId);
    });
  }

  async deleteTask(subId: number, taskId: number){
    const sub = this.activeCategory?.subcategories.find(s => s.id === subId);
    const taskInd = sub?.tasks.findIndex(t => t.id === taskId);

    if (taskInd === null || taskInd === undefined || taskInd === -1){
      return;
    }

    let tasks = this.activeCategory?.subcategories.find(s => s.id === subId)?.tasks as Task[];
    const tasksSave = tasks;

    tasks.splice(taskInd, 1);
    this.taskService.deleteTask((this.activeCategory as Category).id, subId, taskId).catch(err => {
      tasks = tasksSave;
      this.toastr.error(err.message || 'Error has happened. Task was restored');
    });
  }

  taskChanged(subId: number, task: Task, value: MatCheckboxChange){
    task.isChecked = value.checked;
    this.updateRelatedTasksLocal(task);

    this.statistic.activeCtg = this.activeCategory;
    this.statistic.populateDonutChart();

    this.taskService.checkTask(this.activeCategory?.id as number, subId, task.id)
      .catch(x => task.isChecked = !task.isChecked);
  }

  async editTask(subId: number, task: Task){
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: {
        task: task,
        unit: this.unit,
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
      await this.getUnit();
    } else {
      await this.taskService.putTask((this.activeCategory as Category).id, subId, task.id, task);
     // await this.getSubcategory(subId);
    }
  }

  drop(event: any) {
    moveItemInArray((this.activeCategory as Category).subcategories, event.previousIndex, event.currentIndex);

    this.taskService.putCategory(this.activeCategory as Category).catch(x => {
      moveItemInArray((this.activeCategory as Category).subcategories, event.currentIndex, event.previousIndex);
    });
  }

  changeActiveCategory(newCategory: Category) {
    this.activeCategory = newCategory;
    this.statistic.activeCtg = this.activeCategory as Category;
    this.statistic.populateDonutChart();
  }

  private async getUnit() {
    this.loaderStateChanged.emit(true);
    this.unit = await this.taskService.getUnit();
    this.selectActiveCtg();
    this.timer.timer = this.unit.timer;
    this.statistic.statistic = this.unit.statistic;
    this.loaderStateChanged.emit(false);
    this.timer.refresh();
    this.statistic.activeCtg = this.activeCategory as Category;
    this.statistic.refresh(false);
  }

  private async getActiveCategory() {
    this.areTasksLoading = true;
    const catId = this.unit.categories.findIndex(c => c.id === (this.activeCategory as Category).id);
    this.unit.categories[catId] = await this.taskService.getCategory((this.activeCategory as Category).id);
    this.activeCategory = this.unit.categories[catId];

    this.areTasksLoading = false;
    await this.statistic.refresh();
  }

  private async getSubcategory(id: number) {
    this.areTasksLoading = true;
    const catId = this.unit.categories.findIndex(c => c.id === (this.activeCategory as Category).id);
    const subIndex = this.unit.categories[catId].subcategories.findIndex(s => s.id === id);
    this.unit.categories[catId].subcategories[subIndex] = await this.taskService.getSubcategory((this.activeCategory as Category).id, id);
    this.areTasksLoading = false;
    this.statistic.refresh();
  }

   private async getCategories() {
    this.areTasksLoading = true;
    this.unit.categories = await this.taskService.getCategories();
    this.selectActiveCtg();
    this.areTasksLoading = false;
    this.statistic.refresh();
  }

  private selectActiveCtg() {
    if (this.unit.categories.length > 0) {
      const activeCtg = this.unit.categories.find(c => c.id === this.activeCategory?.id);
      this.activeCategory = this.activeCategory && activeCtg ? activeCtg : this.unit.categories[0];
      this.statistic.activeCtg = this.activeCategory;
    } else {
      this.activeCategory = undefined;
    }
  }

  private deleteRelatedTasksLocal(subId: number, taskId: number) {
    const relations = this.getRelatedTasks(taskId);

    for(let relation of relations) {
     const tasks = this.unit.categories.find(c => c.id === relation.categoryId)?.subcategories?.
        find(s => s.id === relation.subcategoryId)?.tasks;
    }

  }

  private updateRelatedTasksLocal(task: Task) {
    const relation = this.getRelatedTasks(task.id);
    relation.map(r => {
      const cInd = this.unit.categories.findIndex(c =>  c.id === r.categoryId);
      const sInd = this.unit.categories[cInd].subcategories.findIndex(s => s.id === r.subcategoryId);
      const tInd = this.unit.categories[cInd].subcategories[sInd].tasks.findIndex(t => t.id === r.taskId);

      this.unit.categories[cInd].subcategories[sInd].tasks[tInd] = JSON.parse(JSON.stringify(task));
      this.unit.categories[cInd].subcategories[sInd].tasks[tInd].id = r.taskId

    });
  }

  private getRelatedTasks(taskId: number): TaskSubcategory[] {
    const relation = this.unit.taskToManySubcategories.find(x => x.taskSubcategories.some(x => x.taskId === taskId))?.taskSubcategories;
    return relation ?? [];
  }
}

export enum ItemType{
  Category,
  Subcategory,
  Task
}
