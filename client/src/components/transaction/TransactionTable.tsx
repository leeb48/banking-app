import React, { Fragment, useContext } from "react";
import { Store } from "../../store/Store";

// Material UI Imports
import { Hidden, Typography } from "@material-ui/core";

import MaterialTable from "material-table"; // https://mbrn.github.io/material-table/#/

const TransactionTable = () => {
  const { state } = useContext(Store);

  const { transactions, selectedBankName, selectedAccountName } = state.plaid;

  const transactionsColumns: any[] = [
    { title: "Date", field: "date", type: "date", defaultSort: "desc" },
    { title: "Name", field: "name" },
    { title: "Amount", field: "amount", type: "numeric" },
    { title: "Category", field: "category" },
    { title: "Status", field: "status" },
    { title: "Payment Channel", field: "paymentChannel" },
  ];

  const transactionsData: any[] = [];
  transactions.forEach((transaction) => {
    transactionsData.push({
      date: transaction.date,
      name: `${transaction.merchant_name} / ${transaction.name}`,
      amount: transaction.amount,
      category: transaction.category[0],
      status: transaction.pending ? "pending" : "complete",
      paymentChannel: transaction.payment_channel,
    });
  });

  // Mobile Responsive Table Header
  const tableHeader = (
    <Fragment>
      <Hidden smDown>
        <Typography variant="h4">Transactions</Typography>
      </Hidden>

      <Hidden smUp>
        <Typography variant="caption">Transactions</Typography>
      </Hidden>
    </Fragment>
  );

  return (
    <Fragment>
      <Typography variant="h5">
        {selectedBankName} / {selectedAccountName}
      </Typography>
      <MaterialTable
        columns={transactionsColumns}
        data={transactionsData}
        title={tableHeader}
        options={{
          pageSize: 10,
        }}
      />
    </Fragment>
  );
};

export default TransactionTable;
