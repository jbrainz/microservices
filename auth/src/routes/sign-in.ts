import express, { Request, Response } from "express"
import { body } from "express-validator"
import { BadRequestError } from "../errors/bad-request-error"
import jwt from "jsonwebtoken"

import { Password } from "../services/password"
import { validationRequest } from "../middlewares/validate-request"
import { User } from "../models/User"

const router = express.Router()
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Enter a valid Email"),
    body("password").trim().notEmpty().withMessage("Please provide a password"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError("Invalid login credentials")
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    )
    if (!passwordMatch) {
      throw new BadRequestError("Invalid login credentials")
    }
    //Generate json web token and
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    )

    //store it on the req object.
    req.session = {
      jwt: userJwt,
    }

    res.status(200).send(existingUser)
  }
)

export { router as signInRouter }
