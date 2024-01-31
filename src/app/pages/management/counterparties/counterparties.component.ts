import {Component, OnDestroy, OnInit} from '@angular/core';
import {SystemService} from "../../../services/system.service";
import {EStockNavigation} from "../../../enums/Stock";
import {FormControl} from "@angular/forms";
import {BehaviorSubject, debounceTime, Subject} from "rxjs";
import {CommonDataSource, IDataSourceFetchRequest, IDataSourceObserver} from "../../../tools/common.datasource";
import {IGoodsCounterparty, IGoodsItem} from "../../../interfaces/Goods";
import {GoodsService} from "../../../services/goods.service";
import {EGoodsTabs} from "../../../enums/Goods";
import {Router} from "@angular/router";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-goods-counterparties',
  templateUrl: './counterparties.component.html',
  styleUrls: ['./counterparties.component.less']
})
export class GoodsCounterpartiesComponent implements OnInit, OnDestroy {

  searchControl: FormControl = new FormControl(null);

  pageSize = 50;

  private _dataObserver = new BehaviorSubject<IDataSourceObserver<IGoodsCounterparty>>({
    take: 0,
    skip: 0,
    items: [],
  });
  private _destroyed: Subject<any> = new Subject<any>();
  public filters: any = {
    _search: ''
  }
  entityDataSource = new CommonDataSource<IGoodsCounterparty>(this._dataObserver, this.fetchDataRequest.bind(this), {
    pageSize: this.pageSize,
  });

  constructor(
    private systemService: SystemService,
    private goodsService: GoodsService,
    private notifications: NotificationsService,
    private router: Router
  ) {
    systemService.stockNavigationPage = EStockNavigation.Counterparties;
  }

  ngOnInit(): void {
    this.fetchDataRequest({ skip: 0, take: this.pageSize });
    this.searchControl.valueChanges.pipe(debounceTime(350)).subscribe((value) => {
      if (value && value.trim().length > 2) {
        this.filters._search = value.toLowerCase()
      } else {
        delete this.filters._search;
      }
      this.fetchDataRequest({ skip: 0, take: this.pageSize });
    });
  }
  ngOnDestroy(): void {
    this._destroyed.next('');
    this._destroyed.complete();
  }

  fetchDataRequest({ take, skip }: IDataSourceFetchRequest) {
    this.goodsService.fetchCounterparties(skip, take, this.filters).subscribe((x) => {
      this._dataObserver.next(x);
    });
  }

  createItemMobile() {
    void this.router.navigate(['stock/counterparties/new'])
  }

  createItem() {
    void this.router.navigate(['stock/counterparties/new'])
  }
  deleteItem(item: IGoodsCounterparty, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation()
    this.notifications
      .showConfirmWindow(
        'Удаление поставщика',
        'Вы действительно хотите удалить данного поставщика?',
        ['no', 'remove'])
      .afterClosed().subscribe((result) => {
      if (result === 'remove') {
        this.goodsService.removeCounterparty({ id: item.client_id }).subscribe((response) => {
          if (response) {
            this.notifications.showSnack('Поставщик успешно удалён')
            this.fetchDataRequest({ skip: 0, take: this.pageSize });
          }
        }, error => {
          console.log('ER', error)
          this.notifications.showSnack('Не удалось удалить поставщика')
        })
        // this.selectRemove(this.data.data.item).subscribe((response) => {
        //   if (response) {
        //     this.dialogRef.close({response, data: this.data.data.item});
        //   } else {
        //     this.notifications.showSnack('Не удалось удалить запись')
        //   }
        // }, error => {
        //   this.notifications.showSnack('Не удалось удалить запись: ' + error.message)
        // })
      }
    })
  }

  editItem(item: IGoodsCounterparty) {
    void this.router.navigate([`stock/counterparties/${item.client_id}`])
  }
}
