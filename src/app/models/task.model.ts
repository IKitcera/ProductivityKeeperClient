import {TaskToManySubcategories} from "./task-to-many-subcategories";

export class Task{
  id: number;
  text: string;
  isChecked: boolean;
  deadline: Date | string | null;
  doneDate: Date | string | null;
  isRepeatable: boolean;
  timesToRepeat: number;
  goalRepeatCount: number;
  habbitIntervalInHours: number;
  relationId?: number | null;
  relatedTasks: TaskToManySubcategories
}
