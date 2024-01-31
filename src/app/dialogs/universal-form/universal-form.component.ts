import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GoodsService} from "../../services/goods.service";
import {combineLatest, debounceTime, Observable, of} from "rxjs";
import {IGoodsCategory, IGoodsSubcategory, IGoodsUnit} from "../../interfaces/Goods";
import {FormControl} from "@angular/forms";
import {EGoodsTabs} from "../../enums/Goods";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-universal-form',
  templateUrl: './universal-form.component.html',
  styleUrls: ['./universal-form.component.less']
})
export class UniversalFormDialogComponent implements OnInit{

  // @ts-ignore
  sub$: Subscription;

  categoriesData: Observable<IGoodsCategory[]> = of([]);
  subcategoriesData: Observable<IGoodsSubcategory[]> = of([]);
  unitsData: Observable<IGoodsUnit[]> = of([]);

  categoryForm: FormControl = new FormControl(null);
  subcategoryForm: FormControl = new FormControl(null);
  unitForm: FormControl = new FormControl(null);
  nameForm: FormControl = new FormControl(null);
  skuForm: FormControl = new FormControl(null);
  balanceForm: FormControl = new FormControl(null);
  commentForm: FormControl = new FormControl(null);
  hasSubCategories = false;
  hasUnits = false;
  hasCategories = false;
  nameHeader = 'Название товара';
  dialogHeader = 'Новый товар';
  saveButtonText = 'Сохранить';

  constructor(
    public dialogRef: MatDialogRef<UniversalFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: { entityType: EGoodsTabs, item?: any } },
    private goodsService: GoodsService,
    private notifications: NotificationsService
  ) {
    this.sub$ = combineLatest([
      this.goodsService.fetchCategories(0, 100, ),
      this.goodsService.fetchSubcategories(0, 100, ),
      this.goodsService.fetchUnits(0, 100, )
    ])
    switch (data.data.entityType) {
      case EGoodsTabs.Units:
        this.nameHeader = 'Название единицы измерения';
        this.dialogHeader = 'Новая единица измерения';
        this.hasCategories = false;
        this.hasSubCategories = false;
        break;
      case EGoodsTabs.Categories:
        this.nameHeader = 'Название категории';
        this.dialogHeader = 'Новая категория';
        this.hasUnits = false;
        break;
      case EGoodsTabs.Subcategories:
        this.nameHeader = 'Название подкатегории'
        this.dialogHeader = 'Новая подкатегория';
        this.hasSubCategories = false;
        this.hasCategories = true;
        break;
      case EGoodsTabs.Goods:
        this.nameHeader = 'Название товара'
        this.dialogHeader = 'Новый товар';
        this.hasCategories = true;
        this.hasUnits = true;
        break;
    }
    if (data.data.item && data.data.item.name) {
      this.dialogHeader = 'Редактирование';
      this.saveButtonText = 'Обновить';
      this.nameForm.patchValue(data.data.item.name);
      if (data.data.item.category || data.data.item.category_id) {
        this.hasCategories = true;
        this.categoryForm.patchValue( { id: data.data.item.category || data.data.item.category_id, name: data.data.item.category_name })
      }
      if (data.data.item.subcategory) {
        this.hasSubCategories = true;
        this.subcategoryForm.patchValue( { id: data.data.item.subcategory, name: data.data.item.subcategory_name })
      }
      if (data.data.item.units) {
        this.hasUnits = true;
        this.unitForm.patchValue( { id: data.data.item.units, name: data.data.item.units_name })
      }
      if (data.data.item.comment) {
        this.commentForm.patchValue(data.data.item.comment)
      }
      // if (data.data.item.sku) {
      //   this.skuForm.patchValue(data.data.item.sku)
      // }
      if (data.data.item.min_balance) {
        this.balanceForm.patchValue(data.data.item.min_balance)
      }
      console.log('UNITS', this.unitForm.value)
    }
    this.categoryForm.valueChanges.pipe(debounceTime(350)).subscribe((value) => {
      if (value && typeof value === 'string' && value.trim().length > 2) {
        this.goodsService.fetchCategories(0, 100, { _search: value.toLowerCase() }).subscribe((response) => {
          this.categoriesData = of(response.items)
        })
      } else {
        if (typeof value === 'string' && value.length == 0) {
          this.goodsService.fetchCategories(0, 100).subscribe((response) => {
            this.categoriesData = of(response.items)
          })
        }
        if (value && typeof value === 'object' && this.data.data.entityType === EGoodsTabs.Goods) {
          this.goodsService.fetchSubcategories(0, 100, { _category: value.id }).subscribe((response) => {
            this.subcategoriesData = of(response.items)
            this.hasSubCategories = response.items.length > 0;
          })
        }
      }
    })
  }

  ngOnInit(): void {
        // @ts-ignore
    this.sub$.subscribe(([categories, subcategories, units]) => {
      this.categoriesData = of(categories.items)
      this.subcategoriesData = of(subcategories.items)
      this.unitsData = of(units.items)
    })
  }

  displayFn(field: any): string {
    return field && field.name
      ? field.name
      : field && field.id
        ? field.id
        : field && field.header
          ? field.header
          : '';
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  remove() {
    this.notifications
      .showConfirmWindow(
        'Удаление позиции',
        'Вы действительно хотите удалить данную запись?',
        ['no', 'remove'])
      .afterClosed().subscribe((result) => {
        if (result === 'remove') {
          this.selectRemove(this.data.data.item).subscribe((response) => {
            if (response) {
              this.dialogRef.close({response, data: this.data.data.item});
            } else {
              this.notifications.showSnack('Не удалось удалить запись')
            }
          }, error => {
            this.notifications.showSnack('Не удалось удалить запись: ' + error.message)
          })
        }
      })
  }
  change() {
    const data: any = {
      name: this.nameForm.value,
    }
    if (this.data.data.entityType === EGoodsTabs.Subcategories) {
      data.category = this.categoryForm.value.id;
    }
    if (this.data.data.entityType === EGoodsTabs.Goods) {
      data.category = this.categoryForm.value.id;
      data.units = this.unitForm.value.id;
      // data.sku = this.skuForm.value;
      data.min_balance = this.balanceForm.value;
      data.comment = this.commentForm.value;
      if (this.subcategoryForm.value && typeof this.subcategoryForm.value === 'object') {
        data.subcategory = this.subcategoryForm.value.id;
      }
    }
    if (this.data.data.item) {
      data.id = this.data.data.item.id;
    }
    this.selectRequest(data).subscribe((response) => {
      console.log('GOT RESPONSE', response)
      if (response) {
        this.dialogRef.close({response, data});
      } else {
        this.notifications.showSnack('Не удалось отредактировать запись')
      }
    }, error => {
      console.log('ERR', error)
      this.notifications.showSnack('Не удалось отредактировать запись: ', error.message)
    })
  }
  private selectRequest(data: any): Observable<any> {
    switch (this.data.data.entityType) {
      case EGoodsTabs.Goods:
        return (data.id ? this.goodsService.patchGood(data) : this.goodsService.createGood(data))
      case EGoodsTabs.Categories:
        return (data.id ? this.goodsService.patchCategory(data) : this.goodsService.createCategory(data))
      case EGoodsTabs.Subcategories:
        return (data.id ? this.goodsService.patchSubcategory(data) : this.goodsService.createSubcategory(data))
      case EGoodsTabs.Units:
        return (data.id ? this.goodsService.patchUnit(data) : this.goodsService.createUnit(data))
      default:
        return of(null)
    }
  }
  private selectRemove(data: any): Observable<any> {
    switch (this.data.data.entityType) {
      case EGoodsTabs.Goods:
        return this.goodsService.removeGood(data)
      case EGoodsTabs.Categories:
        return this.goodsService.removeCategory(data)
      case EGoodsTabs.Subcategories:
        return this.goodsService.removeSubcategory(data)
      case EGoodsTabs.Units:
        return this.goodsService.removeUnit(data)
      default:
        return of(null)
    }
  }
}
