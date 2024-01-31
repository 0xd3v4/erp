import { Pipe, PipeTransform } from '@angular/core';
import {EStockOperations} from "../enums/Stock";

@Pipe({
  name: 'goodsOperationsEntity'
})
export class GoodsOperationsEntityPipe implements PipeTransform {

  transform(value: EStockOperations): string {
    switch (value) {
      case EStockOperations.Acceptance: return 'Приемки';
      case EStockOperations.Capitalization: return 'Оприходования';
      case EStockOperations.Movement: return 'Перемещения';
      case EStockOperations.WriteOff: return 'Списания';
    }
  }

}
