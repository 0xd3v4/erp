import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {CommonDataSource, IDataSourceFetchRequest, IDataSourceObserver} from "../../../tools/common.datasource";
import {ManufactureService} from "../../../services/manufacture.service";
import {ProductsService} from "../../../services/products.service";
import {DictionaryService} from "../../../services/dictionary.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-manufacture-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ManufactureProductsComponent implements OnInit, OnDestroy {

  pageSize = 50;

  private filters: {
    _search?: string;
    // since: string;
    // till?: string;
    // showInactive: boolean;
    // order?: ISortRule;
  } = {
    // since: moment().startOf('day').toISOString(true),
    // showInactive: true,
    // order: this.sortRule,
  };

  private _dataObserver = new BehaviorSubject<IDataSourceObserver<any>>({
    take: 0,
    skip: 0,
    items: [],
  });
  private _destroyed: Subject<any> = new Subject<any>();

  entityDataSource = new CommonDataSource<any>(this._dataObserver, this.fetchDataRequest.bind(this), {
    pageSize: this.pageSize,
  });

  selectedItems: string[] = [];

  constructor(
    private dataService: ManufactureService,
    private productService: ProductsService,
    private dictionaryService: DictionaryService,
    private notifications: NotificationsService
  ) {
  }
  ngOnInit(): void {
    this.fetchDataRequest({ skip: 0, take: this.pageSize });
  }
  ngOnDestroy(): void {
    this._destroyed.next('');
    this._destroyed.complete();
  }

  fetchDataRequest({ take, skip }: IDataSourceFetchRequest) {
    const f = JSON.parse(JSON.stringify(this.filters));
    console.log('Request', { take, skip, f });
    this.dataService.loadItems(skip, take, f).subscribe((x) => {
      this._dataObserver.next(x);
    });
  }

  change(event: MouseEvent, ch: any, item: any) {
    if (!(event.target || '').toString().includes('HTMLInputElement')) {
      ch.toggle();
    }
    if (ch.checked) {
      this.selectedItems.push(item.id)
    } else {
      this.selectedItems.splice(this.selectedItems.indexOf(item.id), 1);
    }
    console.log('SELECTED', this.selectedItems)
  }

  print(mobile?: boolean) {
    if (this.selectedItems.length === 1) {
      this.dataService.printSingleItem(this.selectedItems[0]).subscribe((response) => {
        this.printBase64(response.data)
      })
    } else {
      this.dataService.printStickerPool(this.selectedItems).subscribe((response) => {
        mobile
          ? this.notifications.showPrintingSheet(response)
          : this.notifications.showPrintingDialog(response)
      })

    }
  }
  private printBase64(data: string) {
    fetch(data)
      .then(res => res.blob())
      .then(blob => {
        console.log(blob);
        const url = window.URL.createObjectURL(blob);

        console.log('URL', url)
        window.open(url, '_blank')?.print()

        // const iframe = document.createElement('iframe');
        // document.body.appendChild(iframe);
        // iframe.style.display = 'none';
        // iframe.src = url;
        // iframe.onload = () => {
        //   setTimeout(() => {
        //     iframe.focus();
        //     console.log('IFRAME_', iframe.contentWindow)
        //     iframe.contentWindow?.print();
        //   }, 1);
        // };

      });
  }
}
