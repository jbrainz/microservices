import express from "express"
import "express-async-errors"
import cookieSession from "cookie-session"
import { json } from "body-parser"

import { signInRouter } from "./routes/sign-in"
import { signOutRouter } from "./routes/sign-out"
import { signUpRouter } from "./routes/sign-up"
import { currentUserRouter } from "./routes/current-user"
import { errorHandler } from "./middlewares/error-handler"
import { NotFoundError } from "./errors/not-found"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
)

app.use(signInRouter)
app.use(signOutRouter)
app.use(currentUserRouter)
app.use(signUpRouter)

app.all("*", () => {
  throw new NotFoundError()
})
app.use(errorHandler)
export { app }
