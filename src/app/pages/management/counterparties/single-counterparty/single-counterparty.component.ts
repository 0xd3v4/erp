import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationsService} from "../../../../services/notifications.service";
import {GoodsService} from "../../../../services/goods.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {of, Subject, switchMap, combineLatest, takeUntil} from "rxjs";
import {IGoodsCounterparty, IGoodsCounterpartyContacts} from "../../../../interfaces/Goods";

@Component({
  selector: 'app-single-goods-counterparty',
  templateUrl: './single-counterparty.component.html',
  styleUrls: ['./single-counterparty.component.less']
})
export class SingleGoodsCounterpartyComponent implements OnInit, OnDestroy {

  itemHeader: string = 'Новый поставщик';
  id = 'new';
  counterpartyTypes: any[] = [];

  private loader$;
  private _destroyed: Subject<any> = new Subject<any>();

  generalForm: FormGroup;
  contactsForm: FormGroup;
  credentialsForm: FormGroup;

  contactsControl = false;
  contactsHeight = 182
  contactsAvailable: Partial<IGoodsCounterpartyContacts>[] = [];
  credentialsControl: FormControl = new FormControl(false)
  constructor(
    private notifications: NotificationsService,
    private goodsService: GoodsService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.generalForm = formBuilder.group({
      full_name: [null, [Validators.required]],
      comment: [null],
      credentials: [null],
    });
    this.contactsForm = formBuilder.group({
      phone: [null],
      fax: [null],
      email: [null, [Validators.pattern(
        '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$'
      )]],
      address: [null],
    });
    this.credentialsForm = formBuilder.group({
      type: [null],
      full_name: [null],
      inn: [null, [Validators.maxLength(12)]],
      kpp: [null, [Validators.maxLength(9)]],
      ogrn: [null, [Validators.maxLength(15)]],
      okpo: [null, [Validators.maxLength(14)]],
      address: [null],
      date: [null],
    });

    this.loader$ = route.params
      .pipe(
        takeUntil(this._destroyed),
        switchMap((params) => {
          console.log('PARAMS', params)
          this.id = params['id'];

          return combineLatest([
            this.id === 'new'
              ? of(null)
              : goodsService.fetchCounterpartyById(this.id),
            goodsService.fetchCounterpartyTypes()
          ])
        }),
      )
  }

  ngOnDestroy(): void {
    this._destroyed.next('');
    this._destroyed.complete();
  }

  ngOnInit(): void {
    this.loader$.subscribe(([counterparty, types]) => {
      console.log('CP', {counterparty}, types);
      if (counterparty) {
        this.itemHeader =  'Редактирование поставщика';
        this.generalForm.patchValue(counterparty);

        if (counterparty.contacts && counterparty.contacts.length > 0) {
          // this.contactsControl = true;
          this.contactsAvailable = counterparty.contacts.filter((c) => c);
          // this.contactsHeight = counterparty.contacts.length * 63) + 130
          // this.contactsForm.patchValue(counterparty.contacts);
        }
        if (counterparty.credentials_extended?.id) {
          this.credentialsControl.patchValue(true);
          this.credentialsForm.patchValue(counterparty.credentials_extended);
        }
      }
      this.counterpartyTypes = types;
    })
  }

  back() {
    void this.router.navigate(['stock/counterparties'])
  }

  change() {
    const data: Partial<IGoodsCounterparty> = this.generalForm.value;
    data.contacts = this.contactsAvailable;
    if (this.credentialsControl.value) {
      data.credentials = this.credentialsForm.value;
    }
    if (this.id === 'new') {
      this.goodsService.createCounterparty(data).subscribe((response) => {
        console.log('CREATE', response)
        if (response.id) {
          this.id = response.id;
          this.notifications.showSnack('Поставщик успешно создан')
        }
      }, error => {
        console.log('ER', error)
        this.notifications.showSnack('При попытке создания поставщика произошла ошибка')
      })
    } else {
      data.client_id = +this.id;
      this.goodsService.patchCounterparty(data).subscribe((response) => {
        console.log('UPDATE', response)
        if (response.id) {
          this.id = response.id;
          this.notifications.showSnack('Данные поставщика успешно обновлены')
        }
      }, error => {
        console.log('ER', error)
        this.notifications.showSnack('При попытке обновления данных поставщика произошла ошибка')
      })
    }
  }

  remove() {
    this.notifications
      .showConfirmWindow(
        'Удаление поставщика',
        'Вы действительно хотите удалить данного поставщика?',
        ['no', 'remove'])
      .afterClosed().subscribe((result) => {
      if (result === 'remove') {
        this.goodsService.removeCounterparty({ id: +this.id }).subscribe((response) => {
          if (response) {
            this.notifications.showSnack('Поставщик успешно удалён')
            this.back();
          }
        }, error => {
          console.log('ER', error)
          this.notifications.showSnack('Не удалось удалить поставщика')
        })
      }
    })
  }

  whenRemoveContact(index: number) {
    this.contactsAvailable.splice(index, 1)
  }

  whenUpdateContact(data: Partial<IGoodsCounterpartyContacts>, index: number) {
    this.contactsAvailable[index].name = data.name;
    this.contactsAvailable[index].phone = data.phone;
  }

  addContact() {
    this.contactsAvailable.push({
      name: '',
      phone: ''
    })
  }
}
