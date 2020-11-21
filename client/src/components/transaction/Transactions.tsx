import React, { useContext, useEffect } from "react";
import { Store } from "../../store/Store";
import { useHistory } from "react-router-dom";

// Material UI Imports
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Component Imports
import TransactionInterval from "./TransactionInterval";
import TransactionTable from "./TransactionTable";

const useStyles = makeStyles({
  transactionTable: {
    marginTop: "1.5rem",
  },
});

export const Transactions = () => {
  const { state } = useContext(Store);
  const classes = useStyles();

  const {
    selectedBankName,
    selectedAccountName,
    transactionsLoading,
  } = state.plaid;

  const history = useHistory();

  useEffect(() => {
    if ((!selectedBankName || !selectedAccountName) && !transactionsLoading) {
      history.push("/profile");
    }
  }, [history, selectedAccountName, selectedBankName, transactionsLoading]);

  return transactionsLoading ? (
    <h3>Loading...</h3>
  ) : (
    <Container>
      <TransactionInterval />
      <div className={classes.transactionTable}>
        <TransactionTable />
      </div>
    </Container>
  );
};
