import {TaskItem} from "./task.model";
import {Category} from "./category.model";

export class Subcategory {
  id: number;
  name: string;
  color: string;
  categoryId: number;
  category: Category;
  tasks: TaskItem[] = [];

  constructor(obj?: any) {
    if (!obj) {
      return;
    }
    this.id = obj.id;
    this.name = obj.name;
    this.color = obj.color;
    this.categoryId = obj.categoryId;
    this.category = obj.category;
    this.tasks = obj.tasks?.map(t => new TaskItem(t)) ?? [];
  }
}
