import { Pipe, PipeTransform } from '@angular/core';
import {EGoodsTabs} from "../enums/Goods";

@Pipe({
  name: 'goodsEntity'
})
export class GoodsEntityPipe implements PipeTransform {

  transform(value: EGoodsTabs): string {
    switch (value) {
      case EGoodsTabs.Units: return 'Единицы измерения';
      case EGoodsTabs.Subcategories: return 'Подкатегории';
      case EGoodsTabs.Categories: return 'Категории';
      case EGoodsTabs.Goods: return 'Товары';
    }
  }

}
