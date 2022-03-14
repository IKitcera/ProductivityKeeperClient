import {Task} from "./task.model";

export class ConnectedToDifferentSubcategoriesTask extends Task{
  categoriesId: number[] = [];
  subcategoriesId: number[] = [];

  copyFromBase(task: Task): ConnectedToDifferentSubcategoriesTask{
    this.id = task.id;
    this.isChecked = task.isChecked;
    this.text = task.text;
    this.deadline = task.deadline;
    this.doneDate = task.doneDate;

    return this;
  }
}
