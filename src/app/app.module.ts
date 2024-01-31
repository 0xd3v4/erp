import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComplexNavigationComponent } from './components/complex-navigation/complex-navigation.component';
import { RouterLink, RouterModule} from "@angular/router";
import { MatIconModule} from "@angular/material/icon";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { FinanceComponent } from './pages/finance/finance.component';
import { WarehouseComponent } from './pages/warehouse/warehouse.component';
import { RoutingModule} from "./tools/routing.module";
import { CommonComponent } from './pages/products/common/common.component';
import { OzonComponent } from './pages/products/ozon/ozon.component';
import { WbComponent } from './pages/products/wb/wb.component';
import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import { HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatInputModule} from "@angular/material/input";
import { MatSlideToggleModule} from "@angular/material/slide-toggle";
import { SupplyListComponent } from './pages/supply/list/list.component';
import { SupplyItemComponent } from './pages/supply/item/item.component';
import { DatetimePipe } from './pipes/datetime.pipe';
import { MatButtonModule} from "@angular/material/button";
import { OzonStatusPipe } from './pipes/ozon-status.pipe';
import { ManufactureProductsComponent } from './pages/manufacture/products/products.component';
import { MatCheckboxModule} from "@angular/material/checkbox";
import { MatBottomSheetModule} from "@angular/material/bottom-sheet";
import { PrintSheetComponent} from './sheets/manufacture/print/print.component';
import { FiltersComponent } from './sheets/manufacture/filters/filters.component';
import { MatSnackBarModule} from "@angular/material/snack-bar";
import { MatDialogModule} from "@angular/material/dialog";
import { ConfirmDialogComponent} from './dialogs/confirm/confirm.component';
import { ButtonsPipe } from './pipes/buttons.pipe';
import { ManufactureModelsComponent } from './pages/manufacture/models/models.component';
import { ManufactureDetailsComponent } from './pages/manufacture/details/details.component';
import { ManufactureOperationsComponent } from './pages/manufacture/operations/operations.component';
import { WarehousesStockComponent } from './pages/warehouses/stock/stock.component';
import { WarehousesCommonComponent} from "./pages/warehouses/common/common.component";
import { WarehousesWbComponent} from "./pages/warehouses/wb/wb.component";
import { WarehousesOzonComponent} from "./pages/warehouses/ozon/ozon.component";
import { ReportsComponent } from './pages/reports/reports.component';
import { SettingsProductModelsComponent } from './pages/settings/product-models/product-models.component';
import { SettingsOperationPricesComponent } from './pages/settings/operation-prices/operation-prices.component';
import { MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { PrintDialogComponent} from './dialogs/manufacture/print/print.component';
import {AuthService} from "./services/auth.service";
import { TokenInterceptor} from "./tools/token.interceptor";
import { LoginComponent } from './pages/login/login.component';
import { UserListComponent } from './pages/users/list/list.component';
import { UserItemComponent} from './pages/users/item/item.component';
import {MatMenuModule} from "@angular/material/menu";
import {ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { CommonStatusPipe } from './pipes/common-status.pipe';
import { StockOperationsComponent } from './pages/management/stock/stock-operations.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { GoodsComponent } from './pages/management/goods/goods.component';
import { UniversalFormDialogComponent } from './dialogs/universal-form/universal-form.component';
import {MatSelectModule} from "@angular/material/select";
import { GoodsEntityPipe } from './pipes/goods-entity.pipe';
import { StockNavigationPipe } from './pipes/stock-navigation.pipe';
import {UniversalFormSheetComponent} from "./sheets/universal-form/universal-form.component";
import {GoodsWarehousesComponent} from './pages/management/warehouses/warehouses.component';
import { GoodsWarehouseSheetComponent } from './sheets/goods-warehouse-sheet/goods-warehouse-sheet.component';
import { GoodsWarehouseDialogComponent } from './dialogs/goods-warehouse-dialog/goods-warehouse-dialog.component';
import { StockAcceptanceComponent } from './pages/management/stock/acceptance/acceptance.component';
import { StockWriteOffComponent } from './pages/management/stock/write-off/write-off.component';
import { StockCapitalizationComponent } from './pages/management/stock/capitalization/capitalization.component';
import { StockMovementComponent } from './pages/management/stock/movement/movement.component';
import { GoodsCounterpartiesComponent } from './pages/management/counterparties/counterparties.component';
import { SingleGoodsCounterpartyComponent } from './pages/management/counterparties/single-counterparty/single-counterparty.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';
import { GoodsOperationsEntityPipe } from './pipes/goods-operations-entity.pipe';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule, MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats} from "@angular/material/core";
import { OperationItemCardComponent } from './components/operation-item-card/operation-item-card.component';
import { NewDdsOperationDialogComponent } from './dialogs/new-dds-operation-dialog/new-dds-operation-dialog.component';
import { NewDdsOperationSheetComponent } from './sheets/new-dds-operation-sheet/new-dds-operation-sheet.component';
import { MoneyPipe } from './pipes/money.pipe';

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD.MM.YYYY',
  },
};
@NgModule({
  declarations: [
    AppComponent,
    ComplexNavigationComponent,
    DashboardComponent,
    OrdersComponent,
    FinanceComponent,
    WarehouseComponent,
    CommonComponent,
    OzonComponent,
    WbComponent,
    SupplyListComponent,
    SupplyItemComponent,
    DatetimePipe,
    OzonStatusPipe,
    ManufactureProductsComponent,
    PrintSheetComponent,
    FiltersComponent,
    ConfirmDialogComponent,
    ButtonsPipe,
    ManufactureModelsComponent,
    ManufactureDetailsComponent,
    ManufactureOperationsComponent,
    WarehousesStockComponent,
    WarehousesCommonComponent,
    WarehousesWbComponent,
    WarehousesOzonComponent,
    ReportsComponent,
    SettingsProductModelsComponent,
    SettingsOperationPricesComponent,
    PrintDialogComponent,
    LoginComponent,
    UserListComponent,
    UserItemComponent,
    CommonStatusPipe,
    StockOperationsComponent,
    SideNavigationComponent,
    GoodsComponent,
    UniversalFormDialogComponent,
    UniversalFormSheetComponent,
    GoodsEntityPipe,
    StockNavigationPipe,
    GoodsWarehousesComponent,
    GoodsWarehouseSheetComponent,
    GoodsWarehouseDialogComponent,
    StockAcceptanceComponent,
    StockWriteOffComponent,
    StockCapitalizationComponent,
    StockMovementComponent,
    GoodsCounterpartiesComponent,
    SingleGoodsCounterpartyComponent,
    ContactCardComponent,
    GoodsOperationsEntityPipe,
    OperationItemCardComponent,
    NewDdsOperationDialogComponent,
    NewDdsOperationSheetComponent,
    MoneyPipe,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterLink,
        RoutingModule,
        MatIconModule,
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        ScrollingModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatCheckboxModule,
        MatBottomSheetModule,
        MatSnackBarModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatSelectModule,
        MatDatepickerModule,
        MatMomentDateModule,
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
