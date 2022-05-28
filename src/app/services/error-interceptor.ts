import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthService} from "./authServices";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401].includes(err.status) && this.authService.isAuthorized()) {
        // auto logout if 401 or 403 response returned from api
        this.authService.refreshToken()
          .subscribe(()=> console.log('token refreshed'),
              err => this.authService.logout());
      }

      return throwError(err.error);
    }))
  }
}
