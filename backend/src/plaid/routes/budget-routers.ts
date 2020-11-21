import express, { Request, Response } from "express";
import { BadRequestError } from "../../auth/errors/bad-request-error";
import { currentUser } from "../../auth/middlewares/current-user";
import { requireAuth } from "../../auth/middlewares/require-auth";
import { Account } from "../models/account";
import { Budget, BudgetMet } from "../models/budgets";
import { plaidClient } from "../services/plaidClient";

const router = express.Router();

/**
 * @route
 * @desc
 * @access
 */
router.post(
  "/api/plaid/set-budget",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const {
      fromDate,
      toDate,
      budgetFormData: { selectedBank, selectedAccount, budgetAmount },
    } = req.body;

    const [bankId, bankName] = selectedBank.split(", ");
    const [accountId, accountName] = selectedAccount.split(", ");

    // get the amount already spent during the time interval for the
    // given bank account
    const bankAccount = await Account.findOne({
      userId: req.currentUser!.id,
      institutionId: bankId,
    });

    if (!bankAccount) throw new BadRequestError("Bank Account not present");

    const transactionRes = await plaidClient.getTransactions(
      bankAccount.accessToken,
      fromDate,
      toDate,
      {
        account_ids: [accountId],
      }
    );

    const transactions = transactionRes.transactions;
    let spentAmount: number = 0;
    transactions.forEach((transaction) => {
      if ((transaction.amount as number) > 0)
        spentAmount += transaction.amount as number;
    });

    // round to two decimal points
    spentAmount = Number(spentAmount.toFixed(2));

    let budgetMet = BudgetMet["In Progress"];
    // if toDate is a past date, check to see if the
    // budget has been met
    if (new Date(toDate) <= new Date()) {
      budgetMet = spentAmount <= budgetAmount ? BudgetMet.Yes : BudgetMet.No;
    }

    const newBudget = Budget.build({
      accountId,
      accountName,
      institutionId: bankId,
      userId: req.currentUser!.id,
      fromDate,
      toDate,
      goalAmount: budgetAmount,
      spentAmount,
      budgetMet,
    });

    await newBudget.save();

    res.send({});
  }
);

/**
 * @route
 * @desc
 * @access
 */
router.get(
  "/api/plaid/get-budgets",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const userBudgets = await Budget.find({ userId: req.currentUser!.id });

    // find active budgets
    const activeBudgets = userBudgets.filter(
      (budget) => new Date(budget.toDate) > new Date()
    );

    // * update the spent amount for active budgets
    activeBudgets.forEach(async (budget) => {
      const bankAccount = await Account.findOne({
        userId: req.currentUser!.id,
        institutionId: budget.institutionId,
      });

      if (!bankAccount) throw new BadRequestError("Bank Account not present");

      const transactionRes = await plaidClient.getAllTransactions(
        bankAccount.accessToken,
        budget.fromDate,
        budget.toDate,
        {
          account_ids: [budget.accountId],
        }
      );

      const transactions = transactionRes.transactions;
      let spentAmount: number = 0;
      transactions.forEach((transaction) => {
        if ((transaction.amount as number) > 0)
          spentAmount += transaction.amount as number;
      });

      // round to two decimal points
      spentAmount = Number(spentAmount.toFixed(2));

      // update the amount and the status
      budget.spentAmount = spentAmount;
      budget.budgetMet =
        spentAmount <= budget.goalAmount ? BudgetMet.Yes : BudgetMet.No;

      await budget.save();
    });

    res.status(200).send(userBudgets);
  }
);

/**
 * @route
 * @desc
 * @access
 */
router.delete(
  "/api/plaid/remove-budget/:budgetId",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const { budgetId } = req.params;

    const budget = await Budget.findOne({
      _id: budgetId,
      userId: req.currentUser!.id,
    });

    if (!budget) throw new BadRequestError("Budget was not found");

    await budget.remove();

    res.status(200).send({ success: true });
  }
);

export { router as budgetRouter };
