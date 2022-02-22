import {Unit} from "../models/unit.model";
import {HttpService} from "./httpService";
import {Category} from "../models/category.model";
import {HttpHeaders} from "@angular/common/http";
import {Subcategory} from "../models/subcategory.model";

export class TaskService{
  constructor(private  http: HttpService) {
  }
  //Category
  async getUnit(): Promise<Unit> {
    return await this.http.get<Unit>('Category').toPromise() as Unit;
  }
  //don't work
  async getCategory(categoryId: number): Promise<Category>{
    return await this.http.get<Category>('Category', new HttpHeaders()
      .set('categoryId',categoryId.toString())
    ).toPromise() as Category;
  }
  async postCategory(category: Category): Promise<Category> {
    return await this.http.post<Category>('Category', category).toPromise() as Category;
  }
  async putCategory(category: Category): Promise<boolean>{
    const res =  await this.http.put('Category', category, new HttpHeaders()
      .set('categoryId', category.id.toString())
    ).toPromise();
    return this.checkRes(res);
  }
  async deleteCategory(categoryId: number): Promise<boolean>{
    const res =  await this.http.delete('Category', new HttpHeaders()
      .set('categoryId',categoryId.toString())
    ).toPromise();
    return this.checkRes(res);
  }
  //Subcategory
  async getSubcategories(categoryId: number): Promise<Subcategory[]>{
    return (await this.http.get<Subcategory[]>('Subcategory', new HttpHeaders()
      .set('categoryId',categoryId.toString())
    ).toPromise()) as Subcategory[];
  }
  //don't work
  async getSubcategory(categoryId: number, subcategoryId: number): Promise<Subcategory>{
    return await this.http.get<Subcategory>('Subcategory', new HttpHeaders()
      .set('categoryId',categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise() as Subcategory;
  }
  async postSubcategory(categoryId: number, sub: Subcategory): Promise<Subcategory>{
    return await this.http.post<Subcategory>('Subcategory', sub, new HttpHeaders()
      .set('categoryId', categoryId.toString())
    ).toPromise() as Subcategory;
  }
  //won;t work
  async putSubcategory(categoryId: number, subcategoryId: number, sub: Subcategory): Promise<boolean>{
    const res = await this.http.put('Subcategory', sub, new HttpHeaders()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise();
    return this.checkRes(res);
  }
  async deleteSubcategory(categoryId: number, subcategoryId: number): Promise<boolean>{
    const res =  await this.http.delete('Subcategory', new HttpHeaders()
      .set('categoryId',categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise();
    return this.checkRes(res);
  }
  //Task
  async getTasks(categoryId: number, subcategoryId: number): Promise<Task[]>{
    return await this.http.get<Task[]>('Task', new HttpHeaders()
      .set('categoryId',categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise() as Task[];
  }
  //don;t work
  async getTask(categoryId: number, subcategoryId: number, taskId: number): Promise<Task>{
    return (await this.http.get<Task>('Task', new HttpHeaders()
      .set('categoryId',categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
      .set('taskId', taskId.toString())
    ).toPromise()) as Task;
  }
  async postTask(categoryId: number, subcategoryId: number, task: Task): Promise<Task>{
    return await this.http.post<Task>('Task', task, new HttpHeaders()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
    ).toPromise() as Task;
  }
  async checkTask(categoryId: number, subcategoryId: number, taskId: number): Promise<boolean>{
    const res = await this.http.post('Task/changeStatus', null, new HttpHeaders()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
      .set('taskId', taskId.toString())
    ).toPromise();
    return this.checkRes(res)
  }
  //won;t work
  async putTask(categoryId: number, subcategoryId: number, taskId: number, task: Task): Promise<boolean>{
    const res = await this.http.put('Task', task, new HttpHeaders()
      .set('categoryId', categoryId.toString())
      .set('subcategoryId', subcategoryId.toString())
      .set('taskId', taskId.toString())
    ).toPromise();
    return this.checkRes(res);
  }
  async deleteTask(categoryId: number, subcategoryId: number, taskId: number): Promise<boolean>{
    const res =  await this.http.delete('Task', new HttpHeaders()
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
