import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { body } from 'express-validator'

import { User } from '../models/User'
import { BadRequestError } from '../errors/bad-request-error'
import { validationRequest } from '../middlewares/validate-request'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between  6 and 20 character'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError('Email already in use!')
    }

    const user = User.build({
      email,
      password,
    })
    await user.save()

    //Generate json web token and
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    )

    //store it on the req object.
    req.session = {
      jwt: userJwt,
    }
    res.status(201).send(user)
  }
)

export { router as signUpRouter }
