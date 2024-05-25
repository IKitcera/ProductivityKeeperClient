import {Subcategory} from "../app/core/models/subcategory.model";
import {TestTaskModel} from "./test-task.model";

export class TestSubcategoryModel extends Subcategory {
  constructor(id: number, catId: number) {
    super();

    this.id = id;
    this.categoryId = catId;
    this.name = `Subcategory ${id}`;
    this.tasks = [
      new TestTaskModel(1*id),
      new TestTaskModel(2*id),
      new TestTaskModel(3*id)
    ];
  }
}
