import plaid from "plaid";
require("dotenv").config();

const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID!,
  secret: process.env.PLAID_SECRET!,
  env:
    process.env.NODE_ENV === "test"
      ? plaid.environments.sandbox
      : plaid.environments.development,
  options: {
    version: "2019-05-29",
  },
});

export { plaidClient };
