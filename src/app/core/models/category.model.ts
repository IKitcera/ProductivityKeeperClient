import {Subcategory} from "./subcategory.model";

export class Category {
  id: number;
  name: string;
  color: string;
  unitId: number
  subcategories: Subcategory[] = [];
  isVisible: boolean;

  constructor(obj?: any) {
    if (!obj) {
      return;
    }
    this.id = obj.id;
    this.name = obj.name;
    this.color = obj.color;
    this.unitId = obj.unitId;
    this.subcategories = obj.subcategories?.map(s => new Subcategory(s)) ?? [];
    this.isVisible = obj.isVisible;
  }
}
