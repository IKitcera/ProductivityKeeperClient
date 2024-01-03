import {Injectable} from "@angular/core";
import {Unit} from "../models/unit.model";

@Injectable()
export class StorageService {
  private unit = '_unit';
  private minBeforeDeadline = '_minBeforeDeadline';
  constructor() {
  }

  saveNotificationTime(minBeforeDeadline: number): void {
    localStorage.setItem(this.minBeforeDeadline,  JSON.stringify(minBeforeDeadline ?? 30));
  }

  getNotificationTime(minBeforeDeadlineDefault: number = 30): any {
    const valueString = localStorage.getItem(this.minBeforeDeadline);
    return valueString ? +JSON.parse(valueString) : minBeforeDeadlineDefault;
  }
}
