import {Component, HostListener, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Category} from "../../core/models/category.model";
import {Subcategory} from "../../core/models/subcategory.model";
import {Unit} from "../../core/models/unit.model";
import {TaskService} from "../../core/services/taskService";
import {TaskItem} from "../../core/models/task.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {EditTaskDialogComponent} from "./edit-task-dialog/edit-task-dialog.component";
import {moveItemInArray} from "@angular/cdk/drag-drop";
import {BehaviorSubject, EMPTY, finalize, first, map, Observable, switchMap, tap} from "rxjs";
import {catchError, filter} from 'rxjs/operators';
import {StatisticsComponent} from "../statistics/statistics.component";
import {ToastrService} from "ngx-toastr";
import {TimerComponent} from "../timer/timer.component";
import {StorageService} from "../../core/services/storageService";
import {Constants} from "../../core/models/constants";
import {untilDestroyed} from "../../core/services/until-destroyed";
import {observableWrap$} from "../../core/functions/observable-helper.functions";
import {DialogService} from "../../core/services/dialog.service";
import {Tag} from "../../core/models/tag.model";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {

  @ViewChild('stat') statistic: StatisticsComponent;
  @ViewChild('timer') timer: TimerComponent;
  @Output() loaderStateChanged = new BehaviorSubject(false);

  updateStat = new Observable<void>();
  areTasksLoading = false;
  showAnotherBackground = false;
  statRefreshTimerId: number | null;
  statForceRefreshAllowed = false


  unit$ = new BehaviorSubject<Unit>(null);
  activeCtg$ = new BehaviorSubject<Category>(null);
  tags$ = new BehaviorSubject<Tag[]>([]);
  tagsSource$ = this.taskService.getTags().pipe(
    tap(tags => this.tags$.next(tags))
  );


  constructor(private taskService: TaskService,
              private storageService: StorageService,
              private dialog: DialogService,
              private toastr: ToastrService) {

    this.initData();
    this.listenChanges();
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event): void {
    this.loaderStateChanged.next(true);
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
  }

  private initData() {
    this.loaderStateChanged.next(true);

    this.taskService.getUnit().pipe(
      first(),
      tap(unit => this.unit$.next(new Unit(unit))),
      filter(unit => !!unit.categories.filter(c => c.isVisible)?.length),

      map(unit => this.activeCtg$.value ?? unit.categories.filter(c => c.isVisible)[0]),
      tap(activeCtg => this.activeCtg$.next(activeCtg)),

      finalize(() => this.loaderStateChanged.next(false)),
      untilDestroyed(this)
    ).subscribe();
  }

  private listenChanges() {

    this.unit$.pipe(
      tap(unit => {

        // TODO: REFACTOR
        // this.timer.timer = this.unit.timer;
        // this.statistic.statistic = this.unit.statistic;
        //
        // this.storageService.saveUnit(unit);
        //
        // this.timer.refresh();
        //   this.refreshAllStatistic();

        //this.timer.isLoading = false;
      }),

      switchMap(_ => this.tagsSource$),
      tap(x => console.log(x)),
      untilDestroyed(this)
    ).subscribe();


    this.activeCtg$.asObservable().pipe(
      tap(activeCtg => {

      }),
      untilDestroyed(this)
    ).subscribe();
  }

  addCategory(): void {
    let category = new Category({unitId: this.unit$.value.id});
    this.dialog.openSimpleInputDialog('New category name').pipe(
      tap(res => category.name = res ?? category.name),
      switchMap(_ => this.taskService.postCategory(category)),
      tap(newCtg => {
        const unit = this.unit$.value;
        unit.categories.push(newCtg);
        this.unit$.next(unit);
        this.activeCtg$.next(newCtg);
      }),
    ).subscribe();
  }

  deleteCategory(id?: number): void {
    id ??= this.activeCtg$.value.id;

    this.dialog.openSimpleConfirmationDialog(Constants.sureAboutDelete + Constants.cannotRevert).pipe(
      switchMap(_ => this.taskService.deleteCategory(id)),
      tap(_ => {
        const unit = this.unit$.value;
        unit.categories.splice(unit.categories.findIndex(c => c.id === id), 1);
        this.unit$.next(unit);
      }),
    ).subscribe();
  }

  editCategory(ctgId?: number): void {
    const ctg = ctgId ?
      this.unit$.value.categories.find(c => c.id === ctgId) :
      this.activeCtg$.value;

    this.dialog.openSimpleInputDialog('Change category name', ctg.name).pipe(
      tap(res => ctg.name = res || ctg.name),
      switchMap(_ => this.taskService.putCategory(ctg)),
      tap(category => {
        const unit = this.unit$.value;
        unit.categories[unit.categories.indexOf(ctg)] = category;
        this.unit$.next(unit);
      })
    ).subscribe();

  }

  addSubcategory(): void {
    console.log(new Subcategory({categoryId: this.activeCtg$.value.id}));
    let subcategory = new Subcategory({categoryId: this.activeCtg$.value.id});
    this.dialog.openSimpleInputDialog('New subcategory name').pipe(
      tap(res => subcategory.name = res ?? ''),
      switchMap(_ => this.taskService.addSubcategory(subcategory)),
      tap(sub => {
        const activeCtg = this.activeCtg$.value;
        activeCtg.subcategories.push(sub);
        this.activeCtg$.next(activeCtg);
      }),
    ).subscribe();
  }

  deleteSubcategory(subId: number): void {
    this.dialog.openSimpleConfirmationDialog(Constants.sureAboutDelete + Constants.cannotRevert).pipe(
      filter(res => !!res),
      switchMap(_ => this.taskService.deleteSubcategory(subId)),
      tap(res => this.activeCtg$.value.subcategories.splice(
        this.activeCtg$.value.subcategories.findIndex(sub => sub.id === subId),
        1
      )),
      untilDestroyed(this)
    ).subscribe();
  }

  editSubcategory(subcategory: Subcategory) {
    //TODO: Make a copy?
    this.dialog.openSimpleInputDialog('Change subcategory name', subcategory.name).pipe(
      tap(res => subcategory.name = res || subcategory.name),
      switchMap(_ => this.taskService.updateSubcategory(subcategory)),
      tap(updatedSub => subcategory = updatedSub)
    ).subscribe();
  }

  addTask(subId: number) {
    this.dialog.openSimpleInputDialog('What need to do?').pipe(
      filter(res => !!res?.length),
      map(text => new TaskItem({
        text,
        subcategories: [new Subcategory({id: subId, categoryId: this.activeCtg$.value?.id})]
      })),
      switchMap(task => this.taskService.addTask(task)),
      tap(newTask => {
        const activeCtg = this.activeCtg$.value;
        const targetSub = activeCtg.subcategories.find(s => s.id === subId);
        targetSub.tasks.push(newTask);
        this.activeCtg$.next(activeCtg);
      })
    ).subscribe();
  }

  deleteTask(subId: number, taskId: number) {
    this.taskService.deleteTask(taskId).pipe(
      tap(_ => {
        const activeCtg = this.activeCtg$.value;
        const targetSub = activeCtg.subcategories.find(s => s.id === subId);
        const taskInd = targetSub.tasks.findIndex(t => t.id === taskId);
        targetSub.tasks.splice(taskInd, 1);
        this.activeCtg$.next(activeCtg);
      }),
      catchError(err => {
        this.toastr.error(err.message || 'Error has happened. Task was restored');
        return EMPTY;
      })
    ).subscribe();
  }

  taskCheckedStateChanged(subId: number, task: TaskItem, value: MatCheckboxChange) {
    // task.isChecked = value.checked;
    // if (task.isRepeatable && task.isChecked) {
    //   task.timesToRepeat--;
    // }
    //
    // if (task.isChecked) {
    //   const tasks: TaskItem [] = [];
    //
    //   this.activeCategory?.subcategories.map(s => s.tasks.map(t => {
    //     if (t && (!t.relationId || !tasks.filter(ta => ta.id !== t.id)
    //       .map(ta => ta.relationId).includes(t.relationId)))
    //       tasks.push(t);
    //   }));
    //
    //   if (tasks.filter(t => t.isChecked).length === tasks.length) {
    //     this.toastr.success(`You've done all tasks in category ${this.activeCategory?.name}`, 'Congratulation! 🎉🎉🎉');
    //   }
    // }
    // this.moveTaskInSubcategoryByIdData(this.activeCategory?.id as number, subId, task);
    //
    // this.updateRelatedTasksLocal(task);
    //
    // this.taskService.checkTask(this.activeCategory?.id as number, subId, task.id)
    //   .then(x => this.refreshAllStatistic(true))
    //   .catch(x => task.isChecked = !task.isChecked);
  }

  editTask(subId: number, task: TaskItem) {
    //TODO: Refactor dialog T comp
    this.dialog.openDialog(EditTaskDialogComponent, {
      data: {
        task: task,
        unit: this.unit$.value,
        categoryId: this.activeCtg$.value.id,
        subcategoryId: subId
      },
      width: '60%'
    }).pipe(
      switchMap(task => this.taskService.updateTask(task)),
      tap(updatedTask => {
        const unit = this.unit$.value;
        for (let sub of updatedTask.subcategories) {
          const category = unit.categories.find(c => c.id === sub.categoryId);
          const subcategory = category.subcategories.find(s => s.id === sub.id);
          const taskInd = subcategory.tasks.findIndex(t => t.id === updatedTask.id);
          subcategory.tasks[taskInd] = updatedTask;
        }
        this.unit$.next(unit);
      })
    ).subscribe();
  }

  // TODO: Make for dropping to other categories
  drop(event: any) {
    moveItemInArray(this.activeCtg$.value.subcategories, event.previousIndex, event.currentIndex);

    observableWrap$(this.taskService.putCategory(this.activeCtg$.value)).pipe(
      catchError((err) => {
        moveItemInArray(this.activeCtg$.value.subcategories, event.currentIndex, event.previousIndex);
        return EMPTY;
      })
    )
  }

  changeActiveCategory(ctgId: number) {
    // this.activeCategory = this.unit.categories.find(c => c.id === newCategory.id);
    // this.refreshAllStatistic();
  }

  // getRelatedTags(relationId: number, subcategory: Subcategory): { ctg: Category, sub: string }[] {
  // const fullRelation = this.unit.taskToManySubcategories.find(r => r.id === relationId);
  //
  // const tags: { ctg: Category, sub: string }[] = [];
  // if (fullRelation) {
  //   fullRelation.taskSubcategories.map(ts => {
  //     if (ts.subcategoryId !== subcategory.id) {
  //       const ctg = this.unit.categories.find(c => c.id === ts.categoryId);
  //       const sub = ctg?.subcategories.find(s => s.id === ts.subcategoryId);
  //
  //       tags.push({
  //         ctg: Object.assign(new Category(), ctg),
  //         sub: sub?.name || ''
  //       });
  //     }
  //   });
  // }
  // return tags;
  // }

  private async getSubcategory(id: number) {
    // this.areTasksLoading = true;
    // this.showAnotherBackground = true;
    // const catId = this.unit.categories.findIndex(c => c.id === (this.activeCategory as Category).id);
    // const subIndex = this.unit.categories[catId].subcategories.findIndex(s => s.id === id);
    // this.unit.categories[catId].subcategories[subIndex] = await this.taskService.getSubcategory((this.activeCategory as Category).id, id);
    // this.areTasksLoading = false;
    // this.showAnotherBackground = false;
    // this.storageService.saveUnit(this.unit);
    // this.statistic.refresh();
  }

  private async getCategories() {
    // this.areTasksLoading = true;
    // this.unit.categories = await this.taskService.getCategories();
    // this.selectActiveCtg();
    // this.areTasksLoading = false;
    // this.storageService.saveUnit(this.unit);
    // this.statistic.refresh();
  }


  private moveTaskInSubcategoryByIdData(ctgId: number, subId: number, task: TaskItem) {
    // const ctgInd = this.unit.categories.findIndex(c => c.id === ctgId) as number;
    // const subInd = this.unit.categories[ctgInd].subcategories.findIndex(s => s.id === subId) as number;
    // const taskInd = this.unit.categories[ctgInd].subcategories[subInd].tasks.findIndex(t => t.id === task.id) as number;
    //
    // this.moveTaskInSubcategoryByIndexesData(ctgInd, subInd, taskInd);
  }

  private moveTaskInSubcategoryByIndexesData(ctgIndex: number, subIndex: number, taskIndex: number) {
    // const taskArr = this.unit.categories[ctgIndex].subcategories[subIndex].tasks as TaskItem [];
    // const newTaskInd = taskArr[taskIndex].isChecked ? taskArr.length - 1 : 0;
    //
    // moveItemInArray(taskArr, taskIndex, newTaskInd);
  }

  private refreshAllStatistic(forceReload = false) {
    // this.statRefreshTimerId ??= setInterval(() => {
    //   this.statForceRefreshAllowed = true;
    // }, 60000);

    this.statistic.refresh(forceReload);
    //   this.statistic.activeCtg = this.activeCategory as Category;
    this.statistic.populateDonutChart();
  }
}
