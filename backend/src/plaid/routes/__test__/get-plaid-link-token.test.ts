import request from "supertest";
import { app } from "../../../app";

it("receive a link token from plaid with proper authentication", async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get("/api/plaid/get-link-token")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(res.text).toBeDefined();
});

it("a 404 response is sent back when a request to get link token without authentication", async () => {
  await request(app).get("/api/plaid/get-link-token").send().expect(401);
});
