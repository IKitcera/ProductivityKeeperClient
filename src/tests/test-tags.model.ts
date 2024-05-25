import {Tag} from "../app/core/models/tag.model";

export class TestTagsModel extends Tag {
  constructor(cId: number, sId: number, tId: number) {
    super();

    this.subcategoryId = sId;
    this.categoryId = cId;
    this.taskId = tId;
  }
}
