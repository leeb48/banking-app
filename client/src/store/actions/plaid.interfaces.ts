import {
  IAccount,
  IBank,
  IBudget,
  ISpendingsData,
  ITransaction,
} from "../interfaces";
import { PlaidActionTypes } from "./plaid.actions";

export interface IGetLinkTokenAction {
  type: PlaidActionTypes.get_link_token;
  payload: string;
}

export interface IAddBankAction {
  type: PlaidActionTypes.add_bank;
  payload: IBank;
}

export interface IGetAllBanksAction {
  type: PlaidActionTypes.get_all_banks;
  payload: IBank[];
}

export interface ISetSelectedBankIdLoading {
  type: PlaidActionTypes.set_selected_bank_id_loading;
  payload: boolean;
}

export interface IGetAccountsByBankIdAction {
  type: PlaidActionTypes.get_accounts_by_bank_id;
  payload: {
    bankId: string;
    bankName: any;
    accounts: IAccount[];
  };
}

export interface IRemoveBankAccountAction {
  type: PlaidActionTypes.remove_bank_account;
  payload: string;
}

export interface ISetTransactionsLoadingAction {
  type: PlaidActionTypes.set_transactions_loading;
  payload: boolean;
}

export interface IGetTransactionsAction {
  type: PlaidActionTypes.get_transactions;
  payload: {
    accountName: string;
    accountId: string;
    transactions: ITransaction[];
  };
}

export interface ISetSpendingsLoadingAction {
  type: PlaidActionTypes.set_spendings_loading;
  payload: boolean;
}

export interface IGetSpendingsAction {
  type: PlaidActionTypes.get_spendings;
  payload: any;
}

export interface IGetAllBudgets {
  type: PlaidActionTypes.get_all_budgets;
  payload: IBudget[];
}

export interface IRemoveBudgetAction {
  type: PlaidActionTypes.remove_budget;
  payload: string;
}

// DTO
export interface ISetBudgetDto {
  selectedBank: string;
  selectedAccount: string;
  budgetAmount: string;
}
