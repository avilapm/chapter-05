import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;
let user_test: {
  name: string;
  email: string;
  password: string;
}

describe("Show User Profile Controller", () => {

  beforeAll(async () => {

    connection = await createConnection();
    await connection.runMigrations();

    user_test = {
      name: "userTest",
      email: "userTest@test.com",
      password: "1234"
    }

    await request(app).post("/api/v1/users").send(user_test);

  })

  it("should be able to show an user profile", async () => {


    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user_test.email, password: user_test.password });

    const { token } = response.body;

    const profile = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(profile.body.name).toEqual(user_test.name);
    expect(profile.body.email).toEqual(user_test.email);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should not be able to list non-existing user's profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usernonexistent@email.com",
      password: "no-pass-1234",
    });

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual('Incorrect email or password')
    expect(responseToken.body.token).toBe(undefined)

    const { token } = responseToken.body;

    const response = await request(app)
    .get("/api/v1/profile")
    .set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('JWT invalid token!')
  });


});