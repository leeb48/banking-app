import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

interface IUserAttrs {
  email: IUserDoc["email"];
  password: IUserDoc["password"];
}

interface IUserDoc extends mongoose.Document {
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<IUserDoc> {
  build(attrs: IUserAttrs): IUserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    registerDate: {
      type: Date,
      default: Date.now,
    },
  },

  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret.registerDate;
        delete ret.password;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hash = await PasswordManager.toHash(this.get("password"));

    this.set("password", hash);
  }

  done();
});

userSchema.statics.build = (attrs: IUserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };
