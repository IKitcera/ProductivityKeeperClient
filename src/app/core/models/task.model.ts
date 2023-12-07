import {Subcategory} from "./subcategory.model";
import {Tag} from "./tag.model";

export class TaskItem {
  id: number;
  text: string;
  isChecked: boolean;
  deadline: Date | string | null;
  doneDate: Date | string | null;
  executionDuration: number | null;
  isRepeatable: boolean;
  timesToRepeat: number;
  goalRepeatCount: number;
  habbitIntervalInHours: number;
  subcategories: Subcategory[];
  tags: Tag[]

  constructor(obj?: any) {
    if (!obj) {
      return;
    }
    this.id = obj.id;
    this.text = obj.text;
    this.isChecked = obj.isChecked;
    this.deadline = obj.deadline;
    this.doneDate = obj.doneDate;
    this.isRepeatable = obj.isRepeatable;
    this.timesToRepeat = obj.timesToRepeat;
    this.goalRepeatCount = obj.goalRepeatCount;
    this.habbitIntervalInHours = obj.habbitIntervalInHours;
    this.subcategories = obj.subcategories.map(s => new Subcategory(
      {id: s.id, name: s.name, categoryId: s.categoryId, tasks: [] }
    ));
  }
}
