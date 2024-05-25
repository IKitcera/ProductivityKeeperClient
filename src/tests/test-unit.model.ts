import {Unit} from "../app/core/models/unit.model";
import {TestCategoryModel} from "./test-category.model";

export class TestUnitModel extends Unit {
  constructor() {
    super();

    this.id = 1;
    this.statisticId = 1;
    this.categories = [
      new TestCategoryModel(1, 1),
      new TestCategoryModel(2, 1)
    ]
  }
}
