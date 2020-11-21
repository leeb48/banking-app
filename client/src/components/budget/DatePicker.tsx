import React from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Grid } from "@material-ui/core";

interface IDatePickerProps {
  fromDate: string;
  toDate: string;
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
}

const DatePicker = ({
  setFromDate,
  setToDate,
  fromDate,
  toDate,
}: IDatePickerProps) => {
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

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container alignItems="center" justify="center">
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
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
