import { Injectable } from '@angular/core';
import {ApiService} from "./api-service.service";
import {Observable, of, switchMap} from "rxjs";
import {IDataSourceObserver} from "../tools/common.datasource";

@Injectable({
  providedIn: 'root'
})
export class ManufactureService {

  constructor(
    private apiService: ApiService
  ) { }

  public loadItems(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string;
      _type?: number;
      _models?: string[],
      _colors?: string[],
      _status?: string[],
      _warehouses?: string[]
    }): Observable<IDataSourceObserver<any>> {
    return this.apiService
      .get<{ items: any[] }>(`api/manufacture/products`, { take, skip, ...filters })
      .pipe(switchMap((x) => of({ skip, take, items:  x.items})));//x.items
  }
  public printSingleItem(itemId: string): Observable<any> {
    return this.apiService.get<any>(`api/manufacture/products/print/${itemId}`)
  }
  public printStickerPool(items: string[]): Observable<any> {
    return this.apiService.post<any>(`api/manufacture/products/print`, items)
  }
}
