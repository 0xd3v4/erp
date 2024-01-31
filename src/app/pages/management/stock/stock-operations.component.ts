import {Component, OnInit} from '@angular/core';
import {SystemService} from "../../../services/system.service";
import {EStockNavigation, EStockOperations} from "../../../enums/Stock";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonDataSource, IDataSourceFetchRequest, IDataSourceObserver} from "../../../tools/common.datasource";
import {
  IAcceptanceOperation, ICapitalizationOperation,
  IGoodsCategory,
  IGoodsItem,
  IGoodsSubcategory,
  IGoodsUnit, IMovementOperation, IStockOperation, IWriteOffOperation
} from "../../../interfaces/Goods";
import {BehaviorSubject, Subject} from "rxjs";
import {GoodsService} from "../../../services/goods.service";

@Component({
  selector: 'app-stock-operations',
  templateUrl: './stock-operations.component.html',
  styleUrls: ['./stock-operations.component.less']
})
export class StockOperationsComponent implements OnInit {

  currentTab: EStockOperations = EStockOperations.Acceptance;

  searchControl: FormControl = new FormControl(null);
  pageSize = 50;
  public filters: any = {
    _search: '',
    _type: 1
  }
  public mobileFiltersView = false;
  public mobileSearchView = false;

  private _dataObserver = new BehaviorSubject<IDataSourceObserver<IStockOperation>>({
    take: 0,
    skip: 0,
    items: [],
  });

  private _destroyed: Subject<any> = new Subject<any>();

  entityDataSource = new CommonDataSource<IStockOperation>(this._dataObserver, this.fetchDataRequest.bind(this), {
    pageSize: this.pageSize,
  });
  constructor(
    private systemService: SystemService,
    private goodsService: GoodsService,
    private router: Router
  ) {
    systemService.stockNavigationPage = EStockNavigation.Stock;
  }

  ngOnInit(): void {
    this.fetchDataRequest({ skip: 0, take: this.pageSize });
  }

  createItem() {
    let part = '';
    switch (this.currentTab) {
      case EStockOperations.Capitalization:
        part = 'capitalization';
        break;
      case EStockOperations.Movement:
        part = 'movement';
        break;
      case EStockOperations.WriteOff:
        part = 'write-off';
        break;
      case EStockOperations.Acceptance:
      default:
        part = 'acceptance';
        break;
    }
    void this.router.navigate([`stock/operations/${part}/new`])
  }

  setTab(acceptance: string) {
    this.currentTab = acceptance as EStockOperations;
    switch (this.currentTab) {
      case EStockOperations.Acceptance:
        this.filters._type = 1;
        break;
      case EStockOperations.Capitalization:
        this.filters._type = 6;
        break;
      case EStockOperations.Movement:
        this.filters._type = 5;
        break;
      case EStockOperations.WriteOff:
        this.filters._type = 4;
        break;
    }
    this.fetchDataRequest({ skip: 0, take: this.pageSize });
  }
  handleClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  clearFilters() {

  }

  createItemMobile() {

  }
  fetchDataRequest({ take, skip }: IDataSourceFetchRequest) {
    this.goodsService.fetchOperations(skip, take, this.filters).subscribe((x) => {
      console.log('X', x)
      this._dataObserver.next(x);
    });
  }

  selectItem(item: IStockOperation) {
    let part = '';
    switch (item.type) {
      case 6:
        part = 'capitalization';
        break;
      case 5:
        part = 'movement';
        break;
      case 4:
        part = 'write-off';
        break;
      case 0:
      default:
        part = 'acceptance';
        break;
    }
    void this.router.navigate([`stock/operations/${part}/${item.id}`])
  }
}
