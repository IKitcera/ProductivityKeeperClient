import {Injectable} from "@angular/core";
import {Unit} from "../models/unit.model";

@Injectable()
export class StorageService {
  private unit = '_unit';
  private unitId = '_unit_id';
  constructor() {
  }

  saveUnit(unit: Unit): void {
    localStorage.setItem(this.unit,  JSON.stringify(unit));
  }

  getUnit(): any {
    const valueString = localStorage.getItem(this.unit);
    return valueString? JSON.parse(valueString) as Unit : null;
  }
}
