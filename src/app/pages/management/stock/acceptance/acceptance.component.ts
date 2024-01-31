import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NotificationsService} from "../../../../services/notifications.service";
import {GoodsService} from "../../../../services/goods.service";
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest, debounceTime, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {
  IGoodsCounterparty,
  IGoodsItem,
  IGoodsWarehouse,
  IStockOperation
} from "../../../../interfaces/Goods";
import {IDdsDialogData, IPaymentData} from "../../../../interfaces/Dds";
import {EDdsType} from "../../../../enums/Dds";
import {DdsService} from "../../../../services/dds-service.service";

@Component({
  selector: 'app-stock-acceptance',
  templateUrl: './acceptance.component.html',
  styleUrls: ['./acceptance.component.less']
})
export class StockAcceptanceComponent implements OnInit, OnDestroy {

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
  counterpartiesData: Observable<IGoodsCounterparty[]>;
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
      counterparty: [null, [Validators.required]],
      incoming: [null],
      comment: [null],
    });
    this.goodsData = goodsService.searchGoods(0, this.pageSize, {});
    this.counterpartiesData = goodsService.searchCounterparties(0, 1100, {});
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
          warehouse: { id: operation.warehouse_id, name: operation.warehouse_name },
          counterparty: { client_id: operation.counterparty_id, full_name: operation.counterparty_name },
          incoming: operation.incoming
        })
        this.dateControl.patchValue(new Date(operation.created_at))
        this.overheadsControl.patchValue(operation.overheads || 0)
      }
    })
    this.generalForm.controls['counterparty'].valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (typeof value === 'string') {
        this.counterpartiesData = this.goodsService.searchCounterparties(0, 1100, value ? { _search: value.toLowerCase() } : {})
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

  createOperation() {
    this.operation = this.composePayload();
    console.log('ORD', this.operation)
    this.goodsService.createOperation(this.operation).subscribe((response) => {
      console.log('RESP', response)
      if (response.id) {
        this.notifications.showSnack('Поставка успешно создана')
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
        this.notifications.showSnack('Поставка успешно отрадактирована')
      }
    }, error => {
      console.log('error', error)
      this.notifications.showSnack('Не удалось отрадактировать поставку')
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

  createDdsOperation(type: string) {
    const data: Partial<IDdsDialogData> = {
      type: type as EDdsType,
      counterparty: this.generalForm.controls['counterparty'].value,
      disableEditCounterparty: true,
      wallets$: this.ddsService.fetchWallets(),
      paymentCategories$: this.ddsService.fetchPaymentCategories(),
      counterpartyPayments$:  type === EDdsType.Link
        ? this.ddsService.fetchCounterpartyPayments({id: this.generalForm.controls['counterparty'].value.client_id})
        : of(null)
    }
    if (window.innerWidth < 440) {
      this.notifications.showNewDdsOperationSheet(data).afterDismissed().subscribe((result) => {
        this.handleDdsDialogResult(result)
      })
    } else {
      this.notifications.showNewDdsOperationDialog(data).afterClosed().subscribe((result) => {
        this.handleDdsDialogResult(result)
      })
    }
  }
  private calculateIndividualOverheads(total: number, price: number, overheads: number) {
    return overheads * (price / total)
  }
  private composePayload(): Partial<IStockOperation> {
    const ops: Partial<IStockOperation> = {...this.operation};

    ops.created_at = this.dateControl.value;
    ops.counterparty_id = this.generalForm.controls['counterparty'].value.client_id;
    ops.warehouse_id = this.generalForm.controls['warehouse'].value.id;
    ops.comment = this.generalForm.controls['comment'].value;
    ops.type = 1;
    ops.overheads = this.overheadsControl.value;
    ops.incoming = this.generalForm.controls['incoming'].value;
    let sum = 0;
    for (const item of (ops.items || [])) {
      if (item.value) {
        sum += item.value.price * item.value.quantity * (1 + item.value.vat);
      }
    }
    ops.sum = sum;
    if (ops.overheads) {
      for (const item of (ops.items || [])) {
        if (item.value) {
          item.value.overheads = this.calculateIndividualOverheads(ops.sum, item.value.price * item.value.quantity * (1 + item.value.vat), ops.overheads)
        }
      }
    }
    const newPayments = this.operation.payments?.map((p) =>p.id)
    ops.payments = newPayments as Partial<IPaymentData>[];
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
  private handlePaymentOperationResponse(data: any) {
    if (this.operation.payments) {
      this.operation.payments.push({
        id: data.id,
        payment_date: data.date,
        category: data.category_name,
        comment: data.comment,
        paid_sum: data.sum,
        wallet: data.wallet_name,
      });
      if (data.commission) {
        this.operation.payments.push({
          payment_date: data.date,
          category: 'Комиссия за переводы',
          comment: data.comment,
          paid_sum: -Math.abs(data.commission),
          wallet: data.wallet_name,
        });
      }
    } else {
      this.operation.payments = [{
        id: data.id,
        payment_date: data.date(),
        category: data.category_name,
        comment: data.comment,
        paid_sum: data.sum,
        wallet: data.wallet_name,
      }]
      if (data.commission) {
        this.operation.payments.push({
          payment_date: data.date,
          category: 'Комиссия за переводы',
          comment: data.comment,
          paid_sum: -Math.abs(data.commission),
          wallet: data.wallet_name,
        });
      }
    }
  }
  private handleDdsDialogResult(result: any) {
    if (result) {
      switch (result.type as EDdsType) {
        case EDdsType.Income:
          if (this.id !== 'new') {
            result.income.stock_id = this.id
          }
          console.log('dialog res', result)
          this.ddsService.createIncome(result.income).subscribe((response) => {
            console.log('re', response)
            if (response) {
              result.income.id = response;
              this.handlePaymentOperationResponse(result.income);
              console.log('OPS', )
            }
          }, error => {
            console.log('err', error)
          })
          break;
        case EDdsType.Outcome:
          if (this.id !== 'new') {
            result.outcome.stock_id = this.id
          }
          this.ddsService.createOutcome(result.outcome).subscribe((response) => {
            console.log('re', response)
            if (response) {
              result.outcome.id = response;
              this.handlePaymentOperationResponse(result.outcome);
            }
          }, error => {
            console.log('err', error)
          })
          break;
        case EDdsType.Link:
          this.ddsService.linkPaymentToStockOperation(this.id, result.payment.id).subscribe((response) => {
            console.log('r', response)
            if (response) {
              this.operation.payments
                ? this.operation.payments.push(result.payment)
                : this.operation.payments = [result.payment];
              this.notifications.showSnack(result.type === EDdsType.Link
                ? 'Платёж успешно привязан'
                : 'Платёж успешно создан')
            }
          }, error => {
            this.notifications.showSnack(result.type === EDdsType.Link
              ? 'Не удалось привязать платёж'
              : 'Не удалось создать платёж')
            console.log(error)
          })
          break;
      }
    }
  }

  unlinkPayment(id: number, index: number) {
    this.notifications
      .showConfirmWindow(
        'Отвязка платежа',
        'Вы действительно хотите отвязать этот платёж?',
        ['no', 'unlink'])
      .afterClosed().subscribe((result) => {
      if (result === 'unlink') {
        this.ddsService.linkPaymentToStockOperation('null', `${id}`).subscribe((response) => {
          if (response) {
            this.notifications.showSnack('Платёж успешно отвязан')
            this.operation.payments?.splice(index, 1);
          }
        }, error => {
          console.log('ER', error)
          this.notifications.showSnack('Не удалось отвязать платёж')
        })
      }
    })
  }
}
