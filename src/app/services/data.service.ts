import { Injectable } from '@angular/core';
import {ApiService} from "./api-service.service";
import {Observable, of, switchMap} from "rxjs";
import {IDataSourceObserver} from "../tools/common.datasource";
import {IOzonProduct} from "../interfaces/Ozon";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private apiService: ApiService
  ) { }

  public loadOzonProducts(
    skip = 0,
    take = 50,
    filters?: {
    _search?: string;
  }): Observable<IDataSourceObserver<IOzonProduct>> {
    return this.apiService
      .get<{ items: IOzonProduct[] }>(`api/ozon/products`, { take, skip, ...filters })
      .pipe(switchMap((x) => of({ skip, take, items:  x.items})));//x.items
  }
}
