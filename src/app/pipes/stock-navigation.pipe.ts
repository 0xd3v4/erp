import {Pipe, PipeTransform} from '@angular/core';
import {EStockNavigation} from "../enums/Stock";

@Pipe({
  name: 'stockNavigation',
  pure: false
})
export class StockNavigationPipe implements PipeTransform {

  transform(value: EStockNavigation): string {
    switch (value) {
      case EStockNavigation.Goods: return 'Товары и категории';
      case EStockNavigation.Stock: return 'Операции со складами';
      case EStockNavigation.Warehouses: return 'Список складов';
      case EStockNavigation.Tasks: return 'Задачи и типы';
      case EStockNavigation.TechCard: return 'Техкарты';
      case EStockNavigation.Counterparties: return 'Контрагенты'
    }
  }

}
