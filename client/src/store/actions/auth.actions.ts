import { Dispatch } from "react";
import {
  IGetCurrentUserAction,
  ILoginUserAction,
  ILogoutUserAction,
  IRegisterUserAction,
  RegisterUserDto,
} from "./auth.interfaces";
import { axiosConfig } from "../../config/axios.config";
import { setAlert } from "./alert.actions";
import { IRemoveAlertAction, ISetAlertAction } from "./alert.interfaces";

export enum AuthActionTypes {
  register_user = "auth/register",
  login_user = "auth/login",
  get_current_user = "auth/get-current-user",
  logout_user = "auth/logout",
}

export type AuthActions =
  | IRegisterUserAction
  | ILoginUserAction
  | IGetCurrentUserAction
  | ILogoutUserAction;

export const registerUser = async (
  dispatch: Dispatch<
    IRegisterUserAction | ISetAlertAction | IRemoveAlertAction
  >,
  formData: RegisterUserDto
) => {
  try {
    const res = await axiosConfig.post("/auth/register", formData);

    setAlert(dispatch, "success", "Registration Successful");

    return dispatch({
      type: AuthActionTypes.register_user,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        setAlert(dispatch, "error", error.message)
      );
    }
  }
};

export const loginUser = async (
  dispatch: Dispatch<ILoginUserAction | ISetAlertAction | IRemoveAlertAction>,
  formData: RegisterUserDto
) => {
  try {
    const res = await axiosConfig.post("/auth/login", formData);

    setAlert(dispatch, "success", "Login Successful");

    return dispatch({
      type: AuthActionTypes.login_user,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        setAlert(dispatch, "error", error.message)
      );
    }
  }
};

export const getCurrentUser = async (
  dispatch: Dispatch<IGetCurrentUserAction | ILogoutUserAction>
) => {
  try {
    const res = await axiosConfig.get("/auth/current-user");

    if (res.data.currentUser) {
      return dispatch({
        type: AuthActionTypes.get_current_user,
        payload: res.data,
      });
    } else {
      return dispatch({
        type: AuthActionTypes.logout_user,
      });
    }
  } catch (error) {
    console.log(error.response.data.errors);
  }
};

export const logoutUser = async (
  dispatch: Dispatch<ILogoutUserAction | ISetAlertAction | IRemoveAlertAction>
) => {
  try {
    await axiosConfig.post("/auth/logout");

    setAlert(dispatch, "success", "Logout Successful");

    return dispatch({
      type: AuthActionTypes.logout_user,
    });
  } catch (error) {}
};
