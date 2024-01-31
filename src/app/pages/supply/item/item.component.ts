import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupplyListComponent} from "../list/list.component";
import {SupplyService} from "../../../services/supply.service";
import {ActivatedRoute} from "@angular/router";
import {combineLatest, debounceTime, filter, map, Observable, of, Subject, switchMap, tap} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ISupply} from "../../../interfaces/Supply";
import {NotificationsService} from "../../../services/notifications.service";
import {SystemService} from "../../../services/system.service";
import {ManufactureService} from "../../../services/manufacture.service";
import {FormControl} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-supply-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.less']
})
export class SupplyItemComponent implements OnInit, OnDestroy {

  private loader$;
  // @ts-ignore
  private providers$;
  private _destroyed: Subject<any> = new Subject<any>();

  id = '';
  // @ts-ignore
  item: ISupply = null;
  readyItems = 0;

  selectedTab: 'real'|'expected' = 'real';

  realItems: any[] = [];
  searchItems: any[] = [];

  ozonSearchForm: FormControl = new FormControl(null);

  searchItems$: Observable<any[]> = of([]);

  oddHeight = 550;

  constructor(
    private supplyService: SupplyService,
    private manufactureService: ManufactureService,
    private route: ActivatedRoute,
    private notifications: NotificationsService,
    public systemService: SystemService,
    private authService: AuthService
    ) {
    this.loader$ = route.params
      .pipe(
        takeUntil(this._destroyed),
        switchMap((params) => {
          console.log('PARAMS', params)
          this.id = params['number'];
          return combineLatest([supplyService.loadItemById(this.id), authService.getUserRole()])
        }),
      )
    this.ozonSearchForm.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      console.log('VAL', value);
      if (value.trim()) {
        this.searchItems$ = this.searchOzonItems(value);
      } else {
        this.searchItems$ = of(this.searchItems.filter((itm: any) => !this.realItems.map((r) => r.id).includes(itm.id)));
      }
    });
  }

  ngOnInit(): void {
    this.loader$.subscribe(([item, role]) => {
      console.log('role', role, 'ITEM', item, this.realItems)
      this.systemService.role = role.role;
      setTimeout(() => {

        const count = document.getElementById('odd-nav')?.children.length || 13;
        this.oddHeight = count * 40 + 30;
      }, 250)
      this.item = item;
      this.realItems = item.realItems || [];
      this.readyItems = (item.items?.filter((i) => ['awaiting_deliver', 'delivering'].includes(i.ozon_status)) || []).length;
      this.searchItems = JSON.parse(JSON.stringify((item.items?.filter((i) => ['awaiting_deliver'].includes(i.ozon_status)) || [])))
        .filter((itm: any) => !this.realItems.map((r) => r.id).includes(itm.id));
      this.searchItems$ = of(this.searchItems);
    })
  }
  ngOnDestroy(): void {
    this._destroyed.next('');
    this._destroyed.complete();
  }

  printAct() {
    this.supplyService.printAct(this.id).subscribe((response) => {
      this.printBase64(response.data)
    })
  }
  searchOzonItems(search: string): Observable<any[]> {
    return this.supplyService.searchOzonPostings(this.id, search)
      .pipe(
        map((items) => {
          return items.filter((item) => !this.realItems.map((r) => r.id).includes(item.id))
        }),
      )
  }

  private printBase64(data: string) {
    fetch(data)
      .then(res => res.blob())
      .then(blob => {
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank')

        // const iframe = document.createElement('iframe');
        // document.body.appendChild(iframe);
        // //
        // iframe.style.display = 'none';
        // iframe.src = url;
        // iframe.onload = () => {
        //   setTimeout(() => {
        //     iframe.focus();
        //     // iframe.contentWindow?.print();
        //   }, 1);
        // };

      });
  }

  printQr() {
    this.supplyService.printQr(this.id).subscribe((response) => {
      this.printBase64(response.data)
    })
  }

  createActRequest() {
    this.supplyService.createActRequest(this.id, { date: this.item.label }).subscribe((response) => {
      console.log('res', response)
      if (response.id) {
        this.item.ozon_supply_id = response.id;
      }
    }, (error) => {
      this.notifications.showSnack('Невозможно сформировать отправление', 3000)
    })
  }

  removeItem(item: any) {
    this.notifications
      .showConfirmWindow(
        'Отмена отправления',
        'Вы действительно хотите отменить отправление?',
        ['no', 'cancel_confirm']).afterClosed().subscribe((response) => {
          if (response === 'cancel_confirm') {
            this.supplyService.removePositionFromItem(`${this.item.id}`, item.products_list_id)
              .subscribe((response) => {

            })
          }
    })
  }

  returnToDelivery(item: any) {
    this.notifications
      .showConfirmWindow(
        'Вернуть в доставку',
        'Вы действительно хотите вернуть отправление в доставку?',
        ['cancel', 'confirm']).afterClosed().subscribe((response) => {
      if (response === 'confirm') {
        this.supplyService.returnPositionToDelivery(`${this.item.id}`, item.ozon_posting_number)
          .subscribe((response) => {
            if (response) {
              item.ozon_status = 'awaiting_deliver';
              this.notifications.showSnack('Статус отправления успешно изменен')
            } else {
              this.notifications.showSnack('Не удалось вернуть отправление в доставку')
            }
        }, (error) => {
            this.notifications.showSnack('Не удалось вернуть отправление в доставку')
          })
      }
    })
  }
  sendToPacking(item: any) {

  }

  closeManually() {
    this.notifications
      .showConfirmWindow(
        'Закрыть вручную',
        'Вы действительно хотите закрыть поставку вручную?',
        ['cancel', 'confirm']).afterClosed().subscribe((response) => {
      if (response === 'confirm') {
        this.supplyService.closeManually(`${this.id}`)
          .subscribe((response) => {
            this.notifications.showSnack('Поставка закрыта в ручном режиме');
            this.item.closed = response;
            for (const item of this.realItems) {
              item.status_name = 'Отгружен';
            }
          }, (error) => {
            this.notifications.showSnack('Не удалось закрыть поставку в ручном режиме')
          })
      }
    })
  }

  printStickers() {
    const pool = this.realItems
      ?.filter((i) => i.ozon_status === 'awaiting_deliver')
      .map((i) => i.id) || []
    console.log('pool', pool)
    this.manufactureService.printStickerPool(pool).subscribe((response) => {
      for (const item of this.realItems) {
        item.status_name = 'Наклейки распечатаны';
      }
      if (response.ozonUrl){
        window.open(response.ozonUrl, '_blank')
      }

      // this.printBase64(response.ozonUrl)
    })
  }

  addItem(item: MatAutocompleteSelectedEvent) {
    // console.log('GOT SELECTION', item, this.realItems)
    this.ozonSearchForm.patchValue('')
    this.supplyService.addItemToOzonSupply(this.id, item.option.value.msp_id).subscribe((response) => {
      this.realItems.push(item.option.value);
    })
  }

  removeFromReal(posting: any) {
    this.notifications
      .showConfirmWindow(
        'Удалить товар',
        'Вы действительно хотите удалить отправление из поставки?',
        ['no', 'remove']).afterClosed().subscribe((response) => {
      if (response === 'remove') {
        this.supplyService.removeItemFromOzonSupply(this.id, posting.msp_id).subscribe((response) => {
          console.log('RESP', response)
          if (response) {
            const idx = this.realItems.indexOf(posting);
            if (idx >= 0) {
              this.realItems.splice(idx, 1);
              this.ozonSearchForm.patchValue('');
            }
          } else {
            this.notifications.showSnack('Не удалось удалить отправление')
          }
        })
      }
    })
  }

  changeFocus() {
    this.systemService.oddNavigationState = !this.systemService.oddNavigationState;
  }
}
