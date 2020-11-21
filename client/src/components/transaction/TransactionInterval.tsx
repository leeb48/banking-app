import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import { Store } from "../../store/Store";
import { makeStyles } from "@material-ui/core/styles";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import {
  getSpendings,
  getTransactions,
  setSpendingsLoading,
} from "../../store/actions/plaid.actions";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  datePickers: {
    textAlign: "center",
  },
  removeLinkStyles: {
    color: "inherit",
    textDecoration: "none",
  },
});

const TransactionInterval = () => {
  const { state, dispatch } = useContext(Store);

  const classes = useStyles();

  const { selectedBankId, selectedAccountId } = state.plaid;

  // Date picker
  const [fromDate, setFromDate] = React.useState<string>(
    moment().subtract(30, "days").format("YYYY-MM-DD")
  );

  const [toDate, setToDate] = React.useState<string>(
    moment().format("YYYY-MM-DD")
  );

  const handleFromDateChange = (date: Date | null) => {
    // format the date to 'YYYY-MM-DD'
    const dateString = `${date?.getFullYear()}-${(
      "0" +
      (date!.getMonth() + 1)
    ).slice(-2)}-${("0" + date?.getDate()).slice(-2)}`;

    setFromDate(dateString);
  };

  const handleToDateChange = (date: Date | null) => {
    // format the date to 'YYYY-MM-DD'
    const dateString = `${date?.getFullYear()}-${(
      "0" +
      (date!.getMonth() + 1)
    ).slice(-2)}-${("0" + date?.getDate()).slice(-2)}`;

    setToDate(dateString);
  };

  const handleTransactionInterval = () => {
    getTransactions(
      dispatch,
      selectedBankId,
      selectedAccountId,
      fromDate,
      toDate
    );
  };

  const handleShowSpending = () => {
    setSpendingsLoading(dispatch);
    getSpendings(dispatch, selectedBankId, selectedAccountId, fromDate, toDate);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container alignItems="center" justify="center">
        <Grid className={classes.datePickers} item>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="from-date-picker"
            label="Select From Date"
            value={fromDate}
            onChange={handleFromDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="to-date-picker"
            label="Select To Date"
            value={toDate}
            onChange={handleToDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </Grid>
        <Grid item>
          <Button
            onClick={handleTransactionInterval}
            variant="outlined"
            color="primary"
          >
            Get Interval
          </Button>
          <Button
            variant="outlined"
            onClick={handleShowSpending}
            color="secondary"
          >
            <Link className={classes.removeLinkStyles} to="/spendings">
              Show Spendings
            </Link>
          </Button>
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default TransactionInterval;
