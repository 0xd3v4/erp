import {Component, OnDestroy, OnInit} from '@angular/core';
import {SystemService} from "../../../services/system.service";
import {EStockNavigation} from "../../../enums/Stock";
import {GoodsService} from "../../../services/goods.service";
import {debounceTime, of, Subject} from "rxjs";
import {EGoodsTabs} from "../../../enums/Goods";
import {takeUntil} from "rxjs/operators";
import {ICommonWarehouseData, IGoodsWarehouse} from "../../../interfaces/Goods";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-goods-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.less']
})
export class GoodsWarehousesComponent  implements OnInit, OnDestroy   {

  private _destroyed: Subject<any> = new Subject<any>();

  warehousesData: ICommonWarehouseData[] = []
  constructor(
    private systemService: SystemService,
    private goodsService: GoodsService,
    private notifications: NotificationsService
  ) {
    systemService.stockNavigationPage = EStockNavigation.Warehouses;
  }

  ngOnInit(): void {
    this.goodsService.fetchWarehouses().pipe(takeUntil(this._destroyed)).subscribe((response) => {
      console.log('GOT RE', response);
      this.warehousesData = response;
    }, (error) => {
      console.log('ERR', error)
    })
  }
  ngOnDestroy(): void {
    this._destroyed.next('');
    this._destroyed.complete();
  }

  createWarehouse(commonWarehouse: ICommonWarehouseData) {
    if (window.innerWidth > 440) {
      this.notifications
        .showCreateGoodsWarehouseDialog({ warehouse: { common_warehouse_id: commonWarehouse.id } }).afterClosed()
        .subscribe((data) => {
          if (data) {
            commonWarehouse.goodsWarehouses.push(data)
            this.notifications.showSnack('Склад успешно создан')
          }
        })
    } else {
      this.notifications
        .showCreateGoodsWarehouseSheet({ warehouse: { common_warehouse_id: commonWarehouse.id } }).afterDismissed()
        .subscribe((data) => {
          if (data) {
            commonWarehouse.goodsWarehouses.push(data)
            this.notifications.showSnack('Склад успешно создан')
          }
        })
    }
  }

  patchWarehouse(warehouse: IGoodsWarehouse, commonWarehouse: ICommonWarehouseData) {
    if (window.innerWidth > 440) {
      this.notifications.showCreateGoodsWarehouseDialog({ warehouse }).afterClosed()
        .subscribe((data) => {
          if (data) {
            if (data.response) {
              commonWarehouse.goodsWarehouses.splice(commonWarehouse.goodsWarehouses.indexOf(warehouse), commonWarehouse.goodsWarehouses.indexOf(warehouse) + 1);
              this.notifications.showSnack('Склад успешно удалён');
            } else {
              warehouse.name = data.name
            }
          }
        })
    } else {
      this.notifications.showCreateGoodsWarehouseSheet({ warehouse }).afterDismissed()
        .subscribe((data) => {
          if (data) {
            if (data.response) {
              commonWarehouse.goodsWarehouses.splice(commonWarehouse.goodsWarehouses.indexOf(warehouse), commonWarehouse.goodsWarehouses.indexOf(warehouse) + 1);
              this.notifications.showSnack('Склад успешно удалён');
            } else {
              warehouse.name = data.name
            }
          }
        })
    }

  }
}
