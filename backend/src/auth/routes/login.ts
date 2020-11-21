import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-requests";
import { User } from "../models/user";
import { PasswordManager } from "../services/password-manager";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * @route   POST api/auth/login
 * @desc    Handles user login and sends back jwt token through a cookie
 * @access  Public
 */
router.post(
  "/api/auth/login",
  [
    body("email").isEmail().withMessage("Provide a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check if email is in the DB
    let user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid Credentials");
    }

    // match hashed password
    const passwordMatch = await PasswordManager.compare(
      user.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!,
      {
        expiresIn: 3600,
      }
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  }
);

export { router as loginRouter };
