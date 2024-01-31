import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GoodsService} from "../../services/goods.service";
import {NotificationsService} from "../../services/notifications.service";
import {IGoodsWarehouse} from "../../interfaces/Goods";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-goods-warehouse-dialog',
  templateUrl: './goods-warehouse-dialog.component.html',
  styleUrls: ['./goods-warehouse-dialog.component.less']
})
export class GoodsWarehouseDialogComponent {

  nameHeader = 'Название склада';
  dialogHeader = 'Новый склад';
  saveButtonText = 'Сохранить';

  nameForm: FormControl = new FormControl(null);

  constructor(
    public dialogRef: MatDialogRef<GoodsWarehouseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { warehouse: Partial<IGoodsWarehouse> },
    private goodsService: GoodsService,
    private notifications: NotificationsService
  ) {
    this.saveButtonText = data.warehouse.id ? 'Обновить' : '';
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
      this.goodsService.patchWarehouse(data).subscribe((r) => {
        if (r && r.item) {
          this.dialogRef.close(data);
        }
      })
    } else {
      this.goodsService.createWarehouse(data).subscribe((r) => {
        if (r && r.id) {
          data.id = r.id;
          this.dialogRef.close(data);
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
            this.dialogRef.close({response, data: this.data.warehouse});
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
    this.dialogRef.close(null);
  }
}
