import express, { Request, Response } from "express";
import { BadRequestError } from "../../auth/errors/bad-request-error";
import { currentUser } from "../../auth/middlewares/current-user";
import { requireAuth } from "../../auth/middlewares/require-auth";
import { plaidClient } from "../services/plaidClient";

const router = express.Router();

/**
 * @route   GET /api/plaid/get-link-token
 * @desc    Acquires the link token needed to the authenticate with
 *          plaid API
 * @access  Public
 */
router.get(
  "/api/plaid/get-link-token",
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      throw new BadRequestError("Only logged in users can acquire link token");
    }

    const linkTokenResponse = await plaidClient.createLinkToken({
      user: {
        client_user_id: req.currentUser.email,
      },
      client_name: "Banking App",
      products: ["auth", "transactions"],
      country_codes: ["US"],
      language: "en",
    });

    const linkToken = linkTokenResponse.link_token;

    res.status(200).send(linkToken);
  }
);

export { router as linkTokenRouter };
