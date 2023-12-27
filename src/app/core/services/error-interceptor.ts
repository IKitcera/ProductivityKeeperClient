import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthService} from "./authServices";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log(err)
      // if ([401].includes(err.status) && this.authService.isAuthorized()) {
      //   // auto logout if 401 or 403 response returned from api
      //   this.authService.refreshToken().subscribe();
      //   return EMPTY;
      // }

      this.toastr.error(err.error?.message ?? 'Unknown error');
      return throwError(err.error);
    }))
  }
}
