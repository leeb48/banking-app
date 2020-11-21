import React, { useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Button, Grid } from "@material-ui/core";
import { Store } from "../../store/Store";
import { Fragment } from "react";

import { Link as LinkRouter } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  buttonContainer: {
    marginTop: "3rem",
  },
  buttonText: {
    textDecoration: "none",
    color: "inherit",
  },
}));

export const Landing = () => {
  const classes = useStyles();

  const { state } = useContext(Store);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MonetizationOnIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Banking App
        </Typography>
      </div>

      <Grid
        className={classes.buttonContainer}
        justify="space-around"
        container
      >
        {state.auth.isAuthenticated ? (
          <Fragment>
            <Grid item>
              <Button color="primary" variant="contained">
                <LinkRouter
                  color="primary"
                  className={classes.buttonText}
                  to="/profile"
                >
                  Profile
                </LinkRouter>
              </Button>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid item>
              <Button color="primary" variant="outlined">
                <LinkRouter className={classes.buttonText} to="/register">
                  Register
                </LinkRouter>
              </Button>
            </Grid>
            <Grid item>
              <Button color="primary" variant="contained">
                <LinkRouter className={classes.buttonText} to="/login">
                  Login
                </LinkRouter>
              </Button>
            </Grid>
          </Fragment>
        )}
      </Grid>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};
