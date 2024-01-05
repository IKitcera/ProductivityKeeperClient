import {Injectable} from "@angular/core";
import {Unit} from "../models/unit.model";
import {StorageConstants} from "../constants/storage-constants";

@Injectable()
export class StorageService {
  public setProp(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public retrieveProp<T>(key: string, defaultVal?: T, valueReviver?: (key: string, value: any) => T): T {
    const valueString = localStorage.getItem(key);
    const parsedValue = valueString ? JSON.parse(valueString, valueReviver) : defaultVal;
    console.log(parsedValue);
    return parsedValue as T;
  }
}
