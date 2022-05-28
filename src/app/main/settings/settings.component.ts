import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatCalendar} from "@angular/material/datepicker";
import {StorageService} from "../../services/storageService";
import {Unit} from "../../models/unit.model";
import {TaskService} from "../../services/taskService";
import {Category} from "../../models/category.model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public unit: Unit;
  public categories: Category[];
  private needChangeOrder = false;
  get hasUnitAnyCategory(): boolean {
    return  this.unit && this.unit.categories?.length > 0;
  }

  constructor(private taskService: TaskService,
              private storageService: StorageService,
              private  toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.unit = this.storageService.getUnit() as Unit;
    if (!this.unit) {
      this.taskService.getUnit().then(u => {
        this.unit = u;
      });
    }
    this.categories = this.unit.categories;
  }

  ngOnDestroy(): void {

  }

  drop(event: any) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }

  async saveChanges() {
    this.taskService.changeCategoriesOrder(this.categories).then(() => {
      this.unit.categories = this.categories;
      this.storageService.saveUnit(this.unit);
      this.toastr.success("Changes has been saved");
    }).catch(err => this.toastr.error(err.message ?? "Unknown error"));
  }
}
