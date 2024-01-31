import {EDdsType} from "../enums/Dds";
import {Observable} from "rxjs";

export interface IDdsDialogData {
  type: EDdsType;
  counterparty: any;
  disableEditCounterparty?: boolean;
  wallet: any;
  id: string;
  date: string;
  wallets$: Observable<any>;
  paymentCategories$: Observable<any>;
  counterpartyPayments$: Observable<any>;

}
export interface IPaymentData {
  category: string;
  category_id: number;
  client_id: number;
  client_name: string;
  comment: string;
  counterparty_alt: string;
  created_at: string;
  id: number;
  order_id: null;
  paid_sum: number;
  parent_payment_id: number;
  payment_date: string;
  payment_type: string;
  payment_type_id: number;
  user_name: string;
  wallet: string;
  wallet_id: number;
}
