import {Component} from '@angular/core';
import {EStockNavigation} from "../../enums/Stock";
import {Router} from "@angular/router";
import {SystemService} from "../../services/system.service";

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.less']
})
export class SideNavigationComponent {

  currentMenu: EStockNavigation = EStockNavigation.Goods;
  menuState = false;
  constructor(private router: Router, public systemService: SystemService) {
  }

  navigate(part: string) {
    switch (part as EStockNavigation) {
      case EStockNavigation.Goods:
        this.currentMenu = EStockNavigation.Goods;
        void this.router.navigate(['stock/goods']);
        break;
      case EStockNavigation.Warehouses:
        this.currentMenu = EStockNavigation.Warehouses;
        void this.router.navigate(['stock/warehouses']);
        break;
      case EStockNavigation.Counterparties:
        this.currentMenu = EStockNavigation.Counterparties;
        void this.router.navigate(['stock/counterparties']);
        break;
      case EStockNavigation.Stock:
        this.currentMenu = EStockNavigation.Stock;
        void this.router.navigate(['stock/operations']);
        break;
    }
    this.menuState = false;
  }
}
