import {Component, HostListener, OnDestroy, Output, ViewChild} from '@angular/core';
import {Category} from "../../core/models/category.model";
import {Subcategory} from "../../core/models/subcategory.model";
import {Unit} from "../../core/models/unit.model";
import {TaskService} from "../../core/services/taskService";
import {TaskItem} from "../../core/models/task.model";
import {EditTaskDialogComponent} from "./edit-task-dialog/edit-task-dialog.component";
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {BehaviorSubject, EMPTY, finalize, first, map, Observable, of, switchMap, tap} from "rxjs";
import {catchError, filter} from 'rxjs/operators';
import {StatisticsComponent} from "../statistics/statistics.component";
import {ToastrService} from "ngx-toastr";
import {TimerComponent} from "../timer/timer.component";
import {StorageService} from "../../core/services/storageService";
import {Constants} from "../../core/models/constants";
import {untilDestroyed} from "../../core/services/until-destroyed";
import {DialogService} from "../../core/services/dialog.service";
import {Tag} from "../../core/models/tag.model";
import {IConnectedDuplicate} from "../../core/interfaces/connected-duplicate.interface";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnDestroy {

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
              private toastr: ToastrService,
              private activatedRoute: ActivatedRoute) {

    this.initData();
    this.listenChanges();
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(): void {
    this.loaderStateChanged.next(true);
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
      tap(_ => {
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
      untilDestroyed(this)
    ).subscribe();


    this.activeCtg$.pipe(
      tap(activeCtg => {
        if (this.unit$.value) {
          const unit = this.unit$.value;
          const ctgInd = unit.categories.findIndex(c => c.id === activeCtg.id);
          unit.categories[ctgInd] = activeCtg;
          this.unit$.next(unit);
        }
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
      map(_ => (this.unit$.value.categories?.filter(c => c.isVisible)[0]) || null),
      tap(activeCtg => this.activeCtg$.next(activeCtg)),
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
      tap(_ => this.activeCtg$.value.subcategories.splice(
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
        subcategories: [
          new Subcategory({id: subId, categoryId: this.activeCtg$.value?.id})
        ]
      })),
      switchMap(task => this.taskService.addTask(task)),
      tap(newTask => this.updateUnitWithTaskChanges(newTask, true, false, false))
    ).subscribe();
  }

  deleteTask(task: TaskItem) {
    let confirmedDeleteMessage: string;
    if (this.tags$.value.filter(tag => tag.taskId === task.id).length > 1) {
      confirmedDeleteMessage = 'This task has some relations, so it\'ll be removed form other places. Confirm delete?';
    } else if (task.isRepeatable) {
      confirmedDeleteMessage = 'The task is repeatable. Are you sure?';
    }

    const allowDelete$ = confirmedDeleteMessage
      ? this.dialog.openSimpleConfirmationDialog(confirmedDeleteMessage)
      : of(true);

    allowDelete$.pipe(
      switchMap(_ => this.taskService.deleteTask(task.id)),
      tap(_ => {
        task.subcategories = [];
        this.updateUnitWithTaskChanges(task, false, false, true)
      }),
      untilDestroyed(this),
      catchError(err => {
        this.toastr.error(err.message || 'Error has happened. Task was restored');
        return EMPTY;
      })
    ).subscribe();
  }

  taskCheckedStateChanged(taskId: number) {
    this.taskService.changeTaskStatus(taskId).pipe(
      tap(updatedTask => {
        this.updateUnitWithTaskChanges(updatedTask, false, true, false);

        const allTasks = (this.activeCtg$.value.subcategories || []).map(x => x.tasks || []).flat();
        if (!!allTasks.length && allTasks.filter(t => t.isChecked).length === allTasks.length) {
          this.toastr.success(`You've done all tasks in category ${this.activeCtg$.value.name}`, 'Congratulation! 🎉🎉🎉');
        }
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  editTask(subId: number, task: TaskItem) {
    this.dialog.openDialog(EditTaskDialogComponent, {
      data: {
        task: task,
        unit: this.unit$.value,
        taskRelations: this.tags$.value.filter(x => x.taskId === task.id),
        categoryId: this.activeCtg$.value.id,
        subcategoryId: subId
      },
      width: '60%'
    }).pipe(
      switchMap(task => this.taskService.updateTask(task)),
      tap(updatedTask =>
        this.updateUnitWithTaskChanges(updatedTask, true, true, true))
    ).subscribe();
  }

  dropSubcategory(event: any) {
    moveItemInArray(this.activeCtg$.value.subcategories, event.previousIndex, event.currentIndex);

    this.taskService.reorderSubcategories(this.activeCtg$.value.subcategories.map(s => s.id)).pipe(
      untilDestroyed(this),
      catchError((err) => {
        moveItemInArray(this.activeCtg$.value.subcategories, event.currentIndex, event.previousIndex);
        throw err;
      })
    ).subscribe();
  }

  dropTask(event: CdkDragDrop<TaskItem[]>, newSubId: number): void {
    if (event.previousContainer === event.container) {
      if (event.currentIndex === event.previousIndex) {
        return;
      }
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.taskService.reorderTasks(event.container.data.map(s => s.id)).pipe(
        first(),
        catchError((err) => {
          moveItemInArray(
            this.activeCtg$.value.subcategories,
            event.currentIndex,
            event.previousIndex
          );
          throw err;
        })
      ).subscribe();
      return;
    }

    // check goes while entering drag
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    const droppedTask = event.item.data;
    const connectedDuplicatesByTask = this.tags$.value
      .filter(tag => tag.taskId === droppedTask.id)
      .map(tag => ({cId: this.activeCtg$.value.id, sId: tag.subcategoryId} as IConnectedDuplicate));

    const oldSubId = this.activeCtg$.value.subcategories
      .find(s => connectedDuplicatesByTask.map(cd => cd.sId).includes(s.id)
        && !s.tasks.map(t => t?.id)?.includes(droppedTask.id))
      .id;

    connectedDuplicatesByTask.splice(
      connectedDuplicatesByTask.findIndex(cd => cd.sId === oldSubId),
      1
    );
    connectedDuplicatesByTask.push({
      sId: newSubId,
      cId: this.activeCtg$.value.id
    });
    droppedTask.subcategories = connectedDuplicatesByTask
      .map(pair => new Subcategory({id: pair.sId, categoryId: pair.cId}));

    this.taskService.updateTask(droppedTask).pipe(
      tap(updatedTask => console.log(updatedTask)),
      tap(updatedTask =>
        this.updateUnitWithTaskChanges(updatedTask, false, true, false)),
      first(),
      catchError((err) => {
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex,
        );
        throw err;
      })
    ).subscribe();

  }

  tasksDropListEnterPredicate(newSubId: number) {
    return (item: CdkDrag<TaskItem>) => this.tags$.value
      .filter(tag => tag.taskId === item.data.id)
      .every(tag => tag.subcategoryId !== newSubId)
  }


  changeActiveCategory(ctgId: number) {
    const targetCtg = this.unit$.value.categories.find(c => c.id === ctgId);
    this.activeCtg$.next(targetCtg);
  }

  private updateUnitWithTaskChanges(updatedTask: TaskItem, addRelations: boolean, updateRelations: boolean, deleteRelations: boolean): void {
    const unit = this.unit$.value;
    const taskRelations = this.tags$.value.filter(x => x.taskId === updatedTask.id);
    const relationsToBeRemoved = taskRelations.filter(map => !updatedTask.subcategories
      .map(s => s.id).includes(map.subcategoryId));

    if (deleteRelations) {
      for (let tag of relationsToBeRemoved) {
        const category = unit.categories.find(c => c.id === tag.categoryId);
        const subcategory = category.subcategories.find(s => s.id === tag.subcategoryId);
        const taskInd = subcategory.tasks.findIndex(t => t.id === tag.taskId);

        subcategory.tasks.splice(taskInd, 1);
      }
    }

    for (let sub of updatedTask.subcategories) {
      const category = unit.categories.find(c => c.id === sub.categoryId);
      const subcategory = category.subcategories.find(s => sub.id === s.id);
      const taskInd = subcategory.tasks.findIndex(t => t.id === updatedTask.id);

      if (taskInd !== -1 && updateRelations) {
        const prevState = subcategory.tasks[taskInd].isChecked;

        subcategory.tasks[taskInd] = updatedTask;

        if (updatedTask.isChecked !== prevState) {
          let newPosition = subcategory.tasks.length - 1;

          if (!updatedTask.isChecked) {
            newPosition -= subcategory.tasks.filter(task => task.isChecked).length;
          }
          moveItemInArray(subcategory.tasks, taskInd, newPosition);
        }
      } else if (addRelations) {
        subcategory.tasks.push(updatedTask);

        moveItemInArray(
          subcategory.tasks,
          subcategory.tasks.length - 1,
          subcategory.tasks.length - subcategory.tasks.filter(task => task.isChecked).length - 1
        );
      }
    }
    this.unit$.next(unit);
  }

  public getTasksEstimatedDuration(tasks: TaskItem[]): number {
    return tasks
      ?.reduce(
        (a,b) => a + b.executionDuration || 0,
        0) || 0;
  }
}
