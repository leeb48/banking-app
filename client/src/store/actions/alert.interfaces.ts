import { IAlert } from "../interfaces";
import { AlertActionTypes } from "./alert.actions";

export interface ISetAlertAction {
  type: AlertActionTypes.set_alert;
  payload: IAlert;
}

export interface IRemoveAlertAction {
  type: AlertActionTypes.remove_alert;
  payload: string;
}
