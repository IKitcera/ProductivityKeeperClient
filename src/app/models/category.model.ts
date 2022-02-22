import {Subcategory} from "./subcategory.model";
import {Color} from "./color.model";

export class Category {
  id: number;
  name: string;
  color: Color;
  subcategories: Subcategory[];
}
