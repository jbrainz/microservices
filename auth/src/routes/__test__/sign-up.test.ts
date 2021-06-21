import request from "supertest"
import { app } from "../../app"

it("returns a 201 on successfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "welcome@wel.com",
      password: "password@",
    })
    .expect(201)
})

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "welcome@wel.com",
      password: "password@",
    })
    .expect(201)
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "welcome@wel.com",
      password: "password@",
    })
    .expect(400)
})

it("sets a cookie after succesfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "welcome@wel.com",
      password: "password@",
    })
    .expect(201)

  expect(response.get("Set-Cookie")).toBeDefined()
})
