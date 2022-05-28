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
import {StorageService} from "../../services/storageService";
import {
  SimpleConfirmationDialogComponent
} from "../../common-components/simple-confirmation-dialog/simple-confirmation-dialog.component";
import {Constants} from "../../models/constants";

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

  constructor(private taskService: TaskService,
              private storageService: StorageService,
              private dialog: MatDialog,
              private toastr: ToastrService) { }

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

  async deleteCategory(id?: number){
    const identifier = id ?? (this.activeCategory as Category).id;

    const confirmationDialog = this.dialog.open(SimpleConfirmationDialogComponent, {data: {label: Constants.sureAboutDelete + Constants.cannotRevert}});
    const res = await confirmationDialog.afterClosed().toPromise();
    if (res) {
      this.taskService.deleteCategory(identifier).then(x => {
        this.getUnit();
      });
    }
  }

  async editCategory(ctgId: number | null = null){
    const ctg = ctgId ?
      this.unit.categories.find(c => c.id === ctgId) as Category :
      this.activeCategory as Category;

    const lastName = ctg.name;
    ctg.name = await this.openSimpleDialog('Change category name',ctg.name) || ctg.name;

    this.taskService.putCategory(ctg).catch(x => {
      ctg.name = lastName;
    });

    this.storageService.saveUnit(this.unit);
  }

  async addSubcategory(){
    let subcategory = new Subcategory();
    subcategory.name = await this.openSimpleDialog("New subcategory name");
    this.activeCategory?.subcategories.push(subcategory);

    this.taskService.postSubcategory((this.activeCategory as Category).id, subcategory).then(sub => {
      this.getActiveCategory();
    });
  }

  async deleteSubcategory(subId: number){
    const subInd = this.activeCategory?.subcategories.findIndex(sub => sub.id === subId);
    if (subInd === null || subInd === undefined || subInd === -1)
      return;

    const confirmationDialog = this.dialog.open(SimpleConfirmationDialogComponent, {data: {label: Constants.sureAboutDelete + Constants.cannotRevert}});
    const res = await confirmationDialog.afterClosed().toPromise();

    if(!res)
      return;

    const subcategory = this.activeCategory?.subcategories[subInd];
    if(!!subcategory?.tasks.length) {
      subcategory.tasks.map(task => {
        this.deleteRelatedTaskLocal(task);
      })
    }

    const subSave = this.activeCategory?.subcategories as Subcategory[];
    this.activeCategory?.subcategories.splice(subInd,1);

    this.taskService.deleteSubcategory((this.activeCategory as Category).id, subId)
      .then(x => this.refreshAllStatistic())
      .catch(x => {
      let subs = this.activeCategory?.subcategories as Subcategory[];
      subs = subSave;
    });

    this.storageService.saveUnit(this.unit);
  }

  async editSubcategory(subcategory: Subcategory) {
    const lastName = subcategory.name;
    subcategory.name = await this.openSimpleDialog(
      'Change subcategory name',
      subcategory.name) || subcategory.name;

    this.taskService.putSubcategory(this.activeCategory?.id as number, subcategory.id, subcategory)
      .catch(err => {
        subcategory.name = lastName;
        this.toastr.error(err.message);
    });

    this.storageService.saveUnit(this.unit);
  }

  async openSimpleDialog(label: string, text: string | null = null): Promise<any> {
    const dialogRef = this.dialog.open(SingleInputDialogComponent, {
      data: {label, text},
      width: '60%'
    });
    return await dialogRef.afterClosed().toPromise() as string || '';
  }

  async addTask(subId: number) {
    let task = new Task();
    task.text = await this.openSimpleDialog("What need to do?", null);

    const sub = this.activeCategory?.subcategories.find(s => s.id === subId);
    sub?.tasks.push(task);

    this.taskService.postTask((this.activeCategory as Category).id, subId, task).then(task => {
      this.getSubcategory(subId);
      this.refreshAllStatistic();
    });
  }

  async deleteTask(subId: number, taskId: number){
    const sub = this.activeCategory?.subcategories.find(s => s.id === subId);
    const taskInd = sub?.tasks.findIndex(t => t.id === taskId) as number;

    let tasks = this.activeCategory?.subcategories.find(s => s.id === subId)?.tasks as Task[];
    const task = tasks[taskInd];

    const tasksSave = [...tasks];

    this.deleteRelatedTaskLocal(task);
    tasks.splice(taskInd, 1);

    this.taskService.deleteTask((this.activeCategory as Category).id, subId, taskId)
      .then(x => this.refreshAllStatistic())
      .catch(err => {
        tasks = tasksSave;
        this.toastr.error(err.message || 'Error has happened. Task was restored');
    });
  }

  taskCheckedStateChanged(subId: number, task: Task, value: MatCheckboxChange){
    task.isChecked = value.checked;
    if(task.isRepeatable && task.isChecked) {
      task.timesToRepeat --;
    }

    this.moveTaskInSubcategoryByIdData(this.activeCategory?.id as number, subId, task);

    this.updateRelatedTasksLocal(task);

    this.taskService.checkTask(this.activeCategory?.id as number, subId, task.id)
      .then(x => this.refreshAllStatistic())
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
      this.refreshAllStatistic();
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
    this.refreshAllStatistic();
  }

  private async getUnit(forceReload = true) {
    this.loaderStateChanged.emit(true);

    const savedUnit = this.storageService.getUnit();
    this.unit = forceReload || !savedUnit ?
      await this.taskService.getUnit() :
      savedUnit;

    this.selectActiveCtg();
    this.timer.timer = this.unit.timer;
    this.statistic.statistic = this.unit.statistic;
    this.loaderStateChanged.emit(false);
    this.timer.refresh();
    this.storageService.saveUnit(this.unit);
    this.refreshAllStatistic();
  }

  private async getActiveCategory() {
    this.areTasksLoading = true;
    const catId = this.unit.categories.findIndex(c => c.id === (this.activeCategory as Category).id);
    this.unit.categories[catId] = await this.taskService.getCategory((this.activeCategory as Category).id);
    this.activeCategory = this.unit.categories[catId];

    this.areTasksLoading = false;
    this.storageService.saveUnit(this.unit);
    await this.statistic.refresh();
  }

  private async getSubcategory(id: number) {
    this.areTasksLoading = true;
    const catId = this.unit.categories.findIndex(c => c.id === (this.activeCategory as Category).id);
    const subIndex = this.unit.categories[catId].subcategories.findIndex(s => s.id === id);
    this.unit.categories[catId].subcategories[subIndex] = await this.taskService.getSubcategory((this.activeCategory as Category).id, id);
    this.areTasksLoading = false;
    this.storageService.saveUnit(this.unit);
    this.statistic.refresh();
  }

   private async getCategories() {
    this.areTasksLoading = true;
    this.unit.categories = await this.taskService.getCategories();
    this.selectActiveCtg();
    this.areTasksLoading = false;
     this.storageService.saveUnit(this.unit);
    this.statistic.refresh();
  }

  private selectActiveCtg() {
    const visibleCategories = this.unit.categories.filter(c => c.isVisible);
    if (visibleCategories.length > 0) {
      const activeCtg = visibleCategories.find(c => c.id === this.activeCategory?.id);
      this.activeCategory = this.activeCategory && activeCtg ? activeCtg : visibleCategories[0];
      this.statistic.activeCtg = this.activeCategory;
    } else {
      this.activeCategory = undefined;
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

      this.moveTaskInSubcategoryByIndexesData(cInd, sInd, tInd);
    });
  }

  private deleteRelatedTaskLocal(task: Task) {
    const relation = this.getRelatedTasks(task.id);
    relation.map(r => {
      const cInd = this.unit.categories.findIndex(c =>  c.id === r.categoryId);
      const sInd = this.unit.categories[cInd].subcategories.findIndex(s => s.id === r.subcategoryId);
      const tInd = this.unit.categories[cInd].subcategories[sInd].tasks.findIndex(t => t.id === r.taskId);

      this.unit.categories[cInd].subcategories[sInd].tasks.splice(tInd, 1);
    });
  }

  private getRelatedTasks(taskId: number): TaskSubcategory[] {
    const relation = this.unit.taskToManySubcategories.find(x => x.taskSubcategories.some(x => x.taskId === taskId))?.taskSubcategories;
    return relation ?? [];
  }

  private moveTaskInSubcategoryByIdData (ctgId: number, subId: number, task: Task) {
    const ctgInd = this.unit.categories.findIndex(c => c.id === ctgId) as number;
    const subInd = this.unit.categories[ctgInd].subcategories.findIndex(s => s.id === subId) as number;
    const taskInd = this.unit.categories[ctgInd].subcategories[subInd].tasks.findIndex(t => t.id === task.id) as number;

    this.moveTaskInSubcategoryByIndexesData(ctgInd, subInd, taskInd);
  }

  private moveTaskInSubcategoryByIndexesData(ctgIndex: number, subIndex: number, taskIndex: number) {
    const taskArr = this.unit.categories[ctgIndex].subcategories[subIndex].tasks as Task [];
    const newTaskInd = taskArr[taskIndex].isChecked ? taskArr.length - 1 : 0;

    moveItemInArray(taskArr, taskIndex, newTaskInd);
  }

  private refreshAllStatistic() {
    this.statistic.activeCtg = this.activeCategory as Category;
    this.statistic.refresh(false);
    this.statistic.populateDonutChart();
  }
}

export enum ItemType{
  Category,
  Subcategory,
  Task
}
