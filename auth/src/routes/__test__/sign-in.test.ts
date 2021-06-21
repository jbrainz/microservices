import request from "supertest"
import { app } from "../../app"

it("fails when an email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@welcome.com",
      password: "welcome",
    })
    .expect(400)
})

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "welcome@mail.com",
      password: "welcome",
    })
    .expect(201)

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "welcome@mail.com",
      password: "wewwwe",
    })
    .expect(400)
})

it("respond with a cookie when given a valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "welcome@mail.com",
      password: "welcome",
    })
    .expect(201)

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "welcome@mail.com",
      password: "welcome",
    })
    .expect(200)
  expect(response.get("Set-Cookie")).toBeDefined()
})
