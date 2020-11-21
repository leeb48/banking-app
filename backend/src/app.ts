import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

// Routes
import { registerRouter } from "./auth/routes/register";
import { errorHandler } from "./auth/middlewares/error-handler";
import { loginRouter } from "./auth/routes/login";
import { currentUserRouter } from "./auth/routes/current-user";
import { logoutRouter } from "./auth/routes/logout";
import { linkTokenRouter } from "./plaid/routes/get-plaid-link-token";
import { accountsRouter } from "./plaid/routes/accounts-router";
import { transactionsRouter } from "./plaid/routes/transactions-router";
import { budgetRouter } from "./plaid/routes/budget-routers";

const app = express();

app.set("trust-proxy", true);
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

// * Auth Routers
app.use(registerRouter);
app.use(loginRouter);
app.use(currentUserRouter);
app.use(logoutRouter);

// * Plaid Routers
app.use(linkTokenRouter);
app.use(accountsRouter);
app.use(transactionsRouter);
app.use(budgetRouter);

// Error Handling Middleware
app.use(errorHandler);

export { app };
