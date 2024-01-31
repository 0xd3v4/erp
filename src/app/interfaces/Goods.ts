// ===== GOODS =====
import {IPaymentData} from "./Dds";

export interface IGoodsItem {
  id: number;
  item_id?: string;

  name: string;
  sku: string;
  units_name: string;
  category_name: string;
  subcategory_name: string;
  counterparty_name: string;
  comment: string;

  min_balance: number;
  units: number;
  category: number;
  subcategory: number;
  counterparty: number;

  value?: {
    price: number;
    quantity: number;
    vat: number;
    overheads?: number;
  }
  total_quantity?: number;
  total_price?: number;
}
export interface IGoodsCategory {
  id: number;
  name: string;
}
export interface IGoodsSubcategory extends IGoodsCategory {
  category_id: number;
  category_name: string;
}
export interface IGoodsUnit {
  id: number;
  name: string;
}
// ===== WAREHOUSES =====
export interface IGoodsWarehouse {
  id: number;
  common_warehouse_id: number;
  name: string;
  common_warehouse_name: string;
}
export interface ICommonWarehouseData {
  name: string;
  id: number;
  goodsWarehouses: IGoodsWarehouse[];
}
// ===== COUNTERPARTIES =====
export interface IGoodsCounterparty {
  client_id: number;
  full_name: string;
  comment: string;
  credentials: string
  contacts: Partial<IGoodsCounterpartyContacts>[];
  credentials_extended: IGoodsCounterpartyCredentials;
}
export interface IGoodsCounterpartyContacts {
  id: number;
  counterparty_id: number;
  phone: string;
  name: string;
}
export interface IGoodsCounterpartyCredentials {
  id: number;
  counterparty_id: number;
  type: number;
  inn: string;
  kpp: string;
  ogrn: string;
  okpo: string;
  address: string;
  date: string;
}
// ===== OPERATIONS =====
export interface IStockOperation {
  id: string;
  type: number;
  created_at: string;
  warehouse_name: string;
  common_warehouse_name: string;
  warehouse_id: string;
  comment: string;
  items: IGoodsItem[];
  payments?: Partial<IPaymentData>[];
  counterparty_name: string;
  counterparty_id: string;
  sum: number;
  overheads: number;
  incoming: string;
}
export interface IAcceptanceOperation extends IStockOperation {
  counterparty_name: string;
  counterparty_id: string;
  total_price: number;
}
export interface ICapitalizationOperation extends IStockOperation {

}
export interface IMovementOperation extends IStockOperation {
  targetWarehouse_id: string;
}
export interface IWriteOffOperation extends IStockOperation {

}

export interface IGoodsAggregate {
  id: string;
  name: string;
  total_price: number;
  total_quantity: number;
}
