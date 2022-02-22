import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
export class HttpService{
  private basePath = 'http://localhost:65070/api';
  constructor(private http: HttpClient) {
  }
  public get<T>(additionalPath: string, httpHeaders = new HttpHeaders()): Observable<T>{
    return this.http.get<T>(this.basePath + '/' + additionalPath, {headers: httpHeaders});
  }

  public post<T>(additionalPath: string, body: any, httpHeaders = new HttpHeaders()): Observable<T>{
    return this.http.post<T>(this.basePath + '/' + additionalPath, body, {headers: httpHeaders});
  }

  public put<T>(additionalPath: string, body: any, httpHeaders = new HttpHeaders()): Observable<T>{
    return this.http.put<T>(this.basePath + '/' + additionalPath, body, {headers: httpHeaders});
  }

  public delete<T>(additionalPath: string, httpHeaders = new HttpHeaders()): Observable<T>{
    return this.http.delete<T>(this.basePath + '/' + additionalPath, {headers: httpHeaders});
  }
}
