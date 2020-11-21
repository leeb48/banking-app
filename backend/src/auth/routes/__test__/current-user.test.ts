import request from "supertest";
import { app } from "../../../app";

it("response with detauls about the current user", async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get("/api/auth/current-user")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual("test@test.com");
});

it("response with a null if the user is not authenticated", async () => {
  const res = await request(app)
    .get("/api/auth/current-user")
    .send()
    .expect(200);

  expect(res.body.currentUser).toBeNull();
});
