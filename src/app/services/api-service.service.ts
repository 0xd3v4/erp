import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {Observable, tap, throwError as _throw} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {SystemService} from "./system.service";

interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  observe?: 'body' | 'response';
  responseType?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  config = {
    apiPrefix: ''
  }

  constructor(public http: HttpClient, private _systemService: SystemService) {}
  public get<T>(requestUrl: string, payload?: Record<string, any>, options?: HttpOptions): Observable<T> {
    const apiPrefix = this.config.apiPrefix;
    if (payload) {
      Object.keys(payload).forEach((key) => {
        if (payload[key] && typeof payload[key] === 'object' && !Array.isArray(payload[key])) {
          payload[key] = JSON.stringify(payload[key]);
        }
        // if (payload[key] && Array.isArray(payload[key])) {
        //   payload[key] = payload[key].join();
        // }
      });
    }
    const queryParams = new URLSearchParams(payload).toString();
    this._systemService.loaderStatus$.next(true);
    return this.http
      .get<T>(`${apiPrefix}/${requestUrl}` + (queryParams ? `?${queryParams}` : ''), this.prepareHttpOptions(options))
      .pipe(
        tap(() => { this._systemService.loaderStatus$.next(false); }),
        catchError(this.throwNormalizedError)
      );
  }

  public put<T>(requestUrl: string, payload: any, options?: HttpOptions): Observable<T | null> {
    const apiPrefix = this.config.apiPrefix;
    this._systemService.loaderStatus$.next(true);
    return this.http
      .put<T>(`${apiPrefix}/${requestUrl}`, payload, this.prepareHttpOptions(options))
      .pipe(
        tap(() => { this._systemService.loaderStatus$.next(false); }),
        catchError(this.throwNormalizedError)
      );
  }

  public patch<T>(requestUrl: string, payload: any, options?: HttpOptions): Observable<T | null> {
    const apiPrefix = this.config.apiPrefix;
    this._systemService.loaderStatus$.next(true);
    return this.http
      .patch<T>(`${apiPrefix}/${requestUrl}`, payload, this.prepareHttpOptions(options))
      .pipe(
        tap(() => { this._systemService.loaderStatus$.next(false); }),
        catchError(this.throwNormalizedError));
  }

  public post<T>(requestUrl: string, payload: any, options?: HttpOptions): Observable<T | null> {
    const apiPrefix = this.config.apiPrefix;
    this._systemService.loaderStatus$.next(true);
    return this.http
      .post<T>(`${apiPrefix}/${requestUrl}`, payload, this.prepareHttpOptions(options))
      .pipe(
        tap(() => { this._systemService.loaderStatus$.next(false); }),
        catchError(this.throwNormalizedError));
  }

  public delete<T>(requestUrl: string, options?: HttpOptions): Observable<T | null> {
    const apiPrefix = this.config.apiPrefix;
    this._systemService.loaderStatus$.next(true);
    return this.http
      .delete<T>(`${apiPrefix}/${requestUrl}`, this.prepareHttpOptions(options))
      .pipe(
        tap(() => { this._systemService.loaderStatus$.next(false); }),
        catchError(this.throwNormalizedError));
  }

  public prepareHttpOptions(options: HttpOptions = {}): {
    headers?: HttpHeaders;
    params?: HttpParams;
    observe?: any;
    responseType?: any;
  } {
    const httpOptions: {
      headers?: HttpHeaders;
      params?: HttpParams;
      observe?: any;
      responseType?: any;
    } = {};

    if (options.params) {
      httpOptions.params = Object.keys(options.params).reduce((params, pKey) => {
        // @ts-ignore
        return params.set(pKey, options.params[pKey]);
      }, new HttpParams());
    }

    if (options.headers) {
      httpOptions.headers = Object.keys(options.headers).reduce((headers, hKey) => {
        // @ts-ignore
        return headers.set(hKey, options.headers[hKey]);
      }, new HttpHeaders());
    }

    if (options.observe) {
      httpOptions.observe = options.observe;
    }

    if (options.responseType) {
      httpOptions.responseType = options.responseType;
    }

    return httpOptions;
  }
  public normalizeError = (error: any) => {
    return {
      statusCode: error.status !== undefined ? error.status : 500,
      message: error.message ? error.message : error.status ? error.statusText : 'Server error',
      description: error.error ? error.error : '',
    };
  };

  public throwNormalizedError = (response: HttpErrorResponse) => {
    this._systemService.loaderStatus$.next(false)
    return _throw(this.normalizeError(response));
  };
}
