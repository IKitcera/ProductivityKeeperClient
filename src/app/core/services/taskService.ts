import { Injectable } from "@angular/core";
import { TaskItem } from "../models/task.model";
import { HttpService } from "./httpService";
import {map, Observable} from "rxjs";
import { Subcategory } from "../models/subcategory.model";
import { Category } from "../models/category.model";
import { Unit } from "../models/unit.model";
import {Tag} from "../models/tag.model";

@Injectable()
export class TaskService {

  private readonly taskUrl = 'api/Task';
  private readonly categoryUrl = 'api/Category';
  private readonly subcategoryUrl = 'api/Subcategory';

  constructor(private http: HttpService) {}

  getUnit(): Observable<Unit> {
    const url = `${this.categoryUrl}`;
    return this.http.get<Unit>(url);
  }

  getJustCategories(unitId: number): Observable<Category[]> {
    const url = `${this.categoryUrl}/Categories?unitId=${unitId}`;
    return this.http.get<Category[]>(url);
  }

  getCategory(categoryId: number): Observable<Category> {
    const url = `${this.categoryUrl}/${categoryId}`;
    return this.http.get<Category>(url);
  }

  putCategory(category: Category): Observable<Category> {
    const url = `${this.categoryUrl}/${category.id}`;
    return this.http.put<Category>(url, category);
  }

  postCategory(category: Category): Observable<Category> {
    const url = `${this.categoryUrl}`;
    return this.http.post<Category>(url, category);
  }

  deleteCategory(categoryId: number): Observable<void> {
    const url = `${this.categoryUrl}?categoryId=${categoryId}`;
    return this.http.delete<void>(url);
  }

  getSubcategories(categoryId: number): Observable<Subcategory[]> {
    const url = `${this.subcategoryUrl}/${categoryId}`;
    return this.http.get<Subcategory[]>(url);
  }

  getSubcategory(subcategoryId: number): Observable<Subcategory> {
    const url = `${this.subcategoryUrl}/${subcategoryId}`;
    return this.http.get<Subcategory>(url);
  }

  updateSubcategory(subcategory: Subcategory): Observable<any> {
    const url = `${this.subcategoryUrl}/${subcategory.id}`;
    return this.http.put(url, subcategory);
  }

  reorderSubcategories(ids: number[]): Observable<any> {
    const url = `${this.subcategoryUrl}/reorder`;
    return this.http.post(url, ids);
  }

  addSubcategory(subcategory: Subcategory): Observable<Subcategory> {
    const url = `${this.subcategoryUrl}`;
    return this.http.post<Subcategory>(url, subcategory);
  }

  deleteSubcategory(subcategoryId: number): Observable<any> {
    const url = `${this.subcategoryUrl}/${subcategoryId}`;
    return this.http.delete(url);
  }

  getTasks(subcategoryId: number): Observable<TaskItem[]> {
    const url = `${this.taskUrl}?subcategoryId=${subcategoryId}`;
    return this.http.get<TaskItem[]>(url);
  }

  getTask(taskId: number): Observable<TaskItem> {
    const url = `${this.taskUrl}/${taskId}`;
    return this.http.get<TaskItem>(url);
  }

  updateTask(task: TaskItem): Observable<TaskItem> {
    const url = `${this.taskUrl}/${task.id}`;
    return this.http.put<TaskItem>(url, task);
  }

  changeTaskStatus(taskId: number): Observable<TaskItem> {
    const url = `${this.taskUrl}/change-status`;
    return this.http.post<TaskItem>(url, taskId);
  }

  addTask(task: TaskItem): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.taskUrl, task);
  }

  deleteTask(taskId: number): Observable<any> {
    const url = `${this.taskUrl}/${taskId}`;
    return this.http.delete(url);
  }

  getTags(): Observable<Tag[]> {
    const url = `${this.taskUrl}/tags`;
    return this.http.get<Tag[]>(url).pipe(
      map(tags =>
        tags.map(tag => Object.assign(new Tag(), tag)))
    );
  }
}
