import {Subcategory} from "./subcategory.model";
import {Color} from "./color.model";
import {ColorConverter} from "../services/color-converter";

export class Category {
  id: number;
  name: string;
  color: Color;
  subcategories: Subcategory[];
  isVisible: boolean;

  public get c_color(): string {
    return ColorConverter.hex(this.color);
  }
  public set c_color(hex: string) {
    this.color = ColorConverter.rgba(hex);
  }
  public get pure_contrast(): string {
    return ColorConverter.pureContrast(this.color);
  }
}
