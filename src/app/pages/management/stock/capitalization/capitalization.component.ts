import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {combineLatest, debounceTime, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {IGoodsCounterparty, IGoodsItem, IGoodsWarehouse, IStockOperation} from "../../../../interfaces/Goods";
import {NotificationsService} from "../../../../services/notifications.service";
import {GoodsService} from "../../../../services/goods.service";
import {DdsService} from "../../../../services/dds-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IPaymentData} from "../../../../interfaces/Dds";

@Component({
  selector: 'app-stock-capitalization',
  templateUrl: './capitalization.component.html',
  styleUrls: ['./capitalization.component.less']
})
export class StockCapitalizationComponent implements OnInit, OnDestroy {

  generalForm: FormGroup;
  dateControl: FormControl = new FormControl(new Date());
  overheadsControl: FormControl = new FormControl(0);
  itemsControl: FormControl = new FormControl(null);

  private loader$;
  private _destroyed: Subject<any> = new Subject<any>();

  operation: Partial<IStockOperation> = {
    items: [],
    payments: []
  }

  totalPrice = 0;
  totalVat = 0;
  id = '';

  pageSize = 250;
  warehousesData: Observable<IGoodsWarehouse[]>;
  goodsData: Observable<IGoodsItem[]>;

  constructor(
    private notifications: NotificationsService,
    private goodsService: GoodsService,
    private ddsService: DdsService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.generalForm = formBuilder.group({
      warehouse: [null, [Validators.required]],
      comment: [null],
    });
    this.goodsData = goodsService.searchGoods(0, this.pageSize, {});
    this.warehousesData = goodsService.searchWarehouses(0, this.pageSize, {});

    this.loader$ = route.params
      .pipe(
        takeUntil(this._destroyed),
        switchMap((params) => {
          console.log('PARAMS', params)
          this.id = params['id'];

          return combineLatest([
            this.id === 'new'
              ? of(null)
              : goodsService.fetchOperationById(this.id),
          ])
        }),
      )
  }
  ngOnInit(): void {
    this.loader$.subscribe(([operation]) => {
      console.log('OPS', operation)
      if (operation) {
        this.operation = operation;
        this.generalForm.patchValue({
          comment: operation.comment,
          warehouse: { id: operation.warehouse_id, name: operation.warehouse_name, common_warehouse_name: operation.common_warehouse_name },
        })
        this.dateControl.patchValue(new Date(operation.created_at))
        this.overheadsControl.patchValue(operation.overheads || 0)
      }
    })
    this.generalForm.controls['warehouse'].valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (typeof value === 'string') {
        this.warehousesData = this.goodsService.searchWarehouses(0, this.pageSize, value ? { _search: value.toLowerCase() } : {})
      }
    })
    this.itemsControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (typeof value === 'string') {
        this.goodsData = this.goodsService.searchGoods(0, this.pageSize, value ? { _search: value.toLowerCase() } : {})
      } else {
        if (typeof value == 'object' && value) {
          this.operation.items?.push(value);
          this.itemsControl.patchValue(null)
        }
      }
    })
  }

  ngOnDestroy(): void {
    this._destroyed.next('');
    this._destroyed.complete();
  }
  displayFnWh(field: any): string {
    return field && field.name
      ? `${field.name}, ${field.common_warehouse_name}`
      : '';
  }
  displayFn(field: any): string {
    return field && field.name
      ? field.name
      : field && field.id
        ? field.id
        : field && field.header
          ? field.header
          : field && field.full_name
            ? field.full_name
            : '';
  }

  back() {
    void this.router.navigate(['stock/operations'])
  }
  createOperation() {
    this.operation = this.composePayload();
    console.log('ORD', this.operation)
    this.goodsService.createOperation(this.operation).subscribe((response) => {
      console.log('RESP', response)
      if (response.id) {
        this.notifications.showSnack('Оприходование успешно создано')
        this.back();
      }
    }, error => {
      console.log('error')
    })
  }

  patchOperation() {
    this.operation = this.composePayload();
    console.log('ORD', this.operation)
    this.goodsService.patchOperation(this.operation).subscribe((response) => {
      console.log('RESP', response)
      if (response.id) {
        this.notifications.showSnack('Оприходование успешно отрадактировано')
      }
    }, error => {
      console.log('error', error)
      this.notifications.showSnack('Не удалось отрадактировать оприходование')
    })
  }

  removeOperation() {
    this.notifications
      .showConfirmWindow(
        'Удаление операции',
        'Вы действительно хотите удалить данную операцию?',
        ['no', 'remove'])
      .afterClosed().subscribe((result) => {
      if (result === 'remove') {
        this.goodsService.removeOperation({ id: +this.id }).subscribe((response) => {
          if (response) {
            this.notifications.showSnack('Операция успешно удалена')
            this.back();
          }
        }, error => {
          console.log('ER', error)
          this.notifications.showSnack('Не удалось удалить операцию')
        })
      }
    })
  }

  whenUpdateItem(data: {price: number; quantity: number; vat: number}, index: number) {
    if (this.operation.items){
      this.operation.items[index].value = data
    }
    this.calculateTotal();
  }
  whenRemoveItem(index: number) {
    this.operation.items?.splice(index, 1)
    this.calculateTotal();
  }


  private calculateIndividualOverheads(total: number, price: number, overheads: number) {
    return overheads * (price / total)
  }
  private composePayload(): Partial<IStockOperation> {
    const ops: Partial<IStockOperation> = {...this.operation};

    ops.created_at = this.dateControl.value;
    ops.warehouse_id = this.generalForm.controls['warehouse'].value.id;
    ops.comment = this.generalForm.controls['comment'].value;
    ops.type = 6;
    ops.overheads = this.overheadsControl.value;
    let sum = 0;
    for (const item of (ops.items || [])) {
      if (item.value) {
        sum += item.value.price * item.value.quantity;
      }
    }
    ops.sum = sum;
    if (ops.overheads) {
      for (const item of (ops.items || [])) {
        if (item.value) {
          item.value.overheads = this.calculateIndividualOverheads(ops.sum, item.value.price * item.value.quantity, ops.overheads)
        }
      }
    }
    return ops;
  }
  private calculateTotal() {
    this.totalPrice = 0;
    this.totalVat = 0;
    for (const itm of (this.operation.items || [])) {
      if (itm.value) {
        const vatAmount = itm.value.vat * itm.value.price * itm.value.quantity;
        this.totalPrice += (itm.value.price * itm.value.quantity + vatAmount)
        this.totalVat += vatAmount
      }
    }
  }

}
