import React, { useContext } from "react";
import { Store } from "../../store/Store";
import { Alert as MaterialAlert } from "@material-ui/lab";

const Alert = () => {
  const { state } = useContext(Store);

  const { alert } = state;

  return alert.length > 0 ? (
    <MaterialAlert severity={alert[0].type}>{alert[0].msg}</MaterialAlert>
  ) : null;
};

export default Alert;
