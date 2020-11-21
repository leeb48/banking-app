import { IState } from "./interfaces";
import { Actions, AlertActionTypes, AuthActionTypes } from "../store/actions";
import { PlaidActionTypes } from "./actions/plaid.actions";

export const initialState: IState = {
  alert: [],
  auth: {
    user: null,
    isAuthenticated: false,
    loading: true,
  },
  plaid: {
    linkToken: null,
    banks: [],
    selectedBankIdLoading: true,
    selectedBankId: "",
    selectedBankName: "",
    selectedAccountId: "",
    selectedAccountName: "",
    transactions: [],
    transactionsLoading: false,
    spendingsData: {
      dateInterval: "",
      data: [],
    },
    spendingsLoading: false,

    budgets: [],
  },
};

export const reducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    // *----------------------------------------------
    case AlertActionTypes.set_alert:
      return {
        ...state,
        alert: [action.payload, ...state.alert],
      };
    case AlertActionTypes.remove_alert:
      return {
        ...state,
        alert: state.alert.filter((alert) => alert.id !== action.payload),
      };

    // *----------------------------------------------
    case AuthActionTypes.register_user:
    case AuthActionTypes.login_user:
    case AuthActionTypes.get_current_user:
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload,
          isAuthenticated: true,
          loading: false,
        },
      };
    case AuthActionTypes.logout_user:
      return {
        ...state,
        auth: {
          ...state.auth,
          user: null,
          isAuthenticated: false,
          loading: true,
        },
        plaid: {
          ...state.plaid,
          linkToken: null,
          banks: [],
          selectedBankIdLoading: true,
          selectedBankId: "",
          selectedBankName: "",
          selectedAccountId: "",
          selectedAccountName: "",
          transactions: [],
          transactionsLoading: false,
          spendingsData: [],
          spendingsLoading: false,

          budgets: [],
        },
      };
    // *----------------------------------------------
    case PlaidActionTypes.get_link_token:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          linkToken: action.payload,
        },
      };
    case PlaidActionTypes.add_bank:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          banks: [...state.plaid.banks, action.payload],
        },
      };
    case PlaidActionTypes.get_all_banks:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          banks: [...state.plaid.banks, ...action.payload],
        },
      };
    case PlaidActionTypes.get_accounts_by_bank_id:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          banks: state.plaid.banks.map((bank) =>
            bank.institutionId === action.payload.bankId
              ? {
                  ...bank,
                  accounts: action.payload.accounts,
                }
              : bank
          ),
          selectedBankIdLoading: false,
          selectedBankId: action.payload.bankId,
          selectedBankName: action.payload.bankName,
        },
      };

    case PlaidActionTypes.set_transactions_loading:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          transactionsLoading: action.payload,
        },
      };

    case PlaidActionTypes.get_transactions:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          transactionsLoading: false,
          selectedAccountId: action.payload.accountId,
          selectedAccountName: action.payload.accountName,
          transactions: action.payload.transactions,
        },
      };

    case PlaidActionTypes.set_spendings_loading:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          spendingsLoading: action.payload,
        },
      };

    case PlaidActionTypes.get_spendings:
      console.log(action.payload);
      return {
        ...state,
        plaid: {
          ...state.plaid,
          spendingsData: action.payload,
          spendingsLoading: false,
        },
      };

    case PlaidActionTypes.remove_bank_account:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          banks: state.plaid.banks.filter((bank) => bank.id !== action.payload),
        },
      };
    default:
      return state;

    // *----------------------------------------------
    case PlaidActionTypes.get_all_budgets:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          budgets: action.payload,
        },
      };
    case PlaidActionTypes.remove_budget:
      return {
        ...state,
        plaid: {
          ...state.plaid,
          budgets: state.plaid.budgets.filter(
            (budget) => budget.id !== action.payload
          ),
        },
      };
  }
};
