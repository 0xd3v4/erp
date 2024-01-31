import {Component, OnDestroy, OnInit} from '@angular/core';
import {EGoodsTabs} from "../../../enums/Goods";
import {GoodsService} from "../../../services/goods.service";
import {BehaviorSubject, debounceTime, Observable, of, Subject} from "rxjs";
import {CommonDataSource, IDataSourceFetchRequest, IDataSourceObserver} from "../../../tools/common.datasource";
import {IGoodsCategory, IGoodsItem, IGoodsSubcategory, IGoodsUnit} from "../../../interfaces/Goods";
import {NotificationsService} from "../../../services/notifications.service";
import {FormControl} from "@angular/forms";
import {SystemService} from "../../../services/system.service";
import {EStockNavigation} from "../../../enums/Stock";

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.less']
})
export class GoodsComponent  implements OnInit, OnDestroy  {

  currentTab: EGoodsTabs = EGoodsTabs.Goods;
  searchControl: FormControl = new FormControl(null);
  categoryForm: FormControl = new FormControl(null);
  subcategoryForm: FormControl = new FormControl(null);
  unitForm: FormControl = new FormControl(null);

  pageSize = 50;

  private _dataObserver = new BehaviorSubject<IDataSourceObserver<IGoodsItem>>({
    take: 0,
    skip: 0,
    items: [],
  });
  private _categoryObserver = new BehaviorSubject<IDataSourceObserver<IGoodsCategory>>({
    take: 0,
    skip: 0,
    items: [],
  });
  private _subcategoryObserver = new BehaviorSubject<IDataSourceObserver<IGoodsSubcategory>>({
    take: 0,
    skip: 0,
    items: [],
  });
  private _unitsObserver = new BehaviorSubject<IDataSourceObserver<IGoodsUnit>>({
    take: 0,
    skip: 0,
    items: [],
  });
  private _destroyed: Subject<any> = new Subject<any>();
  public filters: any = {
    _search: ''
  }
  public mobileFiltersView = false;
  public mobileSearchView = false;

  entityDataSource = new CommonDataSource<IGoodsItem>(this._dataObserver, this.fetchDataRequest.bind(this), {
    pageSize: this.pageSize,
  });
  entityCategorySource = new CommonDataSource<IGoodsCategory>(this._categoryObserver, this.fetchCategoryRequest.bind(this), {
    pageSize: this.pageSize,
  });
  entitySubcategorySource = new CommonDataSource<IGoodsSubcategory>(this._subcategoryObserver, this.fetchSubcategoryRequest.bind(this), {
    pageSize: this.pageSize,
  });
  entityUnitSource = new CommonDataSource<IGoodsUnit>(this._unitsObserver, this.fetchUnitRequest.bind(this), {
    pageSize: this.pageSize,
  });

  categoriesData: Observable<IGoodsCategory[]> = of([]);
  subcategoriesData: Observable<IGoodsSubcategory[]> = of([]);
  unitsData: Observable<IGoodsUnit[]> = of([]);


  constructor(
    private goodsService: GoodsService,
    private notifications: NotificationsService,
    private systemService: SystemService
  ) {
    systemService.stockNavigationPage = EStockNavigation.Goods;
  }
  ngOnInit(): void {
    this.fetchDataRequest({ skip: 0, take: this.pageSize });
    // this.fetchCategoryRequest({ skip: 0, take: this.pageSize });
    // this.fetchSubcategoryRequest({ skip: 0, take: this.pageSize });
    // this.fetchUnitRequest({ skip: 0, take: this.pageSize });

    this.initFilters();

    this.searchControl.valueChanges.pipe(debounceTime(350)).subscribe((value) => {
      if (value && value.trim().length > 2) {
        this.filters._search = value.toLowerCase()
      } else {
        delete this.filters._search;
      }
      switch (this.currentTab) {
        case EGoodsTabs.Goods:
          this.fetchDataRequest({ skip: 0, take: this.pageSize });
          break;
        case EGoodsTabs.Categories:
          this.fetchCategoryRequest({ skip: 0, take: this.pageSize });
          break;
        case EGoodsTabs.Subcategories:
          this.fetchSubcategoryRequest({ skip: 0, take: this.pageSize });
          break;
        case EGoodsTabs.Units:
          this.fetchUnitRequest({ skip: 0, take: this.pageSize })
      }
    });
    this.categoryForm.valueChanges.pipe(debounceTime(350)).subscribe((value) => {
      if (value === '') {
        delete this.filters._category;
        this.fetchDataRequest({ skip: 0, take: this.pageSize })
        this.goodsService.fetchCategories(0, 100).subscribe((x) => {
          this.categoriesData = of(x.items);
        })
      } else {
        if (typeof value === 'object') {
          console.log('FILTERED')
          this.filters._category = value.id;
          this.fetchDataRequest({ skip: 0, take: this.pageSize })
        } else {
          if (value && value.trim().length > 3) {
            this.goodsService.fetchCategories(0, 100, { _search: value }).subscribe((x) => {
              this.categoriesData = of(x.items);
            })
          }
        }
      }
    })
    this.subcategoryForm.valueChanges.pipe(debounceTime(350)).subscribe((value) => {
      if (value === '') {
        delete this.filters._subcategory;
        this.fetchDataRequest({ skip: 0, take: this.pageSize })
      } else {
        if (typeof value === 'object') {
          this.filters._subcategory = value.id;
          this.fetchDataRequest({ skip: 0, take: this.pageSize })
        } else {
          if (value && value.trim().length > 3) {
            this.goodsService.fetchSubcategories(0, 100, { _search: value }).subscribe((x) => {
              this.subcategoriesData = of(x.items);
            })
          }
        }
      }
    })
    this.unitForm.valueChanges.pipe(debounceTime(350)).subscribe((value) => {
      if (value === '') {
        delete this.filters._units;
        this.fetchDataRequest({ skip: 0, take: this.pageSize })
      } else {
        if (typeof value === 'object') {
          this.filters._units = value.id;
          this.fetchDataRequest({ skip: 0, take: this.pageSize })
        } else {
          if (value && value.trim().length > 3) {
            this.goodsService.fetchSubcategories(0, 100, { _search: value }).subscribe((x) => {
              this.unitsData = of(x.items);
            })
          }
        }
      }
    })
  }
  ngOnDestroy(): void {
    this._destroyed.next('');
    this._destroyed.complete();
  }

  createItem() {
    const data = {
      entityType: this.currentTab,
    }
    this.notifications.showUniversalFormDialog(data).afterClosed().subscribe((result) => {
      if (result) {
        this.notifications.showSnack('Новая запись успешно создана');
        this.refreshData();
      }
    })
  }

  switchTab(tab: string) {
    switch (tab) {
      case EGoodsTabs.Goods:
        // this.fetchDataRequest({ skip: 0, take: this.pageSize })
        break;
      case EGoodsTabs.Categories:
        // if (this.currentTab != EGoodsTabs.Categories) {
        //   this.fetchCategoryRequest({ skip: 0, take: this.pageSize });
        // }
        break;
    }
    window.dispatchEvent(new Event('resize'));
    this.currentTab = tab as EGoodsTabs;
    this.searchControl.patchValue(null)
  }
  fetchDataRequest({ take, skip }: IDataSourceFetchRequest) {
    this.goodsService.fetchGoods(skip, take, this.filters).subscribe((x) => {
      this._dataObserver.next(x);
    });
  }
  fetchCategoryRequest({ take, skip }: IDataSourceFetchRequest) {
    this.goodsService.fetchCategories(skip, take, this.filters).subscribe((x) => {
      this._categoryObserver.next(x);
    });
  }
  fetchSubcategoryRequest({ take, skip }: IDataSourceFetchRequest) {
    this.goodsService.fetchSubcategories(skip, take, this.filters).subscribe((x) => {
      this._subcategoryObserver.next(x);
    });
  }
  fetchUnitRequest({ take, skip }: IDataSourceFetchRequest) {
    this.goodsService.fetchUnits(skip, take, this.filters).subscribe((x) => {
      this._unitsObserver.next(x);
    });
  }

  editItem(item: any) {
    const data = {
      entityType: this.currentTab,
      item
    }

    this.getDialogHandler(data).subscribe((result) => {
      if (result) {
        this.notifications.showSnack('Запись успешно отредактирована');
        this.refreshData();
      }
    })
  }

  createItemMobile() {
    const data = {
      entityType: this.currentTab,
    }
    this.notifications.showUniversalFormSheet(data).afterDismissed().subscribe((result) => {
      if (result) {
        this.notifications.showSnack('Новая запись успешно создана');
        this.refreshData();
      }
    })
  }
  handleClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
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
  private getDialogHandler(data: any): Observable<any> {
    return window.innerWidth > 414
      ? this.notifications.showUniversalFormDialog(data).afterClosed()
      : this.notifications.showUniversalFormSheet(data).afterDismissed()
  }
  private refreshData() {
    switch (this.currentTab) {
      case EGoodsTabs.Goods:
        this.fetchDataRequest({ skip: 0, take: this.pageSize });
        break;
      case EGoodsTabs.Categories:
        this.fetchCategoryRequest({ skip: 0, take: this.pageSize });
        break;
      case EGoodsTabs.Subcategories:
        this.fetchSubcategoryRequest({ skip: 0, take: this.pageSize });
        break;
      case EGoodsTabs.Units:
        this.fetchUnitRequest({ skip: 0, take: this.pageSize });
        break;
    }
    window.dispatchEvent(new Event('resize'));
  }
  private initFilters() {
    this.goodsService.fetchCategories(0, 100).subscribe((x) => {
      this.categoriesData = of(x.items);
    })
    this.goodsService.fetchSubcategories(0, 100).subscribe((x) => {
      this.subcategoriesData = of(x.items);
    })
    this.goodsService.fetchUnits(0, 100).subscribe((x) => {
      this.unitsData = of(x.items);
    })
  }

  clearFilters() {
    delete this.filters._category;
    delete this.filters._subcategory;
    delete this.filters._units;

    this.categoryForm.patchValue(null);
    this.subcategoryForm.patchValue(null);
    this.unitForm.patchValue(null);

    this.fetchDataRequest({skip: 0, take: this.pageSize});

  }
}
