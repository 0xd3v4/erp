import { Injectable } from '@angular/core';
import {ApiService} from "./api-service.service";
import {Observable, of, switchMap} from "rxjs";
import {IDataSourceObserver} from "../tools/common.datasource";
import {
  IAcceptanceOperation,
  ICommonWarehouseData,
  IGoodsCategory, IGoodsCounterparty,
  IGoodsItem,
  IGoodsSubcategory,
  IGoodsUnit,
  IGoodsWarehouse, IStockOperation
} from "../interfaces/Goods";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GoodsService {

  constructor(
    private apiService: ApiService
  ) { }

  public fetchGoods(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string;
      _category?: number;
      _subcategory?: number;
      _counterparty?: number;
      _units?: number;
    }): Observable<IDataSourceObserver<IGoodsItem>> {
    return this.apiService
      .get<{ items: IGoodsItem[] }>(`api/goods/goods`, { take, skip, ...filters })
      .pipe(switchMap((x) => of({ skip, take, items:  x.items})));//x.items
  }
  public fetchCategories(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string;
    }): Observable<IDataSourceObserver<IGoodsCategory>> {
    return this.apiService
      .get<{ items: IGoodsCategory[] }>(`api/goods/categories`, { take, skip, ...filters })
      .pipe(switchMap((x) => of({ skip, take, items:  x.items})));//x.items
  }
  public fetchSubcategories(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string;
      _category?: number;
    }): Observable<IDataSourceObserver<IGoodsSubcategory>> {
    return this.apiService
      .get<{ items: IGoodsSubcategory[] }>(`api/goods/subcategories`, { take, skip, ...filters })
      .pipe(switchMap((x) => of({ skip, take, items:  x.items})));//x.items
  }
  public fetchUnits(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string;
    }): Observable<IDataSourceObserver<IGoodsUnit>> {
    return this.apiService
      .get<{ items: IGoodsUnit[] }>(`api/goods/units`, { take, skip, ...filters })
      .pipe(switchMap((x) => of({ skip, take, items:  x.items})));//x.items
  }
  public fetchCounterparties(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string;
    }): Observable<IDataSourceObserver<IGoodsCounterparty>> {
    return this.apiService
      .get<{ items: IGoodsCounterparty[] }>(`api/goods/counterparties`, { take, skip, ...filters })
      .pipe(switchMap((x) => of({ skip, take, items:  x.items})));//x.items
  }
  public fetchCounterpartyTypes(): Observable<any> {
    return this.apiService.get<any>(`api/goods/counterparty-types`)
  }

  public fetchCounterpartyById(id: string): Observable<IGoodsCounterparty> {
    return this.apiService.get<any>(`api/goods/counterparties/${id}`)
  }
  public fetchOperations(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string;
      _type?: number;
      _warehouse?: string;
      _counterparty?: string;
    }): Observable<IDataSourceObserver<IAcceptanceOperation>> {
    return this.apiService
      .get<{ items: IAcceptanceOperation[] }>(`api/goods/operations/`, { take, skip, ...filters })
      .pipe(switchMap((x) => of({ skip, take, items:  x.items})));//x.items
  }
  public fetchOperationById(id: string): Observable<IAcceptanceOperation> {
    return this.apiService.get<IAcceptanceOperation>(`api/goods/operations/${id}`)
  }
  public fetchItemsInStock(id: string, date: string): Observable<any[]> {
    return this.apiService.get<any[]>(`api/goods/search/aggregates/stock/${id}`, {date})
  }


  public createGood(data: Partial<IGoodsItem>): Observable<any> {
    return this.apiService.post<any>(`api/goods/goods`, data)
  }
  public createCategory(data: Partial<IGoodsCategory>): Observable<any> {
    return this.apiService.post<any>(`api/goods/categories`, data)
  }
  public createSubcategory(data: Partial<IGoodsSubcategory>): Observable<any> {
    return this.apiService.post<any>(`api/goods/subcategories`, data)
  }
  public createUnit(data: Partial<IGoodsUnit>): Observable<any> {
    return this.apiService.post<any>(`api/goods/units`, data)
  }
  public createWarehouse(data: Partial<IGoodsWarehouse>): Observable<any> {
    return this.apiService.post<any>(`api/goods/warehouses`, data)
  }
  public createCounterparty(data: Partial<IGoodsCounterparty>): Observable<any> {
    return this.apiService.post<any>(`api/goods/counterparties`, data)
  }
  public createOperation(data: Partial<IStockOperation>): Observable<any> {
    return this.apiService.post<any>(`api/goods/operations/`, data)
  }

  public patchGood(data: Partial<IGoodsItem>): Observable<any> {
    return this.apiService.patch<any>(`api/goods/goods/${data.id}`, data)
  }
  public patchCategory(data: Partial<IGoodsCategory>): Observable<any> {
    return this.apiService.patch<any>(`api/goods/categories/${data.id}`, data)
  }
  public patchSubcategory(data: Partial<IGoodsSubcategory>): Observable<any> {
    return this.apiService.patch<any>(`api/goods/subcategories/${data.id}`, data)
  }
  public patchUnit(data: Partial<IGoodsUnit>): Observable<any> {
    return this.apiService.patch<any>(`api/goods/units/${data.id}`, data)
  }
  public patchWarehouse(data: Partial<IGoodsWarehouse>): Observable<any> {
    return this.apiService.patch<any>(`api/goods/warehouses/${data.id}`, data)
  }
  public patchCounterparty(data: Partial<IGoodsCounterparty>): Observable<any> {
    return this.apiService.patch<any>(`api/goods/counterparties/${data.client_id}`, data)
  }
  public patchOperation(data: Partial<IStockOperation>): Observable<any> {
    return this.apiService.patch<any>(`api/goods/operations/${data.id}`, data)
  }

  public removeGood(data: Partial<IGoodsItem>): Observable<any> {
    return this.apiService.delete<any>(`api/goods/goods/${data.id}`)
  }
  public removeCategory(data: Partial<IGoodsCategory>): Observable<any> {
    return this.apiService.delete<any>(`api/goods/categories/${data.id}`)
  }
  public removeSubcategory(data: Partial<IGoodsSubcategory>): Observable<any> {
    return this.apiService.delete<any>(`api/goods/subcategories/${data.id}`)
  }
  public removeUnit(data: Partial<IGoodsUnit>): Observable<any> {
    return this.apiService.delete<any>(`api/goods/units/${data.id}`)
  }
  public removeWarehouse(data: Partial<IGoodsWarehouse>): Observable<any> {
    return this.apiService.delete<any>(`api/goods/warehouses/${data.id}`)
  }
  public removeCounterparty(data: Partial<IGoodsItem>): Observable<any> {
    return this.apiService.delete<any>(`api/goods/counterparties/${data.id}`)
  }
  public removeOperation(data: Partial<IGoodsItem>): Observable<any> {
    return this.apiService.delete<any>(`api/goods/operations/${data.id}`)
  }

  public fetchWarehouses(): Observable<ICommonWarehouseData[]> {
    return this.apiService.get<ICommonWarehouseData[]>(`api/goods/warehouses`)
  }
  public searchWarehouses(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string
    }
  ): Observable<IGoodsWarehouse[]> {
    return this.apiService.get<IGoodsWarehouse[]>(`api/goods/search/warehouses`, { take, skip, ...filters })
  }
  public searchCounterparties(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string
    }): Observable<IGoodsCounterparty[]> {
    return this.apiService
      .get<{ items: IGoodsCounterparty[] }>(`api/goods/counterparties`, { take, skip, ...filters })
      .pipe(switchMap((x) => of(x.items)));//x.items
  }
  public searchGoods(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string;
      _category?: number;
      _subcategory?: number;
      _counterparty?: number;
      _units?: number;
    }): Observable<IGoodsItem[]> {
    return this.apiService
      .get<{ items: IGoodsItem[] }>(`api/goods/goods`, { take, skip, ...filters })
      .pipe(switchMap((x) => of(x.items)));//x.items
  }

}
