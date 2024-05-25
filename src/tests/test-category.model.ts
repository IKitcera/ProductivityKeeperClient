import {Category} from "../app/core/models/category.model";
import {TestSubcategoryModel} from "./test-subcategory.model";

export class TestCategoryModel extends Category {
  constructor(id: number, unitId: number) {
    super();

    this.id = id;
    this.name = `Category ${id}`;
    this.unitId = unitId;
    this.subcategories = [
      new TestSubcategoryModel(1 * id, id),
      new TestSubcategoryModel(2 * id, id),
    ];
  }
}
