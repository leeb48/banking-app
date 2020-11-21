import { makeStyles, Tab, Tabs, Theme, AppBar } from "@material-ui/core";
import React, { Fragment, useContext } from "react";
import { getAccountsByBankId } from "../../store/actions/plaid.actions";

import { Store } from "../../store/Store";
import { IBank } from "../../store/interfaces";

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

interface IBankTabsProps {
  banks: IBank[];
}

const BankTabs = ({ banks }: IBankTabsProps) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const { dispatch } = useContext(Store);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const renderBankTabs = (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable banks tab"
        >
          {banks.map((bank, idx) => (
            <Tab
              label={bank.institutionName}
              onClick={() =>
                handleGetAccounts(bank.institutionId, bank.institutionName)
              }
              key={bank.id}
              {...a11yProps(idx)}
            />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );

  // * sends action to display the selected bank account
  const handleGetAccounts = (bankId: string, bankName?: string) => {
    getAccountsByBankId(dispatch, bankId, bankName);
  };

  return (
    <Fragment>
      <div>{renderBankTabs}</div>
    </Fragment>
  );
};

export default BankTabs;
