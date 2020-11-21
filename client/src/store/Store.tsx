import React from "react";
import { Actions } from "./actions";
import { IState } from "./interfaces";
import { initialState, reducer } from "./reducer";

interface IContextProps {
  state: IState;
  dispatch: (action: Actions) => void;
}

export const Store = React.createContext({} as IContextProps);

export const StoreProvider = ({ children }: JSX.ElementChildrenAttribute) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
};
