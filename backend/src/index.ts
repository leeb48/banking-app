import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {
  require("dotenv").config();

  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY not defined");
    }

    if (
      !process.env.PLAID_CLIENT_ID &&
      !process.env.PLAID_SECRET &&
      !process.env.PLAID_ENVIRONMENT
    ) {
      throw new Error("Plaid environment variables not set");
    }

    const mongoURL =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_ATLAS!
        : process.env.MONGO_URL!;

    await mongoose.connect(
      mongoURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      (error) => {
        if (error) {
          console.log("MongoDB could not be connected");
        }
      }
    );

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }

  app.listen(8000, () => {
    console.log("Listening on port 8000");
  });
};

start();
