import {ColorHelper} from "@swimlane/ngx-charts";

export class Tag {
  text: string;
  colorHex: string
  taskId: number;
  subcategoryId: number;
  categoryId: number

  get textColor(): string {

    // Remove '#' from the beginning of the hex color string
    const hex = this.colorHex.replace('#', '');

    // Extract the RGB components from the hex string
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const resColor = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');


    // Concatenate the hexadecimal components to form the final hex color code
    const hexColor = `#${hexR}${hexG}${hexB}`;

    return hexColor;
  }
}
