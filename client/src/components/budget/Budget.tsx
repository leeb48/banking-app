import React, { useContext, useEffect } from "react";
import clsx from "clsx";

// Material UI Imports
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Button } from "@material-ui/core";

import { Link, Redirect } from "react-router-dom";

import { Store } from "../../store/Store";
import {
  getAllBanks,
  getAllBudgets,
  getSpendings,
  removeBudget,
  setSpendingsLoading,
} from "../../store/actions";

// Icon Imports
import AddIcon from "@material-ui/icons/Add";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

interface Data {
  dateInterval: string;
  accountName: string;
  goalAmount: number;
  spentAmount: number;
  budgetMet: string;
  budgetId: string;
  accountId: string;
  institutionId: string;
}

function createData(
  dateInterval: string,
  accountName: string,
  goalAmount: number,
  spentAmount: number,
  budgetMet: string,
  budgetId: string,
  accountId: string,
  institutionId: string
): Data {
  return {
    dateInterval,
    accountName,
    goalAmount,
    spentAmount,
    budgetMet,
    budgetId,
    accountId,
    institutionId,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "dateInterval",
    numeric: false,
    disablePadding: true,
    label: "Date Interval (From / To)",
  },
  {
    id: "accountName",
    numeric: false,
    disablePadding: true,
    label: "Account Name",
  },
  {
    id: "goalAmount",
    numeric: true,
    disablePadding: false,
    label: "Goal Amount",
  },
  {
    id: "spentAmount",
    numeric: true,
    disablePadding: false,
    label: "Spent Amount",
  },
  {
    id: "budgetMet",
    numeric: true,
    disablePadding: false,
    label: "Budget Met",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="default" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "center"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

/**
 * * This component fetches all the banks that the user has linked with
 * * the account. It also fetches the accounts when user selects a bank
 * * to create a new budget.
 */
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();

  const { state, dispatch } = useContext(Store);
  const { banks } = state.plaid;

  useEffect(() => {
    if (banks.length === 0) getAllBanks(dispatch);
  }, [banks.length, dispatch]);

  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        My Budgets
      </Typography>
      <Tooltip title="Add Budget">
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          component={Link}
          to="/create-budget"
          aria-label="filter list"
        >
          <AddIcon style={{ fill: "green", width: "3rem", height: "3rem" }} />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    row: {
      cursor: "pointer",
      textDecoration: "none",
    },
  })
);

export const Budget = () => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("goalAmount");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { state, dispatch } = useContext(Store);
  const { budgets } = state.plaid;

  useEffect(() => {
    getAllBudgets(dispatch);
  }, [dispatch]);

  // create rows with data
  let rows = budgets.map((budget) =>
    createData(
      `${budget.fromDate} / ${budget.toDate}`,
      budget.accountName,
      budget.goalAmount,
      budget.spentAmount,
      budget.budgetMet.toString(),
      budget.id,
      budget.accountId,
      budget.institutionId
    )
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.dateInterval);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  // status is a string value of "0" | "1" | "2"
  const renderBudgetMet = (status: string) => {
    switch (status) {
      case "0":
        return <NotInterestedIcon style={{ fill: "#e63946" }} />;
      case "1":
        return <CheckCircleIcon style={{ fill: "#007f5f" }} />;
      case "2":
        return <AutorenewIcon style={{ fill: "#1d3557" }} />;
      default:
        return status;
    }
  };

  // navigate the user to spending chart to show budget spending
  const handleBudgetClick = (
    dateInterval: string,
    accountId: string,
    institutionId: string
  ) => {
    const [from, to] = dateInterval.split("/");
    setSpendingsLoading(dispatch);
    getSpendings(dispatch, institutionId, accountId, from, to);
  };

  const handleBudgetRemove = (budgetId: string) => {
    removeBudget(dispatch, budgetId);
  };

  return state.auth.isAuthenticated ? (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.budgetId}
                    >
                      <TableCell padding="default" />
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        width="18%"
                      >
                        {row.dateInterval}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          component={Link}
                          to="/spendings"
                          onClick={() =>
                            handleBudgetClick(
                              row.dateInterval,
                              row.accountId,
                              row.institutionId
                            )
                          }
                          variant="contained"
                          color="primary"
                        >
                          {row.accountName}
                        </Button>
                      </TableCell>
                      <TableCell align="right">${row.goalAmount}</TableCell>
                      <TableCell align="right">${row.spentAmount}</TableCell>
                      <TableCell align="right">
                        {renderBudgetMet(row.budgetMet)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleBudgetRemove(row.budgetId)}
                        >
                          <DeleteForeverIcon style={{ fill: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  ) : (
    <Redirect push to="/" />
  );
};
