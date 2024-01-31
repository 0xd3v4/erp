import { Injectable } from '@angular/core';
import {Observable, of, switchMap} from "rxjs";
import {IDataSourceObserver} from "../tools/common.datasource";
import {IOzonProduct} from "../interfaces/Ozon";
import {ApiService} from "./api-service.service";

@Injectable({
  providedIn: 'root'
})
export class DdsService {

  constructor(
    private apiService: ApiService
  ) { }

  public fetchWallets(): Observable<any> {
    return this.apiService
      .get<any>(`api/dds/getWallets`)
  }
  public fetchPaymentCategories(): Observable<any> {
    return this.apiService
      .get<any>(`api/finance/getPaymentCategories`)
  }
  public fetchCounterpartyPayments(data: { id: string }): Observable<any> {
    return this.apiService
      .get<any>(`api/dds/getPaymentsByCounterpartyId`, data)
  }
  public createIncome(data: any): Observable<any> {
    return this.apiService
      .post<any>(`api/dds/newIncome`, data)
  }
  public createOutcome(data: any): Observable<any> {
    return this.apiService
      .post<any>(`api/dds/newExpense`, data)
  }
  public createTransfer(data: any): Observable<any> {
    return this.apiService
      .post<any>(`api/dds/newTransfer`, data)
  }
  public linkPaymentToStockOperation(stockId: string, paymentId: string): Observable<any> {
    return this.apiService
      .get<any>(`api/dds/linkToStock`, {stockId, paymentId})
  }
}
