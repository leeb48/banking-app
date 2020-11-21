import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IAccountAttrs {
  userId: IAccountDoc["userId"];
  accessToken: IAccountDoc["accessToken"];
  itemId: IAccountDoc["itemId"];
  institutionId: IAccountDoc["institutionId"];
  institutionName?: IAccountDoc["institutionName"];
  accountName?: IAccountDoc["accountName"];
  accountType?: IAccountDoc["accountType"];
  accountSubType?: IAccountDoc["accountSubType"];
}

interface IAccountDoc extends mongoose.Document {
  userId: string;
  accessToken: string;
  itemId: string;
  institutionId: string;
  institutionName?: string;
  accountName?: string;
  accountType?: string;
  accountSubType?: string;
}

interface IAccountModel extends mongoose.Model<IAccountDoc> {
  build(attrs: IAccountAttrs): IAccountDoc;
}

const accountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    accessToken: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    institutionId: {
      type: String,
      required: true,
    },
    institutionName: {
      type: String,
    },
    accountName: {
      type: String,
    },
    accountType: {
      type: String,
    },
    accountSubType: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

accountSchema.statics.build = (attrs: IAccountAttrs) => {
  return new Account(attrs);
};

const Account = mongoose.model<IAccountDoc, IAccountModel>(
  "Account",
  accountSchema
);

export { Account };
