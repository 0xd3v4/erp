import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EDdsType} from "../../enums/Dds";
import {IDdsDialogData} from "../../interfaces/Dds";
import {FormControl} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";
import {combineLatest, debounceTime, Observable, of} from "rxjs";
import {GoodsService} from "../../services/goods.service";

@Component({
  selector: 'app-new-dds-operation-dialog',
  templateUrl: './new-dds-operation-dialog.component.html',
  styleUrls: ['./new-dds-operation-dialog.component.less'],
})
export class NewDdsOperationDialogComponent implements OnInit {

  dialogHeader = 'Новый доход';
  saveButtonText = 'Сохранить';

  dateForm: FormControl = new FormControl(new Date());
  walletForm: FormControl = new FormControl(null);
  valueForm: FormControl = new FormControl(null);
  categoryForm: FormControl = new FormControl(null);
  counterpartyForm: FormControl = new FormControl(null);
  commissionForm: FormControl = new FormControl(null);
  commentForm: FormControl = new FormControl(null);

  walletsData: Observable<any> = of([]);
  counterpartiesData: Observable<any> = of([]);
  categoriesData: Observable<any> = of([]);

  sub$;
  private wallets: any[] = [];
  private categories: any[] = [];
  private type = 'Поступление';

  paymentData: any[] = [];
  selectedPayment = '';

  constructor(
    public dialogRef: MatDialogRef<NewDdsOperationDialogComponent>,
    private goodsService: GoodsService,
    @Inject(MAT_DIALOG_DATA) public data: Partial<IDdsDialogData>,

  ) {
    console.log('DATA', this.data)
    this.sub$ = combineLatest([
      data.wallets$ ? data.wallets$ : of([]),
      data.paymentCategories$ ? data.paymentCategories$ : of([]),
      this.goodsService.searchCounterparties(0, 200, { _search: '' }),
      data.counterpartyPayments$ ? data.counterpartyPayments$ : of(null)
    ])
    this.walletForm.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (typeof value === 'string') {
        this.walletsData = of(this.wallets.filter((w) => (w.name || '').toLowerCase().includes(value.trim().toLowerCase())) || []);
      }
    })
    this.categoryForm.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (typeof value === 'string') {
        this.categoriesData = of(this.categories.filter((c) => (c.name || '').toLowerCase().includes(value.trim().toLowerCase()) && c.payment_type == this.type) || []);
      }
    })
    this.counterpartyForm.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (typeof value === 'string') {
        const filters =  value.trim().length > 0 ? { _search: value } : {}
        this.goodsService.searchCounterparties(0, 200, filters).subscribe((v) => {
          this.counterpartiesData = of(v);
        })
      }
    })
  }

  ngOnInit(): void {
    switch (this.data.type) {
      case EDdsType.Income:
        this.type = 'Поступление';
        this.dialogHeader = this.data.id ? `Доход № ${this.data.id}` : 'Новый доход';
        break;
      case EDdsType.Outcome:
        this.type = 'Списание';
        this.dialogHeader = this.data.id ? `Расход № ${this.data.id}` : 'Новый расход';
        break;
      case EDdsType.Transfer:
        this.type = 'Перевод';
        this.dialogHeader = this.data.id ? `Перевод № ${this.data.id}` : 'Новый перевод';
        break;
      case EDdsType.Link:
        this.type = 'Связанный платёж';
        this.dialogHeader = 'Привязать платёж'
        break;
    }
    this.sub$.subscribe(([wallets, categories, counterparties, payments]) => {
      console.log('W', wallets, categories, counterparties, payments)
      this.wallets = wallets;
      this.categories = categories;
      this.walletsData = of(wallets || []);

      if (payments) {
        this.paymentData = payments;
      }

      this.categoriesData = of(categories.filter((c: any) => c.payment_type == this.type) || []);
      this.counterpartiesData = of(counterparties);
      if (this.data.counterparty) {
        this.counterpartyForm.patchValue(this.data.counterparty)
        if (this.data.disableEditCounterparty) {
          this.counterpartyForm.disable()
        }
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  change() {
    const data: any = {
      type: this.data.type
    }
    switch (this.data.type) {
      case EDdsType.Link:
        data.payment = this.paymentData.find((p) => p.id === this.selectedPayment);
        break;
      case EDdsType.Income:
        data.income = {
          date: this.dateForm.value,
          wallet: this.walletForm.value.id,
          wallet_name: this.walletForm.value.name,
          sum: this.valueForm.value,
          category: this.categoryForm.value.id,
          category_name: this.categoryForm.value.name,
          counterparty: this.counterpartyForm.value.client_id,
          counterparty_name: this.counterpartyForm.value.full_name,
          commission: this.commissionForm.value,
          comment: this.commentForm.value,
          type: 'Поступление'
        }
        break;
      case EDdsType.Outcome:
        data.outcome = {
          date: this.dateForm.value,
          wallet: this.walletForm.value.id,
          wallet_name: this.walletForm.value.name,
          sum: -Math.abs(this.valueForm.value),
          category: this.categoryForm.value.id,
          category_name: this.categoryForm.value.name,
          counterparty: this.counterpartyForm.value.client_id,
          counterparty_name: this.counterpartyForm.value.full_name,
          commission: this.commissionForm.value,
          comment: this.commentForm.value,
          type: 'Списание'
        }
        break;
    }
    this.dialogRef.close(data);
  }

  remove() {

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

  handleClick(event: MouseEvent, id: string) {

    console.log('EV', event.target, {id});
    const elements = Array.from(document.getElementsByClassName('payment-item'))
    for (const el of elements) {
      el.classList.remove('bg-blue-200')
      el.classList.add('bg-white')
    }
    (event.target as HTMLDivElement).classList.add('bg-blue-200');
    (event.target as HTMLDivElement).classList.remove('bg-white');
    this.selectedPayment = id;
  }
}
