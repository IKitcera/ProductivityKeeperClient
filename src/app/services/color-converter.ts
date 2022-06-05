import {Color} from "../models/color.model";

export class ColorConverter {
  static hex(color: Color): string {
    const hex = "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b)
      .toString(16).slice(1);
    return hex;
  }

  static rgba (hex: string): Color {
    const color = new Color();
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      color.r = parseInt(result[1], 16);
      color.g = parseInt(result[2], 16);
      color.b = parseInt(result[3], 16);
    }

    return color;
  }

  static pureContrast(color: Color): string {
    if (color.r < 100 && color.g < 100 && color.b < 100) {
      return '#dddddd';
    } else if ((color.r + color.g + color.b) / 3 < 120) {
      return '#ffffff';
    } else {
      return '#000000';
    }
  }
}
