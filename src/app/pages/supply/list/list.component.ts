import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {CommonDataSource, IDataSourceFetchRequest, IDataSourceObserver} from "../../../tools/common.datasource";
import {IOzonProduct} from "../../../interfaces/Ozon";
import {DataService} from "../../../services/data.service";
import {SupplyService} from "../../../services/supply.service";
import {SystemService} from "../../../services/system.service";

@Component({
  selector: 'app-supply-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class SupplyListComponent implements OnInit, OnDestroy {

  pageSize = 50;

  private _dataObserver = new BehaviorSubject<IDataSourceObserver<any>>({
    take: 0,
    skip: 0,
    items: [],
  });
  private _destroyed: Subject<any> = new Subject<any>();

  entityDataSource = new CommonDataSource<any>(this._dataObserver, this.fetchDataRequest.bind(this), {
    pageSize: this.pageSize,
  });

  scrolled = false;

  constructor(
    private dataService: SupplyService,
    public systemService: SystemService
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
    this.dataService.loadItems(skip, take).subscribe((x) => {
      this._dataObserver.next(x);
    });
  }

  onScroll(event: any) {
    console.log('scroll', window.scrollY, document.getElementById('scrollView')?.offsetTop)
    this.scrolled = window.scrollY > 150;
  }
}
