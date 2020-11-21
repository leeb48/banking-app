import { IUser } from "../interfaces";
import { AuthActionTypes } from "./auth.actions";

export interface IRegisterUserAction {
  type: AuthActionTypes.register_user;
  payload: IUser;
}

export type RegisterUserDto = {
  email: string;
  password: string;
};

export interface ILoginUserAction {
  type: AuthActionTypes.login_user;
  payload: IUser;
}

export type LoginUserDto = {
  email: string;
  password: string;
};

export interface IGetCurrentUserAction {
  type: AuthActionTypes.get_current_user;
  payload: IUser;
}

export interface ILogoutUserAction {
  type: AuthActionTypes.logout_user;
}
