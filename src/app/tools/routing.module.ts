import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "../pages/dashboard/dashboard.component";
import {OrdersComponent} from "../pages/orders/orders.component";
import {CommonComponent} from "../pages/products/common/common.component";
import {OzonComponent} from "../pages/products/ozon/ozon.component";
import {WbComponent} from "../pages/products/wb/wb.component";
import {SupplyListComponent} from "../pages/supply/list/list.component";
import {SupplyItemComponent} from "../pages/supply/item/item.component";
import {ManufactureProductsComponent} from "../pages/manufacture/products/products.component";
import {FinanceComponent} from "../pages/finance/finance.component";
import {ManufactureModelsComponent} from "../pages/manufacture/models/models.component";
import {ManufactureDetailsComponent} from "../pages/manufacture/details/details.component";
import {ManufactureOperationsComponent} from "../pages/manufacture/operations/operations.component";
import {WarehousesWbComponent} from "../pages/warehouses/wb/wb.component";
import {WarehousesStockComponent} from "../pages/warehouses/stock/stock.component";
import {WarehousesCommonComponent} from "../pages/warehouses/common/common.component";
import {WarehousesOzonComponent} from "../pages/warehouses/ozon/ozon.component";
import {ReportsComponent} from "../pages/reports/reports.component";
import {SettingsProductModelsComponent} from "../pages/settings/product-models/product-models.component";
import {SettingsOperationPricesComponent} from "../pages/settings/operation-prices/operation-prices.component";
import {AuthGuard} from "./auth.guard";
import {LoginComponent} from "../pages/login/login.component";
import {StockOperationsComponent} from "../pages/management/stock/stock-operations.component";
import {GoodsComponent} from "../pages/management/goods/goods.component";
import {GoodsWarehousesComponent} from "../pages/management/warehouses/warehouses.component";
import {StockAcceptanceComponent} from "../pages/management/stock/acceptance/acceptance.component";
import {GoodsCounterpartiesComponent} from "../pages/management/counterparties/counterparties.component";
import {
  SingleGoodsCounterpartyComponent
} from "../pages/management/counterparties/single-counterparty/single-counterparty.component";
import {StockCapitalizationComponent} from "../pages/management/stock/capitalization/capitalization.component";
import {StockMovementComponent} from "../pages/management/stock/movement/movement.component";
import {StockWriteOffComponent} from "../pages/management/stock/write-off/write-off.component";

const routes: Routes = [

  { path: 'stock/operations', component: StockOperationsComponent },
  { path: 'stock/operations/acceptance/:id', component: StockAcceptanceComponent },
  { path: 'stock/operations/capitalization/:id', component: StockCapitalizationComponent },
  { path: 'stock/operations/movement/:id', component: StockMovementComponent },
  { path: 'stock/operations/write-off/:id', component: StockWriteOffComponent },

  { path: 'stock/goods', component: GoodsComponent },
  { path: 'stock/warehouses', component: GoodsWarehousesComponent },

  { path: 'stock/counterparties', component: GoodsCounterpartiesComponent },
  { path: 'stock/counterparties/:id', component: SingleGoodsCounterpartyComponent },

  { path: '', component: StockOperationsComponent },
  { path: 'supply/:number', component: SupplyItemComponent },

  // { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  // { path: 'dashboard', component: DashboardComponent },
  // { path: 'orders', component: OrdersComponent },
  // { path: 'finance', component: FinanceComponent },
  // { path: 'reports', component: ReportsComponent },

  // { path: 'login', component: LoginComponent },

  // { path: 'products/common', component: CommonComponent },
  // { path: 'products/ozon', component: OzonComponent },
  // { path: 'products/wb', component: WbComponent },

  // { path: 'manufacture/products', component: ManufactureProductsComponent },
  // { path: 'manufacture/models', component: ManufactureModelsComponent },
  // { path: 'manufacture/details', component: ManufactureDetailsComponent },
  // { path: 'manufacture/operations', component: ManufactureOperationsComponent },

  // { path: 'warehouses/wb', component: WarehousesWbComponent },
  // { path: 'warehouses/ozon', component: WarehousesOzonComponent },
  // { path: 'warehouses/common', component: WarehousesCommonComponent },
  // { path: 'warehouses/stock', component: WarehousesStockComponent },

  // { path: 'settings/users', component: SettingsUsersComponent },
  // { path: 'settings/product-models', component: SettingsProductModelsComponent },
  // { path: 'settings/operation-prices', component: SettingsOperationPricesComponent }, //, canActivate: [AuthGuard]



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
