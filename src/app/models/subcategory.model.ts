import {Color} from "./color.model";
import {Task} from "./task.model";

export class Subcategory{
  id: number;
  name: string;
  color: Color;
  tasks: Task[] = [];
}
