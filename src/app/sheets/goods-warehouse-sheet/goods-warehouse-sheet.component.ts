import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {EGoodsTabs} from "../../enums/Goods";
import {GoodsService} from "../../services/goods.service";
import {NotificationsService} from "../../services/notifications.service";
import {FormControl} from "@angular/forms";
import {IGoodsWarehouse} from "../../interfaces/Goods";

@Component({
  selector: 'app-goods-warehouse-sheet',
  templateUrl: './goods-warehouse-sheet.component.html',
  styleUrls: ['./goods-warehouse-sheet.component.less']
})
export class GoodsWarehouseSheetComponent {

  nameHeader = 'Название склада';
  dialogHeader = 'Новый склад';
  saveButtonText = 'Сохранить';

  nameForm: FormControl = new FormControl(null);

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { warehouse: Partial<IGoodsWarehouse> },
    private bottomSheetRef: MatBottomSheetRef<GoodsWarehouseSheetComponent>,
    private goodsService: GoodsService,
    private notifications: NotificationsService
  ) {
    if (data.warehouse.id) {
      this.dialogHeader = 'Редактирование';
      this.saveButtonText = 'Обновить';
      this.nameForm.patchValue(data.warehouse.name);
    } else {
      this.saveButtonText = 'Сохранить';
    }
  }

  change() {
    const data: Partial<IGoodsWarehouse> = {
      common_warehouse_id: this.data.warehouse.common_warehouse_id,
      name: this.nameForm.value
    }
    if (this.data.warehouse.id) {
      data.id = this.data.warehouse.id;
      data.common_warehouse_name = this.data.warehouse.common_warehouse_name;
    } else {
      this.goodsService.createWarehouse(data).subscribe((r) => {
        if (r && r.id) {
          data.id = r.id;
          this.bottomSheetRef.dismiss(data);
        }
      })
    }
  }

  remove() {
    this.notifications
      .showConfirmWindow(
        'Удаление позиции',
        'Вы действительно хотите удалить данную запись?',
        ['no', 'remove'])
      .afterClosed().subscribe((result) => {
      if (result === 'remove') {
        this.goodsService.removeWarehouse(this.data.warehouse).subscribe((response) => {
          if (response) {
            this.bottomSheetRef.dismiss({response, data: this.data.warehouse});
          } else {
            this.notifications.showSnack('Не удалось удалить запись')
          }
        }, error => {
          this.notifications.showSnack('Не удалось удалить запись: ' + error.message)
        })
      }
    })
  }

  closeDialog() {
    this.bottomSheetRef.dismiss(null);
  }
}
