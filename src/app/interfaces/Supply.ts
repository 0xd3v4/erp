export interface ISupply {
  closed: boolean;
  closed_at: string;
  created_at: string;
  id: number;
  label: string;
  ozon_supply_id: string;
  pallets_quantity: string;
  type: number;
  warehouse: string;
  warehouse_id: number;
  wb_id_alderson: string
  wb_id_kholkina: string;
  items?: any[];
  realItems?: any[];
}
