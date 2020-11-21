import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
      // signin: () => Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  // setup in memory mongodb before any test begins
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  // remove all collections present in mongo before each test
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "123456";

  const res = await request(app)
    .post("/api/auth/register")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = res.get("Set-Cookie");

  return cookie;
};
