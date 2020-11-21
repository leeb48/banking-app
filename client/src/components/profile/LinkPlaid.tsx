import { Fab, Hidden } from "@material-ui/core";
import React, { useContext, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Store } from "../../store/Store";
import { addBank } from "../../store/actions/plaid.actions";
import AddIcon from "@material-ui/icons/Add";

const LinkPlaid = () => {
  const { state, dispatch } = useContext(Store);

  const onSuccess = useCallback(
    (token, metadata) => {
      addBank(dispatch, token, metadata);
    },
    [dispatch]
  );

  const config = {
    token: state.plaid.linkToken || "",
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return state.plaid.linkToken ? (
    <Fab
      color="primary"
      onClick={() => open()}
      disabled={!ready}
      variant="extended"
    >
      <AddIcon />
      <Hidden smDown>Add Bank Account</Hidden>
    </Fab>
  ) : null;
};

export default LinkPlaid;
