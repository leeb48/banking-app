import express, { Request, Response } from "express";
import { currentUser } from "../middlewares/current-user";

const router = express.Router();

/**
 * @route   GET /api/auth/current-user
 * @desc    Retrieve information about current user
 * @access  Private
 */

router.get(
  "/api/auth/current-user",
  currentUser,
  async (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
