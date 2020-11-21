import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-requests";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/auth/register",
  [
    body("email").isEmail().withMessage("Provide a valid email"),
    body("password")
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      throw new BadRequestError("Email already in use");
    }

    user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
      {
        expiresIn: 3600,
      }
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as registerRouter };
