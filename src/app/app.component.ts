import {Component, OnDestroy, OnInit} from '@angular/core';
import { INavigationSection} from "./interfaces/Common";
import {SystemService} from "./services/system.service";
import {Subject} from "rxjs";
import {AuthService} from "./services/auth.service";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {

  oddHeight = 550;
  private loader$;
  // @ts-ignore
  private providers$;
  private _destroyed: Subject<any> = new Subject<any>();

  constructor(
    public systemService: SystemService,
    private authService: AuthService
  ) {
    this.loader$ = authService.getUserRole().pipe(takeUntil(this._destroyed))
  }
  menuStatus = true;
  config: INavigationSection[] = [
    {
      header: 'Дашборд',
      nodes: [
        {
          header: 'Дашборд',
          routerLink: 'dashboard',
          icon: 'dashboard'
        },
      ]
    },
    {
      header: 'Основное',
      nodes: [
        {
          header: 'Заказы',
          routerLink: 'orders',
          icon: 'shopping_cart'
        },
        {
          header: 'Финансы',
          routerLink: 'finance',
          icon: 'currency_ruble'
        },
        {
          header: 'Товары',
          routerLink: '',
          icon: 'local_offer',
          items: [
            {
              header: 'Товары (основные)',
              routerLink: 'products/common',
            },
            {
              header: 'Товары WB',
              routerLink: 'products/wb',
            },
            {
              header: 'Товары Ozon',
              routerLink: 'products/ozon',
            }
          ]
        },
        {
          header: 'Производство',
          routerLink: '',
          icon: 'precision_manufacturing',
          items: [
            {
              header: 'Заказы на производство',
              routerLink: 'manufacture/products',
            },
            {
              header: 'Производственные модели',
              routerLink: 'manufacture/models',
            },
            {
              header: 'Производственные детали',
              routerLink: 'manufacture/details',
            },
            {
              header: 'Производственные операции',
              routerLink: 'manufacture/operations',
            }
          ]
        },
        {
          header: 'Поставки',
          routerLink: 'supply',
          icon: 'local_shipping'
        },
      ]
    },
    {
      header: 'Склады',
      nodes: [
        {
          header: 'Состояние',
          routerLink: 'warehouses/stock',
          icon: 'table_chart'
        },
        {
          header: 'Склады (продажи)',
          routerLink: 'warehouses/common',
          icon: 'factory'
        },
        {
          header: 'Склады WB',
          routerLink: 'warehouses/wb',
          icon: 'warehouse'
        },
        {
          header: 'Склады Ozon',
          routerLink: 'warehouses/ozon',
          icon: 'warehouse'
        }
      ]
    },
    {
      header: 'Отчеты',
      nodes: [
        {
          header: 'Отчеты рабочих',
          routerLink: 'reports',
          icon: 'table_chart'
        },
      ]
    },
    {
      header: 'Справочники',
      nodes: [
        {
          header: 'Пользователи',
          routerLink: 'settings/users',
          icon: 'people'
        },
        {
          header: 'Модели',
          routerLink: 'settings/product-models',
          icon: 'chair'
        },
        {
          header: 'Цены на операции',
          routerLink: 'settings/operation-prices',
          icon: 'payments'
        }
      ]
    },


  ]

  ngOnInit(): void {
    this.loader$.subscribe((role) => {
      this.systemService.role = role.role;
      setTimeout(() => {

        const count = document.getElementById('odd-nav')?.children.length || 13;
        this.oddHeight = count * 40 + 30;
      }, 250)
    })
  }
  ngOnDestroy(): void {
    this._destroyed.next('');
    this._destroyed.complete();
  }
  changeFocus() {
    this.systemService.oddNavigationState = !this.systemService.oddNavigationState;
  }
}
