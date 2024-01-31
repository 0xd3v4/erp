import { Injectable } from '@angular/core';
import {ApiService} from "./api-service.service";
import {Observable, of, switchMap} from "rxjs";
import {IDataSourceObserver} from "../tools/common.datasource";
import {IOzonProduct} from "../interfaces/Ozon";
import {ISupply} from "../interfaces/Supply";

@Injectable({
  providedIn: 'root'
})
export class SupplyService {

  constructor(
    private apiService: ApiService
  ) { }

  public loadItems(
    skip = 0,
    take = 50,
    filters?: {
      _search?: string;
      _type?: number;
    }): Observable<IDataSourceObserver<any>> {
    return this.apiService
      .get<{ items: any[] }>(`api/supply`, { take, skip, ...filters })
      .pipe(switchMap((x) => of({ skip, take, items:  x.items})));//x.items
  }

  public loadItemById(supplyId: string): Observable<ISupply> {
    return this.apiService.get<ISupply>(`api/supply/${supplyId}`)
  }
  public removePositionFromItem(supplyId: string, productId: string): Observable<any> {
    return this.apiService.delete<any>(`api/supply/${supplyId}/${productId}`)
  }
  public returnPositionToDelivery(supplyId: string, postingNumber: string): Observable<any> {
    return this.apiService.post<any>(`api/supply/${supplyId}/delivery`, { postingNumber })
  }
  public printAct(supplyId: string): Observable<any> {
    return this.apiService.get<any>(`api/supply/${supplyId}/print/act`)
  }
  public printQr(supplyId: string): Observable<any> {
    return this.apiService.get<any>(`api/supply/${supplyId}/print/qr`)
  }
  public createActRequest(supplyId: string, payload: { date: string }): Observable<any> {
    return this.apiService.patch<any>(`api/supply/${supplyId}`, payload)
  }
  public closeManually(supplyId: string): Observable<boolean> {
    return this.apiService.get<boolean>(`api/supply/${supplyId}/close`)
  }

  public searchOzonPostings(supplyId: string, search: string): Observable<any[]> {
    return this.apiService.get<any[]>(`api/supply/${supplyId}/search`, { search })
  }
  public addItemToOzonSupply(supplyId: string, mspId: string): Observable<boolean> {
    return this.apiService.get<any>(`api/supply/${supplyId}/${mspId}`)
  }
  public removeItemFromOzonSupply(supplyId: string, mspId: string): Observable<boolean> {
    return this.apiService.delete<any>(`api/supply/${supplyId}/${mspId}`)
  }
}
