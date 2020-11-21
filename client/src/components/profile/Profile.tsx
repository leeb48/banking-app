import { Container, Fab, Grid, makeStyles } from "@material-ui/core";
import React, { Fragment, useContext, useEffect } from "react";
import { getAllBanks, getLinkToken } from "../../store/actions/plaid.actions";
import { Store } from "../../store/Store";
import { AccountsTable } from "./AccountsTable";

// Import Components
import BankTabs from "./BankTabs";
import LinkPlaid from "./LinkPlaid";
import RemoveBankMenu from "./RemoveBankMenu";

import { ReactComponent as BudgetIcon } from "../../img/budget.svg";
import { Link, Redirect } from "react-router-dom";

const useStyles = makeStyles({
  linkPlaidBtn: {
    margin: "2rem 0 2rem 0",
  },
  svg: {
    width: "2.5rem",
    height: "2.5rem",
    marginRight: "8px",
    fill: "white",
  },
  budgetBtn: {
    backgroundColor: "#008000",
    color: "white",
    "&:hover": {
      backgroundColor: "#006400",
    },
  },
});

const Profile = () => {
  const { state, dispatch } = useContext(Store);
  const classes = useStyles();

  useEffect(() => {
    getLinkToken(dispatch);

    if (state.plaid.banks.length === 0) {
      getAllBanks(dispatch);
    }
  }, [dispatch, state.plaid.banks.length]);

  // * retrieved accounts associated with the selected bank
  const { selectedBankId } = state.plaid;
  const selectedBank = state.plaid.banks.find(
    (bank) => bank.institutionId === selectedBankId
  );

  return state.auth.isAuthenticated ? (
    <Container>
      <Grid className={classes.linkPlaidBtn} container justify="space-around">
        <LinkPlaid />
        <Fab
          className={classes.budgetBtn}
          component={Link}
          to="/budget"
          variant="extended"
        >
          <BudgetIcon className={classes.svg} /> Budget
        </Fab>

        <RemoveBankMenu />
      </Grid>

      {state.plaid.banks.length > 0 ? (
        <Fragment>
          {<BankTabs banks={state.plaid.banks} />}

          {selectedBank && <AccountsTable bank={selectedBank} />}
        </Fragment>
      ) : null}
    </Container>
  ) : (
    <Redirect to="/" />
  );
};

export default Profile;
