export interface IState {
  alert: IAlert[];
  auth: IAuth;
  plaid: IPlaid;
}

export interface IAlert {
  type: "error" | "warning" | "info" | "success";
  id: string;
  msg?: string;
}

export interface IAuth {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface IUser {
  id: string;
  email: string;
  accessToken: string | null;
}

export interface IPlaid {
  linkToken: string | null;
  banks: IBank[];
  selectedBankIdLoading: boolean;
  selectedBankId: string;
  selectedBankName: any;
  selectedAccountId: string;
  selectedAccountName: string;
  transactions: ITransaction[];
  transactionsLoading: boolean;
  spendingsData: ISpendingsData;
  spendingsLoading: boolean;

  budgets: IBudget[];
}

export interface IBank {
  id: string;
  userId: string;
  accessToken: string;
  itemId: string;
  institutionId: string;
  institutionName?: string;
  accountName?: string;
  accountType?: string;
  accountSubType?: string;

  accounts: IAccount[];
}

export interface IAccount {
  account_id: string;
  balances: {
    available: number;
    current: number;
    iso_currency_code: string;
    limit: any;
    unofficial_currency_code: any;
  };
  mask: string;
  name: string;
  official_name: string;
  subtype: string;
  type: string;
}

export enum BudgetMet {
  "No",
  "Yes",
  "In Progress",
}
export interface IBudget {
  userId: string;
  institutionId: string;
  accountId: string;
  accountName: string;
  fromDate: string;
  toDate: string;
  goalAmount: number;
  spentAmount: number;
  budgetMet: BudgetMet;
  id: string;
}

export interface ITransaction {
  account_id: string;
  account_owner: any;
  amount: number;
  authorized_date: null;
  category: string[];
  category_id: string;
  date: string;
  iso_currency_code: string;
  location: {
    address: string;
    city: string;
    country: string;
    lat: any;
    lon: any;
    postal_code: any;
    region: any;
    store_number: any;
  };
  merchant_name: string;
  name: string;
  payment_channel: string;
  payment_meta: {
    by_order_of: any;
    payee: any;
    payer: any;
    payment_method: any;
    payment_processor: any;
    ppd_id: any;
    reason: any;
    reference_number: any;
  };
  pending: boolean;
  pending_transaction_id: any;
  transaction_code: any;
  transaction_id: string;
  transaction_type: string;
  unofficial_currency_code: any;
}

export interface ISpendingsData {
  dateInterval: string;
  data: {
    name: string;
    y: number;
  }[];
}
