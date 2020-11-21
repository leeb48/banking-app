import request from "supertest";
import { app } from "../../../app";
import { plaidClient } from "../../services/plaidClient";

it("get transaction history for an account", async () => {
  const cookie = await global.signin();

  //   add a bank account to the user
  const publicTokenRes = await plaidClient.sandboxPublicTokenCreate("ins_1", [
    "auth",
    "transactions",
  ]);

  const { public_token: publicToken } = publicTokenRes;

  //   add bank account
  await request(app)
    .post("/api/plaid/add-account")
    .set("Cookie", cookie)
    .send({
      publicToken,
      metadata: {
        institution: {
          institution_id: "ins_1",
          name: "Bank Of America",
        },
      },
    })
    .expect(201);

  const getAccountsRes = await request(app)
    .get("/api/plaid/get-accounts/ins_1")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  // get the first account's id
  const json = JSON.parse(getAccountsRes.text);
  const accountId = json[0]["account_id"];

  const res = await request(app)
    .get(`/api/plaid/get-transactions/ins_1/${accountId}/2020-08-01/2020-09-01`)
    .set("Cookie", cookie)
    .send()
    .expect(200);
});
