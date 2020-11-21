import { Dispatch } from "react";
import { axiosConfig } from "../../config/axios.config";
import moment from "moment";
import {
  IAddBankAction,
  IGetAccountsByBankIdAction,
  IGetAllBanksAction,
  IGetAllBudgets,
  IGetLinkTokenAction,
  IGetSpendingsAction,
  IGetTransactionsAction,
  IRemoveBankAccountAction,
  IRemoveBudgetAction,
  ISetBudgetDto,
  ISetSelectedBankIdLoading,
  ISetSpendingsLoadingAction,
  ISetTransactionsLoadingAction,
} from "./plaid.interfaces";
import { IRemoveAlertAction, ISetAlertAction } from "./alert.interfaces";
import { setAlert } from "./alert.actions";

export enum PlaidActionTypes {
  get_link_token = "plaid/link-token",
  add_bank = "plaid/add-bank",
  get_all_banks = "plaid/get-all-banks",
  set_selected_bank_id_loading = "plaid/set-selected-bank-id-loading",
  get_accounts_by_bank_id = "plaid/get-accounts-by-bank-id",
  remove_bank_account = "plaid/remove-bank-account",
  set_transactions_loading = "plaid/set-transaction-loading",
  get_transactions = "plaid/get-transactions",
  set_spendings_loading = "plaid/set-spendings-loading",
  get_spendings = "plaid/get-spendings",
  get_all_budgets = "plaid/get-all-budgets",
  remove_budget = "plaid/remove-budget",
}

export type PlaidActions =
  | IGetLinkTokenAction
  | IAddBankAction
  | IGetAllBanksAction
  | ISetSelectedBankIdLoading
  | IGetAccountsByBankIdAction
  | ISetTransactionsLoadingAction
  | IGetTransactionsAction
  | ISetSpendingsLoadingAction
  | IGetSpendingsAction
  | IGetAllBudgets
  | IRemoveBudgetAction
  | IRemoveBankAccountAction;

export const getLinkToken = async (dispatch: Dispatch<IGetLinkTokenAction>) => {
  try {
    const res = await axiosConfig.get("/plaid/get-link-token");

    return dispatch({
      type: PlaidActionTypes.get_link_token,
      payload: res.data,
    });
  } catch (error) {
    console.log(error.response.data.errors);
  }
};

export const addBank = async (
  dispatch: Dispatch<IAddBankAction | ISetAlertAction | IRemoveAlertAction>,
  publicToken: string,
  metadata: any
) => {
  try {
    const res = await axiosConfig.post("/plaid/add-account", {
      publicToken,
      metadata,
    });

    setAlert(dispatch, "success", "Bank Added");

    return dispatch({
      type: PlaidActionTypes.add_bank,
      payload: res.data,
    });
  } catch (error) {
    console.log(error.response.data.errors);
  }
};

export const getAllBanks = async (dispatch: Dispatch<IGetAllBanksAction>) => {
  try {
    const res = await axiosConfig.get("/plaid/get-accounts");

    return dispatch({
      type: PlaidActionTypes.get_all_banks,
      payload: res.data,
    });
  } catch (error) {}
};

export const setSelectedBankIdLoading = (
  dispatch: Dispatch<ISetSelectedBankIdLoading>
) => {
  return dispatch({
    type: PlaidActionTypes.set_selected_bank_id_loading,
    payload: true,
  });
};

export const getAccountsByBankId = async (
  dispatch: Dispatch<IGetAccountsByBankIdAction>,
  bankId: string,
  bankName?: string
) => {
  try {
    const res = await axiosConfig.get(`/plaid/get-accounts/${bankId}`);

    return dispatch({
      type: PlaidActionTypes.get_accounts_by_bank_id,
      payload: {
        bankId,
        bankName,
        accounts: res.data,
      },
    });
  } catch (error) {}
};

export const setTransactionsLoading = (
  dispatch: Dispatch<ISetTransactionsLoadingAction>
) => {
  return dispatch({
    type: PlaidActionTypes.set_transactions_loading,
    payload: true,
  });
};

export const getTransactions = async (
  dispatch: Dispatch<IGetTransactionsAction>,
  bankId: string,
  accountId: string,
  from?: string,
  to?: string
) => {
  try {
    // retrieve the last 30 days transaction by default
    if (!from || !to) {
      const now = moment();
      to = now.format("YYYY-MM-DD");
      from = now.subtract(30, "days").format("YYYY-MM-DD");
    }

    const res = await axiosConfig.get(
      `/plaid/get-transactions/${bankId}/${accountId}/${from}/${to}`
    );

    return dispatch({
      type: PlaidActionTypes.get_transactions,
      payload: res.data,
    });
  } catch (error) {}
};

export const setSpendingsLoading = (
  dispatch: Dispatch<ISetSpendingsLoadingAction>
) => {
  return dispatch({
    type: PlaidActionTypes.set_spendings_loading,
    payload: true,
  });
};

export const getSpendings = async (
  dispatch: Dispatch<IGetSpendingsAction>,
  bankId: string,
  accountId: string,
  from?: string,
  to?: string
) => {
  // retrieve the last 30 days transaction by default
  if (!from || !to) {
    const now = moment();
    to = now.format("YYYY-MM-DD");
    from = now.subtract(30, "days").format("YYYY-MM-DD");
  }

  const res = await axiosConfig.get(
    `/plaid/get-spending/${bankId}/${accountId}/${from}/${to}`
  );

  return dispatch({
    type: PlaidActionTypes.get_spendings,
    payload: res.data,
  });
};

export const setBudget = async (
  dispatch: Dispatch<ISetAlertAction | IRemoveAlertAction>,
  fromDate: string,
  toDate: string,
  budgetFormData: ISetBudgetDto
) => {
  await axiosConfig.post("/plaid/set-budget", {
    fromDate,
    toDate,
    budgetFormData,
  });

  setAlert(dispatch, "success", "Budget Created");
};

export const getAllBudgets = async (dispatch: Dispatch<IGetAllBudgets>) => {
  const res = await axiosConfig("/plaid/get-budgets");

  return dispatch({
    type: PlaidActionTypes.get_all_budgets,
    payload: res.data,
  });
};

export const removeBudget = async (
  dispatch: Dispatch<
    IRemoveBudgetAction | ISetAlertAction | IRemoveAlertAction
  >,
  budgetId: string
) => {
  await axiosConfig.delete(`/plaid/remove-budget/${budgetId}`);

  setAlert(dispatch, "success", "Budget Removed");

  return dispatch({
    type: PlaidActionTypes.remove_budget,
    payload: budgetId,
  });
};

export const removeBankAccount = async (
  dispatch: Dispatch<
    IRemoveBankAccountAction | ISetAlertAction | IRemoveAlertAction
  >,
  bankAccountId: string
) => {
  try {
    if (window.confirm("Are you sure you want to remove this account?")) {
      await axiosConfig.delete(`/plaid/accounts/${bankAccountId}`);

      setAlert(dispatch, "success", "Bank Removed");

      return dispatch({
        type: PlaidActionTypes.remove_bank_account,
        payload: bankAccountId,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
