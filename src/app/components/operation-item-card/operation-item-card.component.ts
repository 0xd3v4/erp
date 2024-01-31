import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IGoodsItem} from "../../interfaces/Goods";
import {FormControl} from "@angular/forms";
import {EStockOperations} from "../../enums/Stock";

@Component({
  selector: 'app-operation-item-card',
  templateUrl: './operation-item-card.component.html',
  styleUrls: ['./operation-item-card.component.less']
})
export class OperationItemCardComponent implements OnInit{

  @Input() item: Partial<IGoodsItem> = {};
  @Input() type: string = EStockOperations.Acceptance;

  @Output() onUpdate: EventEmitter<{price: number, quantity: number, vat: number}> = new EventEmitter();
  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  // @ts-ignore
  @ViewChild('quantityField', { static: false }) quantityField: ElementRef<HTMLSpanElement>;
  // @ts-ignore
  @ViewChild('priceField', { static: false }) priceField: ElementRef<HTMLSpanElement>;

  quantity = 1;
  vat = 0;
  quantityControl: FormControl = new FormControl(null)
  price = 100;
  allowedKeys = [
    'Period', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'
  ]

  constructor() {
    this.quantityControl.valueChanges.subscribe((value) => {
      console.log('VAL', value, this.item)
    })
  }

  ngOnInit(): void {
    if (this.item.value) {
      this.quantity = Math.abs(this.item.value.quantity);
      this.price = this.item.value.price;
      this.vat = this.item.value.vat;


      setTimeout(() => {
        console.log('ITEMS', this.price, this.item)
        this.quantityField.nativeElement.textContent = `${this.quantity || 100}`;
        if (this.type === EStockOperations.Acceptance || this.type === EStockOperations.Capitalization) {
          this.priceField.nativeElement.textContent = `${this.item.value?.price || 100}`
        }
      }, 0)
    } else {
      if (this.type === EStockOperations.WriteOff) {
        this.price = (this.item.total_price || 0) / (this.item.total_quantity || 1);
      }
    }
    this.onUpdate.emit({
      price: this.price, quantity: this.quantity, vat: this.vat
    })
  }

  onInputStartEvent(event: KeyboardEvent, field: 'quantity'|'price') {

    if (!(Number.isInteger(Number.parseInt(event.key)) || this.allowedKeys.includes(event.code))) {
      event.preventDefault();
      event.stopPropagation()
    } else {
      const currentValue = (event.target as HTMLSpanElement).textContent || '';
      if (event.code === 'Comma' && currentValue.includes('.')) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    }
  }
  onInputEndEvent(event: KeyboardEvent, field: 'quantity'|'price') {
    if (!(Number.isInteger(Number.parseInt(event.key)) || this.allowedKeys.includes(event.code))) {
      event.preventDefault();
      event.stopPropagation()
    } else {
      const text = ((event.target as HTMLSpanElement).textContent || '').trim();
      if (text.length == 0) {
        field == 'quantity'
          ? this.quantity = 0
          : this.price = 0;
      } else {
        field == 'quantity'
          ? this.quantity = +text
          : this.price = +text;
      }
      this.onUpdate.emit({
        price: this.price, quantity: this.quantity, vat: this.vat
      })
    }
  }

  focusEvent(event: FocusEvent, field: 'quantity'|'price') {
    const text = (event.target as HTMLSpanElement).textContent || '';
    if (text.length == 0) {
      (event.target as HTMLSpanElement).textContent = '0';
      field == 'quantity'
        ? this.quantity = 0
        : this.price = 0;
    }
    this.onUpdate.emit({
      price: this.price, quantity: this.quantity, vat: this.vat
    })
    // (event.target as HTMLSpanElement).textContent = (+text as Number).toLocaleString('ru-RU')

  }

  focusIn(event: FocusEvent) {
    // console.log('ddd');
    // console.log(1);
    // const obj = {
    //   origin: (event.target as HTMLSpanElement).textContent,
    //   target: ((event.target as HTMLSpanElement).textContent || '')
    //     .replace(/ /g, '')
    // }
    // console.log(obj)
    // (event.target as HTMLSpanElement).textContent = ((event.target as HTMLSpanElement).textContent || '')
    //   .replace(/ /g, '')
  }

  setVat(value: number) {
    this.vat = value;
    this.onUpdate.emit({
      price: this.price, quantity: this.quantity, vat: this.vat
    })
  }

  removeItem() {
    this.onRemove.emit();
  }
}
