import {
  createStyles,
  makeStyles,
  MenuItem,
  Theme,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  Button,
} from "@material-ui/core";
import moment from "moment";
import DatePicker from "./DatePicker";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  getAccountsByBankId,
  getAllBanks,
  ISetBudgetDto,
  setAlert,
  setBudget,
} from "../../store/actions";
import { Store } from "../../store/Store";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const BudgetCreateForm = () => {
  const { state, dispatch } = useContext(Store);
  const { banks, selectedBankId } = state.plaid;

  const classes = useStyles();

  const [values, setValues] = useState<ISetBudgetDto>({
    selectedBank: "",
    selectedAccount: "",
    budgetAmount: "",
  });

  useEffect(() => {
    if (banks.length === 0) getAllBanks(dispatch);

    const [bankId, bankName] = values.selectedBank.split(",");

    getAccountsByBankId(dispatch, bankId, bankName);
  }, [values.selectedBank, banks.length, dispatch]);

  // Date picker state
  const [fromDate, setFromDate] = React.useState<string>(
    moment().subtract(30, "days").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = React.useState<string>(
    moment().format("YYYY-MM-DD")
  );

  // handle form change
  const handleChange = (prop: keyof ISetBudgetDto) => (
    event: React.ChangeEvent<{ value: any }>
  ) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSetBudget = () => {
    if (!values.budgetAmount) {
      setAlert(dispatch, "warning", "Must enter a budget amount");
      return;
    }

    if (!values.selectedBank) {
      setAlert(dispatch, "warning", "Must select a bank");
      return;
    }

    if (!values.selectedAccount) {
      setAlert(dispatch, "warning", "Must select an account");
      return;
    }

    setBudget(dispatch, fromDate, toDate, values);
  };

  // * retrieved accounts associated with the selected bank
  const selectedBankAccounts = state.plaid.banks.find(
    (bank) => bank.institutionId === selectedBankId
  )?.accounts;

  return banks.length > 0 ? (
    <Fragment>
      <Grid container justify="center">
        <FormControl className={classes.formControl}>
          <InputLabel id="bank-selector">Bank Name</InputLabel>
          <Select
            labelId="bank-selector"
            id="bank-selector-helper"
            value={values.selectedBank}
            onChange={handleChange("selectedBank")}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {banks.map((bank) => (
              <MenuItem
                key={bank.id}
                value={`${bank.institutionId}, ${bank.institutionName}`}
              >
                {bank.institutionName}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select bank institution name</FormHelperText>
        </FormControl>

        {selectedBankAccounts && (
          <FormControl className={classes.formControl}>
            <InputLabel id="account-selector">Account Name</InputLabel>
            <Select
              labelId="account-selector"
              id="account-selector-helper"
              value={values.selectedAccount}
              onChange={handleChange("selectedAccount")}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {selectedBankAccounts.map((account) => (
                <MenuItem
                  key={account.account_id}
                  value={`${account.account_id}, ${account.name}`}
                >
                  {account.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select bank institution name</FormHelperText>
          </FormControl>
        )}
      </Grid>

      <DatePicker
        setFromDate={setFromDate}
        setToDate={setToDate}
        fromDate={fromDate}
        toDate={toDate}
      />

      <Grid container justify="center">
        <FormControl>
          <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
          <Input
            id="standard-adornment-amount"
            type="number"
            value={values.budgetAmount}
            onChange={handleChange("budgetAmount")}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
        <Button
          onClick={handleSetBudget}
          color="primary"
          size="small"
          variant="contained"
        >
          Set Budget
        </Button>
      </Grid>
    </Fragment>
  ) : (
    <h3>Loading...</h3>
  );
};

export default BudgetCreateForm;
