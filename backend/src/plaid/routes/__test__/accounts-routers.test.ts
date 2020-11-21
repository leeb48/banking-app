import request from "supertest";
import { app } from "../../../app";
import { plaidClient } from "../../services/plaidClient";

it("add a bank account", async () => {
  const cookie = await global.signin();

  const publicTokenRes = await plaidClient.sandboxPublicTokenCreate("ins_1", [
    "auth",
    "transactions",
  ]);

  const { public_token: publicToken } = publicTokenRes;

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
});

it("get all bank accounts for the authenticated user", async () => {
  const cookie = await global.signin();

  //   add two bank accounts to the user
  const publicTokenRes = await plaidClient.sandboxPublicTokenCreate("ins_1", [
    "auth",
    "transactions",
  ]);

  const { public_token: publicToken } = publicTokenRes;

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

  await request(app)
    .post("/api/plaid/add-account")
    .set("Cookie", cookie)
    .send({
      publicToken,
      metadata: {
        institution: {
          institution_id: "ins_2",
          name: "Chase",
        },
      },
    })
    .expect(201);

  await request(app)
    .get("/api/plaid/get-accounts/")
    .set("Cookie", cookie)
    .send()
    .expect(200);
});

it("get all accounts associated with a certain bank", async () => {
  const cookie = await global.signin();

  //   add a bank account to the user
  const publicTokenRes = await plaidClient.sandboxPublicTokenCreate("ins_1", [
    "auth",
    "transactions",
  ]);

  const { public_token: publicToken } = publicTokenRes;

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

  await request(app)
    .get("/api/plaid/get-accounts/ins_1")
    .set("Cookie", cookie)
    .send()
    .expect(200);
});

it("able to remove a bank from the user", async () => {
  const cookie = await global.signin();

  //   add a bank account to the user
  const publicTokenRes = await plaidClient.sandboxPublicTokenCreate("ins_1", [
    "auth",
    "transactions",
  ]);

  const { public_token: publicToken } = publicTokenRes;

  const addBankRes = await request(app)
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

  const jsonRes = JSON.parse(addBankRes.text);
  const bankAccountId = jsonRes["id"];

  // remove the bank from the user
  const res = await request(app)
    .delete(`/api/plaid/accounts/${bankAccountId}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);
});
