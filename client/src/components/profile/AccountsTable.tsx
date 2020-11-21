import React, { useContext } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { IBank } from "../../store/interfaces";
import { Link } from "react-router-dom";
import { Store } from "../../store/Store";
import {
  getTransactions,
  setTransactionsLoading,
} from "../../store/actions/plaid.actions";
import { Button, Hidden } from "@material-ui/core";

interface IAccountsTableProps {
  bank: IBank;
}

export const AccountsTable = ({ bank }: IAccountsTableProps) => {
  const { dispatch } = useContext(Store);

  const handleLink = (bankId: string, accountId: string) => {
    setTransactionsLoading(dispatch);
    getTransactions(dispatch, bankId, accountId);
  };

  return bank.accounts ? (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Account Name</TableCell>
            <TableCell align="right">Available Balance</TableCell>
            <TableCell align="right">Current Balance</TableCell>
            <TableCell align="right">Account Type</TableCell>
            <Hidden xsDown>
              <TableCell align="right">Currency</TableCell>
            </Hidden>
          </TableRow>
        </TableHead>

        <TableBody>
          {bank.accounts.map((account) => (
            <TableRow key={account.account_id}>
              <TableCell component="th" scope="row">
                <Button variant="outlined" color="primary">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/transactions"
                    onClick={() =>
                      handleLink(bank.institutionId, account.account_id)
                    }
                  >
                    {account.name}
                  </Link>
                </Button>
              </TableCell>
              <TableCell align="right">${account.balances.available}</TableCell>
              <TableCell align="right">${account.balances.current}</TableCell>
              <TableCell align="right">
                {account.subtype.toUpperCase()}
              </TableCell>

              <Hidden xsDown>
                <TableCell align="right">
                  {account.balances.iso_currency_code}
                </TableCell>
              </Hidden>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
};
