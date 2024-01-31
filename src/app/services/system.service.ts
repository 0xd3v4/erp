import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {EStockNavigation} from "../enums/Stock";

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  menuStatus = true;
  loaderStatus = false;
  currentState = false;
  classicMenuStatus = false;

  uiStyle: 'classic'|'modern' = 'modern';
  oddNavigation = true;
  oddNavigationState = false;
  role = '';

  loaderStatus$: Subject<boolean> = new Subject<boolean>();

  stockNavigationPage: EStockNavigation = EStockNavigation.Goods;

  constructor() {
    this.loaderStatus$.subscribe((status) => {
      setTimeout(() => {
        this.loaderStatus = status;
      }, 0)
    })
    if (window.innerWidth <= 1024) {
      this.menuStatus = false;
    }
  }
}
