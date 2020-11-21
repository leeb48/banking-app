import { Dispatch } from "react";
import { IAlert } from "../interfaces";
import { IRemoveAlertAction, ISetAlertAction } from "./alert.interfaces";
import { v4 as uuidv4 } from "uuid";

export enum AlertActionTypes {
  set_alert = "alert/set",
  remove_alert = "alert/remove",
}

export type AlertActions = ISetAlertAction | IRemoveAlertAction;

export const setAlert = (
  dispatch: Dispatch<ISetAlertAction | IRemoveAlertAction>,
  type: IAlert["type"],
  msg?: string
) => {
  const alertId = uuidv4();

  removeAlert(dispatch, alertId);

  return dispatch({
    type: AlertActionTypes.set_alert,
    payload: {
      type,
      id: alertId,
      msg,
    },
  });
};

const removeAlert = (
  dispatch: Dispatch<IRemoveAlertAction>,
  alertId: string
) => {
  setTimeout(() => {
    return dispatch({
      type: AlertActionTypes.remove_alert,
      payload: alertId,
    });
  }, 4000);
};
