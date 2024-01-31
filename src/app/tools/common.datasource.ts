import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface IDataSourceObserver<T> {
  take: number;
  skip: number;
  items: T[];
}

export interface IDataSourceFetchRequest {
  take: number;
  skip: number;
}

export class CommonDataSource<T> extends DataSource<T | undefined> {
  private _length = 100;
  private _pageSize = 50;
  private _cachedData: T[] = [];
  private _fetchedPages = new Set<number>();
  private readonly _dataStream = new BehaviorSubject<(T | undefined)[]>(this._cachedData);
  private readonly _subscription = new Subscription();
  private readonly _destroyed = new Subject();

  private _fetchEvent = new EventEmitter<IDataSourceFetchRequest>();
  private _dataObservable: Observable<IDataSourceObserver<T>>;

  constructor(dataObservable: any, fetchEvent: any, { pageSize } = { pageSize: 50 }) {
    super();

    this._pageSize = pageSize;
    this._length = pageSize;
    this.clear();

    this._fetchEvent.subscribe(fetchEvent);
    this._dataObservable = dataObservable;

    this._dataObservable.pipe(takeUntil(this._destroyed)).subscribe(({ items, skip, take }) => {
      const takenPage = Math.floor(skip / this._pageSize);
      this._fetchedPages.add(takenPage);

      this._cachedData.splice(takenPage * this._pageSize, this._pageSize, ...items);
      if (items.length === this._pageSize) {
        this._cachedData.length =
          this._cachedData.length < takenPage * this._pageSize ? takenPage * this._pageSize : this._cachedData.length;
      }
      this._dataStream.next(this._cachedData);
    });
  }

  public connect(collectionViewer: CollectionViewer): Observable<(T | undefined)[]> {
    collectionViewer.viewChange.pipe(takeUntil(this._destroyed)).subscribe((range) => {
      const startPage = this._getPageForIndex(range.start);
      const endPage = this._getPageForIndex(range.end);
      for (let i = startPage; i <= endPage; i++) {
        this._fetchPage(i);
      }
    });
    return this._dataStream;
  }

  public clear(): void {
    this._cachedData = Array.from({ length: this._length });
    this._fetchedPages.clear();
    this._dataStream.next(this._cachedData);
  }

  public disconnect(): void {
    this.clear();
    this._subscription.unsubscribe();
    this._destroyed.next('');
    this._destroyed.complete();
  }

  public length(): number {
    const value: (T | undefined)[] = this._dataStream.value;
    if (value && Array.isArray(value)) {
      return value.filter((item) => Boolean(item)).length;
    }
    return 0;
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(page: number) {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchEvent.emit({ take: this._pageSize, skip: this._pageSize * page });
  }
}
