import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class HttpService{

  private basePath = 'http://localhost:65070';
  constructor(private http: HttpClient) {
  }
  public get<T>(additionalPath: string, httpOp = new HttpParams()): Observable<T>{
    return this.http.get<T>(this.basePath + '/' + additionalPath, {params:httpOp});
  }

  public post<T>(additionalPath: string, body: any, httpOp = new HttpParams()): Observable<T>{
    return this.http.post<T>(this.basePath + '/' + additionalPath, body, {params:httpOp});
  }

  public put<T>(additionalPath: string, body: any, httpOp = new HttpParams()): Observable<T>{
    return this.http.put<T>(this.basePath + '/' + additionalPath, body, {params:httpOp});
  }

  public delete<T>(additionalPath: string, httpOp = new HttpParams()): Observable<T>{
    return this.http.delete<T>(this.basePath + '/' + additionalPath, {params:httpOp});
  }
}
