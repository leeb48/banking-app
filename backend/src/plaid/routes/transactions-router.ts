import express, { Request, Response } from "express";
import { plaidClient } from "../services/plaidClient";
import { currentUser } from "../../auth/middlewares/current-user";
import { requireAuth } from "../../auth/middlewares/require-auth";
import { Account } from "../models/account";
import { BadRequestError } from "../../auth/errors/bad-request-error";

const router = express.Router();

/**
 * @route   GET /api/plaid/get-transactions/:accountId
 * @desc    Get the transacitons history for an account
 *          for the given time period. Default time period
 *          is 30 days.
 * @access  Private
 */
router.get(
  "/api/plaid/get-transactions/:bankId/:accountId/:from/:to",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const { bankId, accountId, from, to } = req.params;

    if (!accountId || !bankId)
      throw new BadRequestError("Account ID or Bank ID not present");

    const bankAccount = await Account.findOne({
      userId: req.currentUser?.id,
      institutionId: bankId,
    });

    if (!bankAccount) throw new BadRequestError("Bank Account not present");

    const transactionRes = await plaidClient.getTransactions(
      bankAccount.accessToken,
      from,
      to,
      {
        account_ids: [accountId],
      }
    );

    res.status(200).send({
      transactions: transactionRes.transactions,
      accountName: transactionRes.accounts[0].name,
      accountId: transactionRes.accounts[0].account_id,
    });
  }
);

/**
 * @route   GET /api/plaid/get-spending/:bankId/:accountId/:from/:to
 * @desc    Processs the transaction data for a time interval so that
 *          it can be represented on a graph in front end react
 * @access  Private
 */
router.get(
  "/api/plaid/get-spending/:bankId/:accountId/:from/:to",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    // Get the transactions for the given period
    const { bankId, accountId, from, to } = req.params;

    if (!accountId || !bankId)
      throw new BadRequestError("Account ID or Bank ID not present");

    const bankAccount = await Account.findOne({
      userId: req.currentUser?.id,
      institutionId: bankId,
    });

    if (!bankAccount) throw new BadRequestError("Bank Account not present");

    try {
      const transactionRes = await plaidClient.getAllTransactions(
        bankAccount.accessToken,
        from.trim(),
        to.trim(),
        {
          account_ids: [accountId],
        }
      );

      const spendingsObj: {
        [category: string]: number;
      } = {};

      // Calculate the spendings for each category
      transactionRes.transactions.forEach((transaction) => {
        if (!spendingsObj[transaction.category![0]])
          spendingsObj[transaction.category![0]] = 0;

        // only include spendings, not refunds or deposits
        if (transaction.amount! > 0) {
          spendingsObj[transaction.category![0]] += transaction.amount!;
        }
      });

      // create graph ready data for frontend
      const spendingsArray: { name: string; y: number }[] = Object.keys(
        spendingsObj
      ).map((key) => {
        return {
          name: key,
          y: spendingsObj[key],
        };
      });
      res.status(200).send({
        dateInterval: `${from} / ${to}`,
        data: spendingsArray,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export { router as transactionsRouter };
