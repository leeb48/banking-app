import { Button, Fab, Hidden, Menu, MenuItem } from "@material-ui/core";
import React, { Fragment, useContext } from "react";
import { removeBankAccount } from "../../store/actions/plaid.actions";
import { Store } from "../../store/Store";

import RemoveIcon from "@material-ui/icons/Remove";

const RemoveBankMenu = () => {
  const { state, dispatch } = useContext(Store);
  // Remove Bank Options
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveBank = (bankId: string) => {
    removeBankAccount(dispatch, bankId);
  };
  return (
    <Fragment>
      <Fab color="secondary" variant="extended" onClick={handleClick}>
        <RemoveIcon />

        <Hidden smDown>Remove Bank Account</Hidden>
      </Fab>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {state.plaid.banks.length > 0 ? (
          <div>
            {state.plaid.banks.map((bank) => (
              <MenuItem key={bank.id} onClick={handleClose}>
                <Button onClick={() => handleRemoveBank(bank.id)}>
                  {bank.institutionName}
                </Button>
              </MenuItem>
            ))}
          </div>
        ) : null}
      </Menu>
    </Fragment>
  );
};

export default RemoveBankMenu;
