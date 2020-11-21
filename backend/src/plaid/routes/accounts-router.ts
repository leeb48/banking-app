import express, { Request, Response } from "express";
import { BadRequestError } from "../../auth/errors/bad-request-error";
import { currentUser } from "../../auth/middlewares/current-user";
import { requireAuth } from "../../auth/middlewares/require-auth";
import { Account } from "../models/account";
import { plaidClient } from "../services/plaidClient";

const router = express.Router();

/**
 * @route   POST /api/plaid/add-account
 * @desc    Create a new account model to store information needed
 *          to access plaidClient
 * @access  Private
 */

router.post(
  "/api/plaid/add-account",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      throw new BadRequestError("Only logged in users can acquire link token");
    }

    const { publicToken, metadata } = req.body;
    const {
      institution_id: institutionId,
      name: institutionName,
    } = metadata.institution;

    if (!publicToken) {
      throw new BadRequestError("Public token is invalid");
    }

    const accessTokenResponse = await plaidClient.exchangePublicToken(
      publicToken
    );

    const accessToken = accessTokenResponse.access_token;
    const itemId = accessTokenResponse.item_id;

    if (!accessToken) {
      throw new BadRequestError("Access token is invalid");
    }

    let account = await Account.findOne({
      userId: req.currentUser.id,
      institutionId,
    });

    if (account) {
      throw new BadRequestError("Account already exists");
    }

    // Create a new account
    account = Account.build({
      userId: req.currentUser.id,
      accessToken,
      itemId,
      institutionId,
      institutionName,
    });

    await account.save();

    res.status(201).send(account);
  }
);

/**
 * @route   GET /api/plaid/get-accounts/
 * @desc    Retrieves all the bank associated with the currently
 *          authenticated user
 * @access  Private
 */
router.get(
  "/api/plaid/get-accounts/",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const accounts = await Account.find({
      userId: req.currentUser!.id,
    });

    if (!accounts) {
      throw new BadRequestError("Accounts do not exist");
    }

    res.status(200).send(accounts);
  }
);

/**
 * @route   Get /api/plaid/get-accounts/:bankId
 * @desc    Retrieve all the accounts associated with a certain bank
 *          such as savings or checking account
 * @access  Private
 */
router.get(
  "/api/plaid/get-accounts/:bankId",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const { bankId } = req.params;

    const account = await Account.findOne({
      userId: req.currentUser!.id,
      institutionId: bankId,
    });

    if (!account) {
      throw new BadRequestError("Account does not exist");
    }

    const { accessToken } = account;

    const getAccountsResponse = await plaidClient.getAccounts(accessToken);

    res.status(200).send(getAccountsResponse.accounts);
  }
);

/**
 * @route   DELETE /api/plaid/accounts/:bankAccountId
 * @desc    Remove a bank associated with the user
 * @access  Private
 */
router.delete(
  "/api/plaid/accounts/:bankAccountId",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const { bankAccountId } = req.params;

    const account = await Account.findOne({
      userId: req.currentUser?.id,
      _id: bankAccountId,
    });

    if (!account) {
      throw new BadRequestError("Account was not found");
    }

    await account.remove();

    res.status(200).send({ success: true });
  }
);

export { router as accountsRouter };
