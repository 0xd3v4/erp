import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonDataSource, IDataSourceFetchRequest, IDataSourceObserver} from "../../../tools/common.datasource";
import {BehaviorSubject, Subject} from "rxjs";
import {DataService} from "../../../services/data.service";
import {IOzonProduct} from "../../../interfaces/Ozon";

@Component({
  selector: 'app-ozon',
  templateUrl: './ozon.component.html',
  styleUrls: ['./ozon.component.less']
})
export class OzonComponent implements OnInit, OnDestroy {

  pageSize = 50;

  private _dataObserver = new BehaviorSubject<IDataSourceObserver<any>>({
    take: 0,
    skip: 0,
    items: [],
  });
  private _destroyed: Subject<any> = new Subject<any>();

  entityDataSource = new CommonDataSource<IOzonProduct>(this._dataObserver, this.fetchDataRequest.bind(this), {
    pageSize: this.pageSize,
  });

  constructor(
    private dataService: DataService
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
    console.log('Request', { take, skip });
    this.dataService.loadOzonProducts(skip, take).subscribe((x) => {
      this._dataObserver.next(x);
    });
  }

}
