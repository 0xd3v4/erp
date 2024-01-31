import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          authorization: `Bearer ${this.auth.getToken()}`,
        },
      });
    } else {
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleAuthError(error)),
      tap((r) => {
        if (typeof r === 'object' && r.hasOwnProperty('headers')) {
          // @ts-ignore
          const tk = r.headers.get('x-auth-token');

          if (tk) {
            if (!this.auth.isAuthenticated()) {
              this.auth.setToken(tk);
            } else {
              this.auth.setToken(tk);
            }
          }
        }
      })
    );
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    return throwError(error);
  }
}
