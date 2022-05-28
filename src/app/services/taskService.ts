import {Unit} from "../models/unit.model";
import {HttpService} from "./httpService";
import {Category} from "../models/category.model";
import {Task} from "../models/task.model";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {Subcategory} from "../models/subcategory.model";
import {Injectable} from "@angular/core";
import {ConnectedToDifferentSubcategoriesTask} from "../models/connected-to-different-subcategories-task";
import {TaskToManySubcategories} from "../models/task-to-many-subcategories";
import {throwError} from "rxjs";

@Injectable()
export class TaskService{
  constructor(private  http: HttpService) {
  }
  //Category
  async getUnit(): Promise<Unit> {
    return await this.http.get<Unit>('api/Category').toPromise() as Unit;
  }

  async getCategories(): Promise<Category[]>{
    return await this.http.get<Category[]>('api/Category/Categories').toPromise() || [];
  }
  async getCategory(categoryId: number): Promise<Category>{
    return await this.http.get<Category>('api/Category/' + categoryId, new HttpParams()
      .set('categoryId',categoryId.toString())
    ).toPromise() as Category;
  }
  async postCategory(category: Category): Promise<Category> {
    return await this.http.post<Category>('api/Category', category).toPromise() as Category;
  }
  async putCategory(category: Category): Promise<boolean>{
    const res =  await this.http.put('api/Category/'+category.id, category, new HttpParams()
      .set('categoryId', category.id.toString())
    ).toPromise();
    return this.checkRes(res);
  }
  async deleteCategory(categoryId: number): Promise<boolean>{
    const res =  await this.http.delete('api/Category', new HttpParams()
      .set('categoryId',categoryId.toString())
    ).toPromise();
    return this.checkRes(res);
  }
  //Subcategory
  async getSubcategories(categoryId: number): Promise<Subcategory[]>{
    return (await this.http.get<Subcategory[]>('api/Subcategory', new HttpParams()
      .set('categoryId',categoryId.toString())
    ).toPromise()) as Subcategory[];
  }
  async getSubcategory(categoryId: number, subcategoryId: number): Promise<Subcategory>{
    return await this.http.get<Subcategory>('api/Subcategory/'+subcategoryId, new HttpParams()
      .set('categoryId',categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise() as Subcategory;
  }
  async postSubcategory(categoryId: number, sub: Subcategory): Promise<Subcategory>{
    return await this.http.post<Subcategory>('api/Subcategory', sub, new HttpParams()
      .set('categoryId', categoryId.toString())
    ).toPromise() as Subcategory;
  }
  async changeCategoriesOrder(categories: Category[]): Promise<any>{
    return await this.http.put('api/Category/changeOrder', categories)
      .toPromise();
  }

  async putSubcategory(categoryId: number, subcategoryId: number, sub: Subcategory): Promise<boolean>{
    const res = await this.http.put('api/Subcategory/' + subcategoryId.toString(), sub, new HttpParams()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise();
    return this.checkRes(res);
  }
  async deleteSubcategory(categoryId: number, subcategoryId: number): Promise<boolean>{
    const res =  await this.http.delete('api/Subcategory', new HttpParams()
      .set('categoryId',categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise();
    return this.checkRes(res);
  }
  //Task
  async getTasks(categoryId: number, subcategoryId: number): Promise<Task[]>{
    return await this.http.get<Task[]>('api/Task', new HttpParams()
      .set('categoryId',categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise() as Task[];
  }
  //don;t work
  async getTask(categoryId: number, subcategoryId: number, taskId: number): Promise<Task>{
    return (await this.http.get<Task>('api/Task', new HttpParams()
      .set('categoryId',categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
      .set('taskId', taskId.toString())
    ).toPromise()) as Task;
  }

  async getTaskRelation(categoryId: number, subcategoryId: number, taskId: number): Promise<TaskToManySubcategories>{
    return (await this.http.get('api/Task/getTaskRelation', new HttpParams()
      .set('categoryId',categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
      .set('taskId', taskId.toString())
    ).toPromise()) as TaskToManySubcategories;
  }

  async postTask(categoryId: number, subcategoryId: number, task: Task): Promise<Task>{
    if(!categoryId || !subcategoryId || !task) {
      throwError('Empty ids');
    }
    return await this.http.post<Task>('api/Task', task, new HttpParams()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise() as Task;
  }
  async checkTask(categoryId: number, subcategoryId: number, taskId: number): Promise<boolean>{
    const res = await this.http.post('changeStatus', null, new HttpParams()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
      .set('taskId', taskId.toString())
    ).toPromise();
    return this.checkRes(res)
  }

  async putTask(categoryId: number, subcategoryId: number, taskId: number, task: Task): Promise<boolean>{
    if(!categoryId || !subcategoryId || !taskId || !task) {
      throwError('Empty ids');
    }
    const res = await this.http.put('api/Task', task, new HttpParams()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
      .set('taskId', taskId.toString())
    ).toPromise();
    return this.checkRes(res);
  }

  async putConnectedTask(categoryId: number, subcategoryId: number, taskId: number, task: ConnectedToDifferentSubcategoriesTask): Promise<boolean>{
    const res = await this.http.put('api/Task/edit-connected-task', task, new HttpParams()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
      .set('taskId', taskId.toString())
    ).toPromise();
    return this.checkRes(res);
  }

  async deleteTask(categoryId: number, subcategoryId: number, taskId: number): Promise<boolean>{
    const res =  await this.http.delete('api/Task', new HttpParams()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
      .set('taskId', taskId.toString())
    ).toPromise();
    return this.checkRes(res);
  }

  private checkRes(res:any): boolean{
    if (res) {
      return true;
    }
    return false;
  }

}
