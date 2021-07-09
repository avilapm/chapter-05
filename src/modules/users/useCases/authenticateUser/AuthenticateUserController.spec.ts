import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection : Connection;
let user_test: {
  name: string;
  email: string;
  password: string;
}

describe("Authenticate User Controller", () => {

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

  it("should be able to authenticate an user", async () => { 
    
 
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({email: user_test.email, password: user_test.password});

      const { token } = response.body;

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
      expect(response.body.user.email).toEqual(user_test.email)
      expect(token).not.toBeUndefined()

  
  });

  it("should not be able to authenticate a non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usernonexistent@email.com",
      password: "usernonexistentpassword",
    });

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual('Incorrect email or password')
    expect(responseToken.body.token).toBe(undefined)
  });

  it("should not be able to authenticate user with wrong password", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user_test.email,
      password: "wrongpassword",
    });

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual('Incorrect email or password')
    expect(responseToken.body.token).toBe(undefined)
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

});