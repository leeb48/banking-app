import request from "supertest";
import { app } from "../../../app";

// Register & Login Test
it("fails when an non-existent email is provided", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(400);
});

it("fails when a wrong password is provided", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  await request(app)
    .post("/api/auth/login")
    .send({
      email: "test@test.com",
      password: "1123456",
    })
    .expect(400);
});

it("response with a cookie with valid credentials", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});

// Logout Test
it("user is able to log out", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  const res = await request(app).post("/api/auth/logout").send({}).expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});
