import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IBudgetAttrs {
  userId: IBudgetDoc["userId"];
  institutionId: IBudgetDoc["institutionId"];
  accountId: IBudgetDoc["accountId"];
  accountName: IBudgetDoc["accountName"];
  fromDate: IBudgetDoc["fromDate"];
  toDate: IBudgetDoc["toDate"];
  goalAmount: IBudgetDoc["goalAmount"];
  spentAmount: IBudgetDoc["spentAmount"];
  budgetMet?: IBudgetDoc["budgetMet"];
}

interface IBudgetDoc extends mongoose.Document {
  userId: string;
  institutionId: string;
  accountId: string;
  accountName: string;
  fromDate: string;
  toDate: string;
  goalAmount: number;
  spentAmount: number;
  budgetMet?: BudgetMet;
}

interface IBudgetModel extends mongoose.Model<IBudgetDoc> {
  build(attrs: IBudgetAttrs): IBudgetDoc;
}

export enum BudgetMet {
  "No",
  "Yes",
  "In Progress",
}

const budgetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    institutionId: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    goalAmount: {
      type: Number,
      required: true,
    },
    spentAmount: {
      type: Number,
      default: 0,
    },
    budgetMet: {
      type: String,
      default: "In Progress",
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

budgetSchema.statics.build = (attrs: IBudgetAttrs) => {
  return new Budget(attrs);
};

const Budget = mongoose.model<IBudgetDoc, IBudgetModel>("Budget", budgetSchema);

export { Budget };
