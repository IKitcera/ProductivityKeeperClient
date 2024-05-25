import {TaskItem} from "../app/core/models/task.model";

export class TestTaskModel extends TaskItem {
  constructor(id: number) {
    super();

    this.id = id;
    this.text = `Task ${id}`;
  }
}
